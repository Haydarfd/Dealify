from flask import Blueprint, render_template, request, redirect, url_for, session, flash, jsonify, send_from_directory
from flask_login import current_user, login_required
from app import db
from app.models import Listing, Category, Favorite, User, Subcategory
from app.utils import get_favorite_ids, KEYWORD_CATEGORY_MAP
from sqlalchemy import func, or_
import os

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    """Homepage with featured listings"""
    if 'selected_city' not in session:
        return redirect(url_for('main.select_city'))
    
    listings_count = 0
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        listings_count = user.listings_count if user else 0
    
    categories = {
        'Cars & Vehicles': 'autos_listings',
        'Electronics': 'electronics_listings',
        'Properties For Sale': 'property_listings'
    }
    
    listings = {}
    
    for category_name, var_name in categories.items():
        category = Category.query.filter_by(name=category_name).first()
        if category:
            if session['selected_city'] == 'All Cities':
                results = Listing.query.filter_by(category_id=category.id).order_by(func.random()).limit(8).all()
            else:
                results = Listing.query.filter_by(
                    category_id=category.id,
                    city=session['selected_city']
                ).order_by(func.random()).limit(8).all()
            
            for listing in results:
                if isinstance(listing.image_paths, str):
                    listing.image_paths = listing.image_paths.split(',')
            
            listings[var_name] = results
        else:
            listings[var_name] = []
    
    return render_template('home.html', listings_count=listings_count, **listings)


@main_bp.route('/select-city')
def select_city():
    """City selection page"""
    if 'selected_city' in session:
        return redirect(url_for('main.index'))
    return render_template('select_city.html')


@main_bp.route('/set-city/<city_name>')
def set_city(city_name):
    """Set user's selected city"""
    valid_cities = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
                   'Umm Al-Quwain', 'Ras Al Khaimah', 'Fujairah', 'All Cities']
    
    if city_name in valid_cities:
        session['selected_city'] = city_name
        session.permanent = True
        return redirect(url_for('main.index'))
    else:
        flash('Invalid city selection', 'error')
        return redirect(url_for('main.select_city'))


@main_bp.route('/change-city')
def change_city():
    """Clear selected city and redirect to selection"""
    session.pop('selected_city', None)
    return redirect(url_for('main.select_city'))


@main_bp.route('/category/<category_name>')
def category_page(category_name):
    """Category listings page"""
    if 'selected_city' not in session:
        return redirect(url_for('main.select_city'))
    
    category = Category.query.filter_by(name=category_name).first()
    if not category:
        flash('Category not found.', 'error')
        return redirect(url_for('main.index'))
    
    subcategories = Subcategory.query.filter_by(category_id=category.id).all()
    
    if session['selected_city'] == 'All Cities':
        listings = Listing.query.filter_by(category_id=category.id).all()
    else:
        listings = Listing.query.filter_by(
            category_id=category.id,
            city=session['selected_city']
        ).all()
    
    favorite_ids = get_favorite_ids() if current_user.is_authenticated else []
    
    return render_template('category.html',
                         category=category,
                         listings=listings,
                         favorite_ids=favorite_ids,
                         subcategories=subcategories)


@main_bp.route('/listing-item/<int:listing_id>', methods=['GET'])
def listing_page(listing_id):
    """Individual listing details page"""
    listing = Listing.query.get_or_404(listing_id)
    user = User.query.get(listing.user_id)
    favorite_ids = get_favorite_ids() if current_user.is_authenticated else []
    
    return render_template('listing-details.html',
                         listing=listing,
                         user=user,
                         favorite_ids=favorite_ids)


@main_bp.route('/search')
def search():
    """Search API endpoint"""
    search_term = request.args.get('query', '').strip()
    if not search_term:
        return jsonify([])
    
    terms = search_term.lower().split()
    matched_categories = set()
    
    for term in terms:
        if term in KEYWORD_CATEGORY_MAP:
            matched_categories.update(KEYWORD_CATEGORY_MAP[term])
    
    listings_query = Listing.query
    
    if matched_categories:
        categories = Category.query.filter(
            or_(*[Category.name.ilike(f"%{cat}%") for cat in matched_categories])
        ).all()
        category_ids = [c.id for c in categories]
        listings_query = listings_query.filter(Listing.category_id.in_(category_ids))
    
    fts_vector = func.to_tsvector('english', Listing.title + ' ' + Listing.city + ' ' + Listing.address)
    trigram_sim = func.similarity(Listing.title, search_term)
    
    listings_query = listings_query.filter(
        or_(
            fts_vector.op('@@')(func.plainto_tsquery('english', search_term)),
            trigram_sim > 0.2,
            Listing.description.ilike(f"%{search_term}%"),
            Listing.city.ilike(f"%{search_term}%")
        )
    )
    
    listings = listings_query.order_by(trigram_sim.desc()).limit(20).all()
    
    return jsonify([
        {
            "id": l.id,
            "title": l.title,
            "price": str(l.price) if l.price else "N/A",
            "city": l.city,
            "image": l.image_paths[0] if l.image_paths else "img/placeholder.jpg"
        } for l in listings
    ])


@main_bp.route('/search-results')
def search_results():
    """Search results page"""
    query = request.args.get('query', '').strip()
    if not query:
        return render_template('search_results.html', listings=[], query=query, favorite_ids=[])
    
    terms = query.lower().split()
    matched_categories = set()
    
    for term in terms:
        for keyword, cats in KEYWORD_CATEGORY_MAP.items():
            if term in keyword:
                matched_categories.update(cats)
    
    base_query = Listing.query
    listings = []
    
    if matched_categories:
        categories = Category.query.filter(
            func.lower(Category.name).in_([c.lower() for c in matched_categories])
        ).all()
        category_ids = [c.id for c in categories]
        
        listings = base_query.filter(
            Listing.category_id.in_(category_ids)
        ).order_by(Listing.created_at.desc()).all()
    
    if not listings:
        trigram_sim = func.similarity(Listing.title, query)
        listings = base_query.filter(
            or_(
                func.to_tsvector('english', Listing.title + ' ' + Listing.city + ' ' + Listing.address).op('@@')(
                    func.plainto_tsquery('english', query)
                ),
                trigram_sim > 0.2,
                Listing.title.ilike(f"%{query}%"),
                Listing.description.ilike(f"%{query}%"),
                Listing.city.ilike(f"%{query}%"),
                Listing.address.ilike(f"%{query}%")
            )
        ).order_by(trigram_sim.desc()).limit(50).all()
    
    favorite_ids = get_favorite_ids() if current_user.is_authenticated else []
    return render_template('search_results.html', listings=listings, query=query, favorite_ids=favorite_ids)


@main_bp.route('/filter-listings')
def filter_listings():
    """Filter listings by various criteria"""
    price_filter = request.args.get('price')
    date_filter = request.args.get('date')
    location_filter = request.args.get('location')
    category_name = request.args.get('category', '').strip().lower()
    subcategories = request.args.getlist('subcategories[]')
    
    category = Category.query.filter(db.func.lower(Category.name) == category_name).first()
    if not category:
        return jsonify([])
    
    listings_query = Listing.query.filter_by(category_id=category.id)
    
    if subcategories:
        try:
            subcategory_ids = [int(sub_id) for sub_id in subcategories if sub_id]
            if subcategory_ids:
                listings_query = listings_query.filter(Listing.subcategory_id.in_(subcategory_ids))
        except ValueError:
            pass
    
    if location_filter and location_filter.lower() != "location":
        listings_query = listings_query.filter(Listing.city.ilike(f"%{location_filter.strip()}%"))
    
    if price_filter == "asc":
        listings_query = listings_query.order_by(Listing.price.asc())
    elif price_filter == "desc":
        listings_query = listings_query.order_by(Listing.price.desc())
    
    if date_filter == "newest":
        listings_query = listings_query.order_by(Listing.created_at.desc())
    elif date_filter == "oldest":
        listings_query = listings_query.order_by(Listing.created_at.asc())
    
    listings = listings_query.all()
    
    listings_data = [{
        "id": l.id,
        "title": l.title,
        "price": float(l.price) if l.price else 0,
        "city": l.city,
        "address": l.address,
        "image_paths": l.image_paths or [],
        "thumb_path": l.thumb_path or ''
    } for l in listings]
    
    return jsonify(listings_data)


@main_bp.route('/marketplace')
def marketplace():
    """Marketplace page"""
    return render_template('marketplace.html')


@main_bp.route('/subscriptions')
def subscriptions():
    """Subscriptions/packages page"""
    listings_count = 0
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        listings_count = user.listings_count if user else 0
    if not current_user.is_authenticated:
        return redirect(url_for('auth.login'))
    return render_template('subscriptions.html', listings_count=listings_count)


@main_bp.route('/profile')
@login_required
def profile():
    """User profile page"""
    user = User.query.get(current_user.id)
    show_welcome = session.pop('show_welcome', False)
    return render_template('profile.html', user=user, show_welcome=show_welcome)


@main_bp.route('/profile')
@login_required
def profile_panel():
    """Profile panel"""
    return render_template('profile.html')


@main_bp.route('/aboutus')
def aboutus():
    """About us page"""
    return render_template('about-us.html')


@main_bp.route('/privacy')
def privacy():
    """Privacy policy page"""
    return render_template('privacy.html')


@main_bp.route('/terms')
def terms():
    """Terms of service page"""
    return render_template('terms.html')


@main_bp.route('/contactus')
def contactus():
    """Contact us page"""
    listings_count = 0
    if current_user.is_authenticated:
        user = User.query.get(current_user.id)
        listings_count = user.listings_count if user else 0
    return render_template('contact.html', listings_count=listings_count)


@main_bp.route('/app')
def redirect_app():
    """Smart redirect to app stores"""
    ua = request.headers.get('User-Agent', '').lower()
    
    if 'android' in ua:
        return redirect("https://play.google.com/store/apps/details?id=com.appilix.app1748991432", code=302)
    elif 'iphone' in ua or 'ipad' in ua or 'ipod' in ua:
        return redirect("https://apps.apple.com/us/app/dealify-buy-sell/id6746773484", code=302)
    else:
        return redirect("https://dealify.ae", code=302)


@main_bp.route('/app-ads.txt')
def serve_app_ads():
    """Serve app-ads.txt file"""
    return send_from_directory(
        directory=os.path.abspath(os.path.join(os.path.dirname(__file__), '..')),
        path='app-ads.txt',
        mimetype='text/plain'
    )


@main_bp.route('/.well-known/apple-app-site-association')
def serve_aasa():
    """Serve Apple App Site Association file"""
    return send_from_directory(
        directory=os.path.join(os.path.dirname(__file__), '.well-known'),
        path='apple-app-site-association',
        mimetype='application/json'
    )


@main_bp.route('/set_lang_selected', methods=['POST'])
def set_lang_selected():
    """Set language selected flag"""
    session['lang_selected'] = True
    return '', 204