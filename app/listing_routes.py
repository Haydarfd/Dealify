from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Listing, Category, Subcategory, User, Favorite, Report
from app.utils import allowed_file, create_thumbnail, save_uploaded_images
from werkzeug.utils import secure_filename
from decimal import Decimal, InvalidOperation
import os
import traceback
import base64
from datetime import datetime

listing_bp = Blueprint('listing', __name__)


@listing_bp.route('/add_listing', methods=['GET', 'POST'])
@login_required
def add_listing():
    """Add new listing"""
    user = User.query.get(current_user.id)
    
    if request.method == 'POST':
        try:
            # Get form data
            title = request.form.get('listing-name', '').strip()
            category_name = request.form.get('category', '').strip()
            subcategory_id = request.form.get('subcategory', '').strip() or None
            price_str = request.form.get('price', '').strip()
            description = request.form.get('description', '').strip()
            city = request.form.get('city', '').strip()
            address1 = request.form.get('address1', '').strip()
            
            # Validate required fields
            if not title:
                flash('Listing name is required', 'error')
                return redirect(url_for('listing.add_listing'))
            if not category_name:
                flash('Category is required', 'error')
                return redirect(url_for('listing.add_listing'))
            if not price_str:
                flash('Price is required', 'error')
                return redirect(url_for('listing.add_listing'))
            
            # Validate price
            try:
                price = Decimal(price_str.replace(',', ''))
                if price < 0:
                    flash('Price cannot be negative', 'error')
                    return redirect(url_for('listing.add_listing'))
            except (ValueError, InvalidOperation):
                flash('Please enter a valid price', 'error')
                return redirect(url_for('listing.add_listing'))
            
            # Check user listings count
            decrement_rules = {
                "Cars & Vehicles": Decimal('6.00'),
                "Motorcycles & Scooters": Decimal('6.00'),
                "Boats": Decimal('6.00'),
                "Properties For Sale": Decimal('12.00'),
                "Properties For Rent": Decimal('12.00'),
                "Advertising Spaces": Decimal('3.00')
            }
            
            decrement_value = decrement_rules.get(category_name, Decimal('0.50'))
            
            if user.listings_count < decrement_value:
                flash(f"You do not have enough listings available. You need at least {decrement_value} listings to add this category.", 'error')
                return redirect(url_for('main.subscriptions'))
            
            # Handle images
            image_paths = []
            thumb_relative_path = None
            
            # License Plate Category: Handle generated image
            if category_name == "License Plates":
                generated_image_data = request.form.get('generatedPlateImage', '')
                
                if not generated_image_data:
                    flash('Please configure your license plate details', 'error')
                    return redirect(url_for('listing.add_listing'))
                
                plate_details = {
                    'emirate': request.form.get('plate-emirate', '').strip(),
                    'vehicle_type': request.form.get('plate-vehicle-type', '').strip(),
                    'code': request.form.get('plate-code', '').strip(),
                    'number': request.form.get('plate-number', '').strip()
                }
                
                image_paths, thumb_relative_path, description = save_uploaded_images(
                    [],
                    category_name=category_name,
                    generated_plate_data=generated_image_data,
                    plate_details=plate_details
                )
            
            # Regular categories: Handle file uploads
            else:
                images = request.files.getlist('image')
                image_paths, thumb_relative_path, _ = save_uploaded_images(images)
            
            # Get category
            category = Category.query.filter_by(name=category_name).first()
            if not category:
                flash("Invalid category", 'error')
                return redirect(url_for('listing.add_listing'))
            
            # Validate subcategory if provided
            subcategory = None
            if subcategory_id:
                try:
                    subcategory_id_int = int(subcategory_id)
                    subcategory = Subcategory.query.filter_by(id=subcategory_id_int, category_id=category.id).first()
                    if not subcategory:
                        flash("Invalid subcategory for selected category", 'error')
                        return redirect(url_for('listing.add_listing'))
                except ValueError:
                    flash("Invalid subcategory ID", 'error')
                    return redirect(url_for('listing.add_listing'))
            
            # Create new listing
            new_listing = Listing(
                user_id=current_user.id,
                category_id=category.id,
                subcategory_id=subcategory.id if subcategory else None,
                title=title,
                description=description,
                price=price,
                city=city,
                address=address1,
                image_paths=image_paths,
                thumb_path=thumb_relative_path
            )
            
            db.session.add(new_listing)
            db.session.commit()
            
            # Update user listings count
            user.listings_count -= decrement_value
            db.session.commit()
            
            flash('Listing added successfully!', 'success')
            return redirect(url_for('listing.listing_confirmed'))
        
        except Exception as e:
            db.session.rollback()
            print(f"ERROR in add_listing: {str(e)}")
            print(traceback.format_exc())
            flash('An error occurred while adding the listing. Please try again.', 'error')
            return redirect(url_for('listing.add_listing'))
    
    # GET request
    try:
        categories_with_subcategories = {}
        categories = Category.query.all()
        
        for category in categories:
            subcategories = Subcategory.query.filter_by(category_id=category.id).all()
            categories_with_subcategories[category.name] = [
                {'id': sub.id, 'name': sub.name} for sub in subcategories
            ]
        
        return render_template('add_listing.html',
                             categories_with_subcategories=categories_with_subcategories,
                             listings_count=user.listings_count)
    
    except Exception as e:
        print(f"Error in GET add_listing: {str(e)}")
        flash('Error loading categories', 'error')
        return render_template('add_listing.html',
                             categories_with_subcategories={},
                             listings_count=user.listings_count)


@listing_bp.route('/get_subcategories')
def get_subcategories():
    """Get subcategories for categories"""
    try:
        categories_with_subcategories = {}
        categories = Category.query.all()
        
        for category in categories:
            subcategories = Subcategory.query.filter_by(category_id=category.id).all()
            categories_with_subcategories[category.name] = [
                {'id': sub.id, 'name': sub.name} for sub in subcategories
            ]
        
        return jsonify(categories_with_subcategories)
    
    except Exception as e:
        print(f"Error in get_subcategories: {str(e)}")
        return jsonify({}), 500


@listing_bp.route('/get_user_listings', methods=['GET'])
@login_required
def get_user_listings():
    """Get listings for current user"""
    listings = Listing.query.filter_by(user_id=current_user.id).all()
    listing_data = [{
        "id": listing.id,
        "title": listing.title,
        "price": float(listing.price) if listing.price else None,
        "category_name": listing.category.name if listing.category else "No Category",
        "city": listing.city or "Unknown",
        "created_at": listing.created_at.isoformat() if listing.created_at else None,
        "status": getattr(listing, "status", "Active"),
        "image_paths": listing.image_paths or []
    } for listing in listings]
    return jsonify(listing_data)


@listing_bp.route('/delete_user_listing/<int:listing_id>', methods=['DELETE'])
@login_required
def delete_user_listing(listing_id):
    """Delete user's own listing"""
    listing = Listing.query.get(listing_id)
    if listing and listing.user_id == current_user.id:
        db.session.delete(listing)
        db.session.commit()
        return jsonify({"message": "Listing deleted successfully!"})
    return jsonify({"message": "Listing not found or you do not have permission to delete it!"}), 404


@listing_bp.route('/get_listing/<int:listing_id>')
@login_required
def get_listing(listing_id):
    """Get listing details for editing"""
    listing = Listing.query.filter_by(id=listing_id, user_id=current_user.id).first()
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    return jsonify({
        'title': listing.title,
        'description': listing.description,
        'price': float(listing.price) if listing.price else None,
        'city': listing.city,
        'address': listing.address
    })


@listing_bp.route('/edit_listing/<int:listing_id>', methods=['POST'])
@login_required
def edit_listing(listing_id):
    """Edit user's listing"""
    listing = Listing.query.filter_by(id=listing_id, user_id=current_user.id).first()
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404
    
    listing.title = request.form.get('title')
    listing.description = request.form.get('description')
    listing.price = request.form.get('price')
    listing.city = request.form.get('city')
    listing.address = request.form.get('address')
    
    db.session.commit()
    return jsonify({'message': 'Listing updated successfully'})


@listing_bp.route('/ListingConfirmed')
def listing_confirmed():
    """Listing confirmation page"""
    return render_template('AfterListing.html')


@listing_bp.route('/report-listing', methods=['POST'])
def report_listing():
    """Report a listing"""
    if not current_user.is_authenticated:
        return redirect(url_for('auth.login'))
    
    listing_id = request.form['listing_id']
    reason = request.form['reason']
    
    report = Report(listing_id=listing_id, reason=reason)
    db.session.add(report)
    db.session.commit()
    
    flash("Thank you. We've received your report.", "success")
    return redirect(request.referrer or url_for('main.index'))


@listing_bp.route('/toggle_favorite/<int:listing_id>', methods=['POST'])
@login_required
def toggle_favorite(listing_id):
    if not current_user.is_authenticated:
        return redirect(url_for('auth.login', next=request.url))
    
    favorite = Favorite.query.filter_by(user_id=current_user.id, listing_id=listing_id).first()
    
    if favorite:
        db.session.delete(favorite)
        is_favorite = False
    else:
        new_fav = Favorite(user_id=current_user.id, listing_id=listing_id)
        db.session.add(new_fav)
        is_favorite = True
    
    db.session.commit()
    
    if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
        return jsonify({'success': True, 'is_favorite': is_favorite})
    return redirect(request.referrer or url_for('main.index'))


@listing_bp.route('/get_user_favorites')
@login_required
def get_user_favorites():
    """Get user's favorite listings"""
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    listings = [Listing.query.get(fav.listing_id) for fav in favorites]
    
    result = [{
        'id': listing.id,
        'title': listing.title,
        'price': listing.price,
        'description': listing.description,
        'image_path': listing.image_paths[0] if listing.image_paths else 'default.jpg'
    } for listing in listings if listing]
    
    return jsonify(result)


@listing_bp.route('/remove_favorite/<int:listing_id>', methods=['DELETE'])
@login_required
def remove_favorite(listing_id):
    """Remove listing from favorites"""
    try:
        favorite = Favorite.query.filter_by(
            user_id=current_user.id,
            listing_id=listing_id
        ).first()
        
        if favorite:
            db.session.delete(favorite)
            db.session.commit()
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'message': 'Favorite not found'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)})


@listing_bp.route('/get_seller_listings/<int:user_id>', methods=['GET'])
def get_seller_listings(user_id):
    """Get listings for a specific seller"""
    from flask import url_for
    
    listings = Listing.query.filter_by(user_id=user_id).all()
    listing_data = []
    
    for l in listings:
        if l.thumb_path:
            img = url_for('static', filename=l.thumb_path.replace("\\", "/"))
        elif l.image_paths:
            img = url_for('static', filename=l.image_paths[0].replace("\\", "/"))
        else:
            img = None
        
        listing_data.append({
            "id": l.id,
            "title": l.title,
            "price": float(l.price) if l.price else None,
            "city": l.city,
            "image_url": img
        })
    
    return jsonify(listing_data)


@listing_bp.route('/debug/uploads')
def debug_uploads():
    """Debug endpoint to check upload directory contents"""
    from flask import current_app
    
    upload_dir = current_app.config['UPLOAD_FOLDER']
    files = []
    
    if os.path.exists(upload_dir):
        for f in os.listdir(upload_dir):
            file_path = os.path.join(upload_dir, f)
            if os.path.isfile(file_path):
                files.append({
                    'name': f,
                    'size': os.path.getsize(file_path),
                    'type': 'file'
                })
            else:
                files.append({
                    'name': f,
                    'type': 'directory'
                })
    
    return jsonify({
        'upload_dir': upload_dir,
        'exists': os.path.exists(upload_dir),
        'files': files
    })
    
