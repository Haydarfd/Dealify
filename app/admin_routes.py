from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import User, Listing, Report, Category
from app.utils import admin_required
from sqlalchemy import desc

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')


@admin_bp.route('/')
@login_required
@admin_required
def admin_panel():
    """Admin dashboard"""
    return render_template('admin.html')


@admin_bp.route('/get_users', methods=['GET'])
@login_required
@admin_required
def get_users():
    """Get all users for admin panel"""
    from flask import url_for
    
    users = User.query.all()
    user_data = [{
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "phone": user.phone,
        "emirate": user.city,
        "created_at": user.created_at.strftime('%Y-%m-%d %H:%M') if user.created_at else 'N/A',
        "role": user.role,
        "status": user.status if hasattr(user, 'status') else "active",
        "avatar_url": url_for('static', filename='uploads/' + user.avatar) if user.avatar else "",
        "has_avatar": bool(user.avatar)
    } for user in users]
    
    return jsonify(user_data)


@admin_bp.route('/user_count')
@login_required
@admin_required
def admin_user_count():
    """Get total user count"""
    count = User.query.count()
    return jsonify({'count': count})


@admin_bp.route('/listing_count')
@login_required
@admin_required
def admin_listing_count():
    """Get total listing count"""
    count = Listing.query.count()
    return jsonify({'count': count})


@admin_bp.route('/report_count')
@login_required
@admin_required
def admin_report_count():
    """Get total report count"""
    count = Report.query.count()
    return jsonify({'count': count})


@admin_bp.route('/activity_feed')
@login_required
@admin_required
def admin_activity_feed():
    """Get recent activity feed"""
    users = User.query.order_by(desc(User.created_at)).limit(30).all()
    listings = Listing.query.order_by(desc(Listing.created_at)).limit(30).all()
    reports = Report.query.order_by(desc(Report.created_at)).limit(30).all()
    
    activities = []
    
    for u in users:
        activities.append({
            'type': 'user',
            'message': f"{u.name} signed up as a new user",
            'timestamp': u.created_at.isoformat()
        })
    
    for l in listings:
        activities.append({
            'type': 'listing',
            'message': f"\"{l.title}\" was added",
            'timestamp': l.created_at.isoformat()
        })
    
    for r in reports:
        listing = Listing.query.get(r.listing_id)
        title = listing.title if listing else 'Unknown Listing'
        activities.append({
            'type': 'report',
            'message': f"\"{title}\" was reported by user",
            'timestamp': r.created_at.isoformat()
        })
    
    activities.sort(key=lambda x: x['timestamp'], reverse=True)
    return jsonify(activities[:50])


@admin_bp.route('/delete_user/<int:user_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_user(user_id):
    """Delete a user"""
    user = User.query.get(user_id)
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully!"})
    return jsonify({"message": "User not found!"}), 404


@admin_bp.route('/get_listings', methods=['GET'])
@login_required
@admin_required
def get_listings():
    """Get all listings for admin panel"""
    listings = Listing.query.all()
    listing_data = [{
        "id": listing.id,
        "title": listing.title,
        "price": float(listing.price) if listing.price else None,
        "phone": listing.user.phone if listing.user else "N/A",
        "emirate": listing.user.city if listing.user else "N/A",
        "created_at": listing.user.created_at.strftime('%Y-%m-%d %H:%M') if listing.user and listing.user.created_at else "N/A",
        "category_name": listing.category.name if listing.category else "No Category",
        "user_name": listing.user.name if listing.user else "Unknown User",
        "status": listing.status if hasattr(listing, 'status') else 'active'
    } for listing in listings]
    return jsonify(listing_data)


@admin_bp.route('/get_listing/<int:listing_id>')
@login_required
@admin_required
def admin_get_listing(listing_id):
    """Get listing details for admin editing"""
    listing = Listing.query.get_or_404(listing_id)
    return jsonify({
        'title': listing.title,
        'description': listing.description,
        'price': float(listing.price) if listing.price else None,
        'city': listing.city,
        'address': listing.address
    })


@admin_bp.route('/edit_listing/<int:listing_id>', methods=['POST'])
@login_required
@admin_required
def admin_edit_listing(listing_id):
    """Edit listing as admin"""
    listing = Listing.query.get_or_404(listing_id)
    listing.title = request.form.get('title')
    listing.description = request.form.get('description')
    listing.price = request.form.get('price')
    listing.city = request.form.get('city')
    listing.address = request.form.get('address')
    db.session.commit()
    return jsonify({'message': 'Listing updated successfully'})


@admin_bp.route('/delete_listing/<int:listing_id>', methods=['DELETE'])
@login_required
@admin_required
def delete_listing(listing_id):
    """Delete a listing as admin"""
    listing = Listing.query.get(listing_id)
    if listing:
        db.session.delete(listing)
        db.session.commit()
        return jsonify({"message": "Listing deleted successfully!"})
    return jsonify({"message": "Listing not found!"}), 404


@admin_bp.route('/get_reports')
@login_required
@admin_required
def get_reports():
    """Get all reports"""
    reports_data = []
    
    reports = Report.query.join(Listing, Report.listing_id == Listing.id)\
                          .add_columns(
                              Report.id,
                              Report.reason,
                              Listing.id.label("listing_id"),
                              Listing.title.label("listing_title")
                          ).all()
    
    for report in reports:
        reports_data.append({
            'report_id': report.id,
            'listing_id': report.listing_id,
            'listing_title': report.listing_title,
            'reason': report.reason,
            'reported_by': 'Unknown'
        })
    
    return jsonify(reports_data)


@admin_bp.route('/add_listing_count/<int:user_id>', methods=['POST'])
@login_required
@admin_required
def add_listing_count(user_id):
    """Add listings count to a user"""
    from decimal import Decimal
    
    data = request.get_json()
    count = data.get('count')
    
    user = User.query.get_or_404(user_id)
    try:
        user.listings_count += Decimal(count)
        db.session.commit()
        return jsonify({"message": f"{count} listings added to user ID {user_id}."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating listings count."}), 500