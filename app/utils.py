import os
import re
import random
import base64
from io import BytesIO
from PIL import Image
from flask import current_app, url_for
from werkzeug.utils import secure_filename
from twilio.rest import Client
from functools import wraps
from flask import redirect, url_for, flash
from flask_login import current_user


# Keyword to category mapping
KEYWORD_CATEGORY_MAP = {
    # 🚗 Cars & Vehicles
    "car": ["Cars & Vehicles"],
    "cars": ["Cars & Vehicles"],
    "vehicle": ["Cars & Vehicles"],
    "vehicles": ["Cars & Vehicles"],
    "sayara": ["Cars & Vehicles"],
    "sayarat": ["Cars & Vehicles"],
    "سيارة": ["Cars & Vehicles"],
    "سيارات": ["Cars & Vehicles"],
    "sedan": ["Cars & Vehicles"],
    "suv": ["Cars & Vehicles"],
    "truck": ["Cars & Vehicles"],
    "jeep": ["Cars & Vehicles"],
    "van": ["Cars & Vehicles"],
    "pickup": ["Cars & Vehicles"],
    "4x4": ["Cars & Vehicles"],
    
    # 🏍️ Motorcycles & Scooters
    "bike": ["Motorcycles & Scooters"],
    "motor": ["Motorcycles & Scooters"],
    "motorcycle": ["Motorcycles & Scooters"],
    "scooter": ["Motorcycles & Scooters"],
    "moto": ["Motorcycles & Scooters"],
    "دراجة": ["Motorcycles & Scooters"],
    "موتور": ["Motorcycles & Scooters"],
    "سكوتر": ["Motorcycles & Scooters"],
    "بسكليت": ["Motorcycles & Scooters"],
    
    # 🏠 Properties
    "home": ["Properties For Sale", "Properties For Rent"],
    "house": ["Properties For Sale", "Properties For Rent"],
    "villa": ["Properties For Sale", "Properties For Rent"],
    "flat": ["Properties For Sale", "Properties For Rent"],
    "apartment": ["Properties For Sale", "Properties For Rent"],
    "property": ["Properties For Sale", "Properties For Rent"],
    "real estate": ["Properties For Sale", "Properties For Rent"],
    "بيت": ["Properties For Sale", "Properties For Rent"],
    "فيلا": ["Properties For Sale", "Properties For Rent"],
    "شقة": ["Properties For Sale", "Properties For Rent"],
    "منزل": ["Properties For Sale", "Properties For Rent"],
    "عقار": ["Properties For Sale", "Properties For Rent"],
    
    # 📱 Electronics
    "phone": ["Electronics"],
    "laptop": ["Electronics"],
    "pc": ["Electronics"],
    "tv": ["Electronics"],
    "tablet": ["Electronics"],
    "mobile": ["Electronics"],
    "iphone": ["Electronics"],
    "samsung": ["Electronics"],
    "جوال": ["Electronics"],
    "موبايل": ["Electronics"],
    "تابلت": ["Electronics"],
    "تلفزيون": ["Electronics"],
    "كمبيوتر": ["Electronics"],
    "لاب": ["Electronics"],
    
    # 🛥️ Boats
    "boat": ["Boats"],
    "yacht": ["Boats"],
    "jet": ["Boats"],
    "jetski": ["Boats"],
    "قارب": ["Boats"],
    "يخت": ["Boats"],
    "جت": ["Boats"],
    "جتسكي": ["Boats"],
    
    # 📛 License Plates
    "plate": ["License Plates"],
    "number": ["License Plates"],
    "رقم": ["License Plates"],
    "نمرة": ["License Plates"],
    "license": ["License Plates"],
    "لوحة": ["License Plates"],
    
    # 🧠 Jobs
    "job": ["Jobs & Freelance"],
    "freelance": ["Jobs & Freelance"],
    "vacancy": ["Jobs & Freelance"],
    "وظيفة": ["Jobs & Freelance"],
    "وظائف": ["Jobs & Freelance"],
    "فرصة": ["Jobs & Freelance"],
    
    # 📢 Advertising
    "ad": ["Advertising Spaces"],
    "ads": ["Advertising Spaces"],
    "billboard": ["Advertising Spaces"],
    "hoarding": ["Advertising Spaces"],
    "اعلان": ["Advertising Spaces"],
    "اعلانات": ["Advertising Spaces"],
    "لوحة": ["Advertising Spaces"],
    
    # 👶 Kids
    "baby": ["Kids, Toys & Baby"],
    "toys": ["Kids, Toys & Baby"],
    "طفل": ["Kids, Toys & Baby"],
    "لعب": ["Kids, Toys & Baby"],
    "بيبي": ["Kids, Toys & Baby"],
    
    # 🐶 Pets
    "pet": ["Pets & Pet Supplies"],
    "dog": ["Pets & Pet Supplies"],
    "cat": ["Pets & Pet Supplies"],
    "fish": ["Pets & Pet Supplies"],
    "حيوان": ["Pets & Pet Supplies"],
    "كلب": ["Pets & Pet Supplies"],
    "قط": ["Pets & Pet Supplies"],
    "حيوانات": ["Pets & Pet Supplies"],
    
    # 📚 Books
    "book": ["Books"],
    "كتب": ["Books"],
    "موسوعة": ["Books"],
    
    # 👗 Fashion
    "dress": ["Women's Apparel", "Men's Apparel"],
    "abaya": ["Women's Apparel"],
    "clothes": ["Women's Apparel", "Men's Apparel"],
    "ملابس": ["Women's Apparel", "Men's Apparel"],
    "ثوب": ["Men's Apparel"],
    "جلابية": ["Men's Apparel"],
    "عبي": ["Women's Apparel"],
    
    # 🎫 Tickets
    "ticket": ["Tickets & Experiences"],
    "event": ["Tickets & Experiences"],
    "حفلة": ["Tickets & Experiences"],
    "فعالية": ["Tickets & Experiences"],
    
    # 🧳 Misc
    "misc": ["Miscellaneous"],
    "stuff": ["Miscellaneous"],
    "other": ["Miscellaneous"],
    "أخرى": ["Miscellaneous"],
    "متنوع": ["Miscellaneous"],
}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']


def clean_phone_number(phone):
    """Sanitize and clean phone number"""
    cleaned_number = re.sub(r'\D', '', phone)
    
    # Lebanon number (8 digits)
    if len(cleaned_number) == 8:
        return '+961' + cleaned_number
    
    # UAE mobile (should be 9 digits starting with 5 after +971)
    if cleaned_number.startswith('971') and len(cleaned_number) == 12:
        return '+' + cleaned_number
    
    # If it already starts with country code and is valid length
    if cleaned_number.startswith('961') and len(cleaned_number) == 11:
        return '+' + cleaned_number
    
    return phone


def generate_otp():
    """Generate a 6-digit OTP"""
    return str(random.randint(100000, 999999))


def send_otp_via_twilio(phone, otp):
    """Send OTP via Twilio"""
    client = Client(
        current_app.config['TWILIO_ACCOUNT_SID'],
        current_app.config['TWILIO_AUTH_TOKEN']
    )
    try:
        message = client.messages.create(
            body=f'Your verification code is {otp}',
            from_='+19785479518',
            to=phone
        )
        print(f"Message sent. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Error sending OTP: {e}")
        return False


def create_thumbnail(original_path, thumb_path, max_size_kb=100, quality_step=5):
    """Create optimized thumbnail from image"""
    img = Image.open(original_path)
    img = img.convert("RGB")
    quality = 85
    
    while True:
        buffer = BytesIO()
        img.save(buffer, format="JPEG", quality=quality)
        size_kb = buffer.tell() / 1024
        if size_kb <= max_size_kb or quality <= 10:
            break
        quality -= quality_step
    
    with open(thumb_path, 'wb') as f:
        f.write(buffer.getvalue())


def admin_required(f):
    """Decorator to require admin role"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or current_user.role != 'admin':
            flash('You do not have permission to access this page.', 'error')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function


def get_favorite_ids():
    """Get list of favorite listing IDs for current user"""
    from app.models import Favorite
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    return [fav.listing_id for fav in favorites]


def save_uploaded_images(images, category_name=None, generated_plate_data=None, plate_details=None):
    """
    Save uploaded images and return paths
    
    Args:
        images: List of file objects from request.files.getlist()
        category_name: Category name for special handling (e.g., "License Plates")
        generated_plate_data: Base64 encoded plate image for License Plates
        plate_details: Dict with plate details for description
    
    Returns:
        tuple: (image_paths, thumb_relative_path, description)
    """
    image_paths = []
    thumb_relative_path = None
    description = ""
    
    # License Plate Category: Handle generated image
    if category_name == "License Plates" and generated_plate_data:
        try:
            # Extract plate details for description
            if plate_details:
                description = f"• Emirate: {plate_details.get('emirate', '')}\n"
                description += f"• Vehicle Type: {plate_details.get('vehicle_type', '')}\n"
                if plate_details.get('code'):
                    description += f"• Plate Code: {plate_details['code']}\n"
                description += f"• Plate Number: {plate_details.get('number', '')}"
            
            # Decode base64 image
            image_data = generated_plate_data.split(',')[1]
            image_bytes = base64.b64decode(image_data)
            
            # Generate unique filename
            import uuid
            filename = f"plate_{uuid.uuid4().hex[:12]}.png"
            filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
            
            # Save image
            with open(filepath, 'wb') as f:
                f.write(image_bytes)
            
            relative_path = os.path.join('uploads', filename).replace('\\', '/')
            image_paths.append(relative_path)
            
            # Generate thumbnail
            thumb_filename = f"thumb_{filename}"
            thumb_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'thumbs')
            os.makedirs(thumb_dir, exist_ok=True)
            thumb_path = os.path.join(thumb_dir, thumb_filename)
            create_thumbnail(filepath, thumb_path)
            thumb_relative_path = os.path.join('uploads', 'thumbs', thumb_filename).replace('\\', '/')
            
        except Exception as e:
            print(f"Error processing license plate image: {str(e)}")
            raise
    
    # Regular categories: Handle file uploads
    else:
        for i, image in enumerate(images):
            if image and image.filename:
                if allowed_file(image.filename):
                    filename = secure_filename(image.filename)
                    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                    
                    os.makedirs(os.path.dirname(filepath), exist_ok=True)
                    image.save(filepath)
                    
                    relative_path = os.path.join('uploads', filename).replace('\\', '/')
                    image_paths.append(relative_path)
                    
                    # Generate thumbnail from first image
                    if i == 0:
                        thumb_filename = f"thumb_{filename}"
                        thumb_dir = os.path.join(current_app.config['UPLOAD_FOLDER'], 'thumbs')
                        os.makedirs(thumb_dir, exist_ok=True)
                        thumb_path = os.path.join(thumb_dir, thumb_filename)
                        create_thumbnail(filepath, thumb_path)
                        thumb_relative_path = os.path.join('uploads', 'thumbs', thumb_filename).replace('\\', '/')
    
    return image_paths, thumb_relative_path, description