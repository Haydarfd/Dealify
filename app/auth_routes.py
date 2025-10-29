from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User
from app.utils import clean_phone_number, generate_otp, send_otp_via_twilio
from sqlalchemy.exc import IntegrityError
import re
import requests
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import jwt
from jwt.algorithms import RSAAlgorithm
import os
import firebase_admin.auth as firebase_auth

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    """User signup"""
    if current_user.is_authenticated:
        return redirect(url_for('main.profile_panel'))
    
    if request.method == 'POST':
        name = request.form['username']
        email = request.form['email']
        phone = request.form['phone']
        password = request.form['password']
        password_confirm = request.form['password_confirm']
        city = request.form['city']
        
        if not re.match(r'^\d{8,15}$', phone):
            flash('Invalid phone number. Use digits only (8-15 characters).', 'error')
            return redirect(url_for('auth.signup'))
        
        if not re.match(r'^[^@]+@[^@]+\.[^@]+$', email):
            flash('Invalid email address.', 'error')
            return redirect(url_for('auth.signup'))
        
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered.', 'error')
            return redirect(url_for('auth.signup'))
        
        if password != password_confirm:
            flash('Passwords do not match', 'error')
            return redirect(url_for('auth.signup'))
        
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            password_hash=generate_password_hash(password),
            city=city
        )
        db.session.add(new_user)
        db.session.commit()
        
        session['came_from'] = 'signup'
        login_user(new_user)
        session['show_welcome'] = True
        
        flash('Welcome to Dealify! Your account was created and you\'re now logged in.', 'success')
        return redirect(url_for('main.profile_panel'))
    
    return render_template('signup.html')


@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if current_user.is_authenticated:
        return redirect(url_for('main.profile_panel'))
    
    if request.method == 'POST':
        email = request.form['email'].strip().lower()
        password = request.form['password']
        remember = request.form.get('remember') == 'on'
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            session['prefill_email'] = email
            flash("No account found. Redirected to Sign Up.", "error")
            return redirect(url_for('auth.signup'))
        
        if not check_password_hash(user.password_hash, password):
            session['prefill_email'] = email
            flash('Invalid email or password.', 'error')
            return redirect(url_for('auth.login'))
        
        session['came_from'] = 'login'
        login_user(user, remember=remember)
        flash('Login successful!', 'success')
        return redirect(url_for('main.profile_panel'))
    
    return render_template('login.html')


@auth_bp.route('/logout', methods=['GET', 'POST'])
@login_required
def logout():
    """User logout"""
    if request.method == 'POST':
        logout_user()
        flash('You have been logged out.', 'success')
        return redirect(url_for('auth.login'))
    return redirect(url_for('main.index'))


@auth_bp.route('/google_login', methods=['POST'])
def google_login():
    """Google OAuth login"""
    token = request.json.get('token')
    
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv('GOOGLE_CLIENT_ID', '828643865110-2g1ck8e814o93r7b3mja4tbnms41vsb8.apps.googleusercontent.com')
        )
        
        email = idinfo['email']
        full_name = idinfo.get('name')
        
        user = User.query.filter_by(email=email).first()
        if user:
            login_user(user)
            return jsonify({'status': 'existing'})
        else:
            session['temp_user_data'] = {
                'email': email,
                'full_name': full_name or 'Google User',
                'provider': 'google'
            }
            return jsonify({'status': 'new'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


@auth_bp.route('/complete_google_signup', methods=['GET'])
def complete_google_signup():
    """Complete Google signup with additional info"""
    if current_user.is_authenticated:
        return redirect(url_for('main.profile_panel'))
    
    temp_data = session.get('temp_user_data')
    if not temp_data:
        return redirect('/signup')
    
    return render_template('complete_google_signup.html',
                           full_name=temp_data['full_name'],
                           email=temp_data['email'])


@auth_bp.route('/finalize_google_signup', methods=['POST'])
def finalize_google_signup():
    """Finalize Google/Apple signup"""
    temp_data = session.get('temp_user_data')
    if not temp_data:
        flash("Session expired. Please try again.", "danger")
        return redirect('/signup')
    
    email = temp_data.get('email')
    full_name = request.form.get('full_name')
    provider = temp_data.get('provider', 'unknown')
    
    phone = request.form.get('phone')
    city = request.form.get('emirate')
    
    if not phone or not city:
        flash("All fields are required.", "danger")
        return redirect(url_for('auth.complete_google_signup'))
    
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        login_user(existing_user)
        return redirect(url_for('main.profile_panel'))
    
    existing_phone_user = User.query.filter_by(phone=phone).first()
    if existing_phone_user:
        flash("Phone number is already registered. Try logging in.", "danger")
        return redirect(url_for('auth.complete_google_signup'))
    
    new_user = User(
        name=full_name,
        email=email,
        phone=phone,
        city=city,
        password_hash=generate_password_hash('oauth_user')
    )
    db.session.add(new_user)
    db.session.commit()
    login_user(new_user)
    session.pop('temp_user_data', None)
    
    flash("Welcome to Dealify! Your account has been created.", "success")
    return redirect(url_for('main.profile_panel'))


@auth_bp.route('/apple_login', methods=['POST'])
def apple_login():
    """Apple Sign In"""
    data = request.get_json()
    identity_token = data.get('identityToken')
    full_name = data.get('fullName')
    
    try:
        headers = jwt.get_unverified_header(identity_token)
        kid = headers['kid']
        
        apple_keys_url = 'https://appleid.apple.com/auth/keys'
        res = requests.get(apple_keys_url)
        res.raise_for_status()
        keys = res.json()['keys']
        
        key_data = next((k for k in keys if k['kid'] == kid), None)
        if not key_data:
            return jsonify({'error': 'Unable to find Apple public key'}), 400
        
        public_key = RSAAlgorithm.from_jwk(key_data)
        
        decoded = jwt.decode(
            identity_token,
            public_key,
            algorithms=['RS256'],
            audience=os.getenv('APPLE_CLIENT_ID'),
            issuer='https://appleid.apple.com'
        )
        
        email = decoded.get('email')
        if not email:
            return jsonify({'error': 'Email not found in token'}), 400
        
        user = User.query.filter_by(email=email).first()
        if user:
            login_user(user)
            return jsonify({'status': 'existing'})
        else:
            session['temp_user_data'] = {
                'email': email,
                'full_name': full_name or 'Apple User',
                'provider': 'apple'
            }
            return jsonify({'status': 'new'})
    
    except Exception as e:
        print("Apple login error:", str(e))
        return jsonify({'error': 'Invalid Apple token', 'details': str(e)}), 400


@auth_bp.route('/verify-otp', methods=['GET', 'POST'])
def verify_otp():
    """OTP verification page"""
    if current_user.is_authenticated:
        return redirect(url_for('main.profile_panel'))
    return render_template('verify_otp.html')


@auth_bp.route('/complete-signup', methods=['POST'])
def complete_signup():
    """Complete signup with Firebase phone verification"""
    if current_user.is_authenticated:
        return jsonify({
            'success': False,
            'message': 'You are already logged in.',
            'redirect_url': url_for('main.profile_panel')
        })
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'Invalid request data.'
            }), 400
        
        id_token = data.get('firebase_id_token')
        if not id_token:
            return jsonify({
                'success': False,
                'message': 'Phone verification required.'
            }), 400
        
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            phone_number = decoded_token.get('phone_number')
        except Exception as e:
            return jsonify({
                'success': False,
                'message': 'Invalid phone verification token.'
            }), 400
        
        name = data.get('username')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        city = data.get('city')
        
        if not phone_number or not phone.endswith(phone_number[-9:]):
            return jsonify({
                'success': False,
                'message': 'Phone number mismatch with verification.'
            }), 400
        
        new_user = User(
            name=name,
            email=email,
            phone=phone,
            password_hash=generate_password_hash(password),
            city=city
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        login_user(new_user)
        session['show_welcome'] = True
        
        return jsonify({
            'success': True,
            'message': 'Welcome to Dealify! Your account was created successfully.',
            'redirect_url': url_for('main.profile_panel')
        })
    
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'This email or phone is already registered.'
        }), 400
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An error occurred during registration. Please try again.'
        }), 500


@auth_bp.route('/complete_profile', methods=['GET', 'POST'])
@login_required
def complete_profile():
    """Complete user profile"""
    if request.method == 'POST':
        phone = request.form.get('phone')
        city = request.form.get('city')
        
        current_user.phone = phone
        current_user.city = city
        db.session.commit()
        
        return redirect('/profile')
    
    return render_template('complete_profile.html')