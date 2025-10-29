from flask import Blueprint, request, jsonify, redirect, url_for, current_app
from flask_login import login_required, current_user
from flask_mail import Message
from app import db, mail
from app.models import Package, User
from decimal import Decimal
import stripe
import os
from datetime import datetime
from werkzeug.utils import secure_filename

api_bp = Blueprint('api', __name__)

# Global variable for paid listings (consider using database instead)
paid_listings = []


@api_bp.route('/packages', methods=['GET'])
def get_packages():
    """Get all available packages"""
    packages = Package.query.all()
    package_list = [
        {"id": p.id, "name": p.name, "price": float(p.price), "max_listings": p.max_listings}
        for p in packages
    ]
    return jsonify(package_list)


@api_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    """Create Stripe checkout session"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Invalid request'}), 400
        
        package_id = data.get('packageId')
        price = data.get('price')
        package_name = data.get('packageName')
        max_listings = data.get('maxListings')
        user_id = data.get('userId')
        
        if not package_id or not price or not package_name or not user_id:
            return jsonify({'error': 'Missing parameters'}), 400
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'aed',
                    'product_data': {
                        'name': package_name,
                    },
                    'unit_amount': int(float(price) * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://dealify.ae/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://dealify.ae/subscriptions',
            metadata={
                'user_id': str(user_id),
                'package_id': str(package_id)
            }
        )
        
        return jsonify({'id': session.id})
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'error': str(e)}), 500


@api_bp.route('/success')
def success():
    """Handle successful payment"""
    try:
        session_id = request.args.get('session_id')
        session = stripe.checkout.Session.retrieve(session_id)
        
        user_id = session.metadata['user_id']
        package_id = session.metadata['package_id']
        
        user = User.query.get(user_id)
        package = Package.query.get(package_id)
        
        if user and package:
            user.listings_count += Decimal(package.max_listings)
            db.session.commit()
            return redirect(url_for('api.payment_success_page'))
        else:
            return "User or package not found", 404
    
    except Exception as e:
        print("Error:", str(e))
        return "Something went wrong: " + str(e), 500


@api_bp.route('/payment_success', methods=['GET'])
def payment_success_page():
    """Payment success page"""
    return redirect(url_for('api.legacy_payment_success'))


@api_bp.route('/payment_success_page')
def legacy_payment_success():
    """Legacy payment success page"""
    return render_template('payment_success.html')


@api_bp.route('/stripe-webhook', methods=['POST'])
def stripe_webhook():
    """Handle Stripe webhooks"""
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, current_app.config['STRIPE_WEBHOOK_SECRET']
        )
    except ValueError:
        return 'Invalid payload', 400
    except stripe.error.SignatureVerificationError:
        return 'Invalid signature', 400
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session['metadata']['user_id']
        package_id = session['metadata']['package_id']
        
        user = User.query.get(user_id)
        package = Package.query.get(package_id)
        user.listings_count += package.max_listings
        db.session.commit()
    
    return 'Success', 200


@api_bp.route('/create-payment', methods=['POST'])
@login_required
def create_payment():
    """Create payment for listing (deprecated)"""
    listing_id = request.form.get('listing_id')
    listing = Listing.query.get_or_404(listing_id)
    
    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'aed',
                    'product_data': {
                        'name': listing.title,
                    },
                    'unit_amount': int(listing.price * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=url_for('api.payment_success', listing_id=listing.id, _external=True),
            cancel_url=url_for('api.payment_cancel', _external=True),
        )
        return jsonify({'url': checkout_session.url})
    except Exception as e:
        return jsonify(error=str(e)), 500


@api_bp.route('/payment-success/<int:listing_id>')
@login_required
def payment_success(listing_id):
    """Handle successful listing payment"""
    from app.models import Listing
    from flask import flash
    
    listing = Listing.query.get_or_404(listing_id)
    paid_listings.append(listing)
    
    flash('Payment successful! Your listing is now secured with Dealify.', 'success')
    return redirect(url_for('main.listing_page', listing_id=listing.id))


@api_bp.route('/payment-cancel')
@login_required
def payment_cancel():
    """Handle canceled payment"""
    from flask import flash
    
    flash('Payment was canceled.', 'warning')
    return redirect(url_for('main.marketplace'))


@api_bp.route('/send-email', methods=['POST'])
def send_email():
    """Send contact form email"""
    data = request.form
    file = request.files.get('fileUpload')
    
    msg = Message("New Contact Form Submission",
                  sender='your-email@gmail.com',
                  recipients=['dealifyuae@gmail.com'])
    msg.body = f"""
    Name: {data.get('firstName')} {data.get('lastName')}
    Email: {data.get('email')}
    Message: {data.get('message')}
    """
    
    if file:
        msg.attach(file.filename, file.content_type, file.read())
    
    mail.send(msg)
    return jsonify({"message": "Email sent successfully!"}), 200


@api_bp.route('/appilix-purchase-verify')
def appilix_purchase_verify():
    """Verify Appilix in-app purchase"""
    try:
        user_id = request.args.get('user_id')
        package_id = request.args.get('package_id')
        
        user = User.query.get(user_id)
        package = Package.query.get(package_id)
        
        if user and package:
            user.listings_count += Decimal(package.max_listings)
            db.session.commit()
            return redirect(url_for('api.payment_success_page'))
        
        return "User or package not found", 404
    
    except Exception as e:
        print("Error:", str(e))
        return "Something went wrong: " + str(e), 500


@api_bp.route('/upload_avatar', methods=['POST'])
@login_required
def upload_avatar():
    """Upload user avatar"""
    if 'avatar' not in request.files:
        return jsonify({'success': False, 'message': 'No file uploaded'})
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})
    
    if file:
        # Delete old avatar file if it exists
        if current_user.avatar:
            old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], current_user.avatar)
            if os.path.exists(old_path):
                os.remove(old_path)
        
        # Save new avatar
        filename = secure_filename(f"user_{current_user.id}_avatar.jpg")
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Update user model
        current_user.avatar = filename
        db.session.commit()
        
        # Return with timestamp for cache refresh
        return jsonify({
            'success': True,
            'avatar_url': url_for('static', filename=f'uploads/{filename}') + f'?v={int(datetime.utcnow().timestamp())}'
        })
    
    return jsonify({'success': False, 'message': 'Upload failed'})


@api_bp.route('/get_user_avatar')
def get_user_avatar():
    """Get user avatar URL"""
    if current_user.is_authenticated and current_user.avatar:
        return jsonify({
            'avatar_url': url_for('static', filename=f'uploads/{current_user.avatar}') + f'?v={int(datetime.utcnow().timestamp())}'
        })
    return jsonify({'avatar_url': url_for('static', filename='img/avatarblue.png')})


@api_bp.route('/remove_avatar', methods=['POST'])
@login_required
def remove_avatar():
    """Remove user avatar"""
    if current_user.avatar:
        try:
            old_path = os.path.join(current_app.config['UPLOAD_FOLDER'], current_user.avatar)
            if os.path.exists(old_path):
                os.remove(old_path)
            
            current_user.avatar = None
            db.session.commit()
            
            return jsonify({
                'success': True,
                'default_avatar': url_for('static', filename='img/avatarblue.png')
            })
        except Exception as e:
            db.session.rollback()
            return jsonify({'success': False, 'message': str(e)})
    
    return jsonify({'success': True, 'default_avatar': url_for('static', filename='img/avatarblue.png')})


@api_bp.route('/update_profile_name', methods=['POST'])
@login_required
def update_profile_name():
    """Update user profile name"""
    data = request.get_json()
    new_name = data.get('name', '').strip()
    
    if not new_name:
        return jsonify({'success': False, 'message': 'Name cannot be empty'})
    
    try:
        current_user.name = new_name
        db.session.commit()
        return jsonify({'success': True})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)})


@api_bp.route('/delete_my_account', methods=['DELETE'])
@login_required
def delete_my_account():
    """Delete current user's account"""
    from flask_login import logout_user
    
    lang = request.headers.get('X-Lang', 'en')
    messages = {
        'success': {
            'en': "Your account has been deleted.",
            'ar': "تم حذف حسابك بنجاح."
        },
        'error': {
            'en': "An error occurred while deleting your account.",
            'ar': "حدث خطأ أثناء حذف حسابك."
        }
    }
    
    user = current_user
    try:
        db.session.delete(user)
        db.session.commit()
        logout_user()
        return jsonify({"success": True, "message": messages['success'].get(lang, messages['success']['en'])})
    except Exception:
        db.session.rollback()
        return jsonify({"success": False, "message": messages['error'].get(lang, messages['error']['en'])}), 500


@api_bp.route('/submit_verification', methods=['POST'])
@login_required
def submit_verification():
    """Submit verification documents"""
    try:
        full_name = request.form.get('full_name')
        front_image = request.files.get('emirates_id_front')
        back_image = request.files.get('emirates_id_back')
        
        if not (full_name and front_image and back_image):
            flash('All fields are required.', 'error')
            return redirect(url_for('main.profile_panel'))
        
        # Save images temporarily
        timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
        front_filename = f"verify_front_{current_user.id}_{timestamp}.jpg"
        back_filename = f"verify_back_{current_user.id}_{timestamp}.jpg"
        front_path = os.path.join(current_app.config['UPLOAD_FOLDER'], front_filename)
        back_path = os.path.join(current_app.config['UPLOAD_FOLDER'], back_filename)
        
        front_image.save(front_path)
        back_image.save(back_path)
        
        # Send Email with Attachments
        msg = Message(
            subject="New Verification Submission",
            sender="your-email@gmail.com",
            recipients=["dealifyuae@gmail.com"]
        )
        msg.body = f"""
        New verification request submitted:
        
        Full Name: {full_name}
        User ID: {current_user.id}
        Email: {current_user.email}
        """
        
        with open(front_path, 'rb') as f:
            msg.attach(front_filename, "image/jpeg", f.read())
        
        with open(back_path, 'rb') as b:
            msg.attach(back_filename, "image/jpeg", b.read())
        
        mail.send(msg)
        
        flash("✅ We've received your verification request. Please allow up to 24 hours for review.", "success")
        return render_template('thank_you.html')
    
    except Exception as e:
        print("❌ Email send error:", str(e))
        return f"Internal Server Error: {str(e)}", 500