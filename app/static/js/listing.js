
const descFieldsByCategory = {
"Properties For Sale": [
{ label: "Type", label_ar: "النوع", name: "property_type", type: "select", options: [ { en: "Apartment", ar: "شقة" }, { en: "Villa", ar: "فيلا" }, { en: "Townhouse", ar: "تاون هاوس" }, { en: "Penthouse", ar: "بنتهاوس" }, { en: "Plot", ar: "قطعة أرض" } ] },
{ label: "Location", label_ar: "الموقع", name: "location", placeholder: "Dubai Marina", placeholder_ar: "مرسى دبي" },
{ label: "Size (sqft)", label_ar: "المساحة (قدم²)", name: "size", placeholder: "1500", placeholder_ar: "١٥٠٠" },
{ label: "Beds", label_ar: "عدد الغرف", name: "bedrooms", type: "select", options: [ { en: "Studio", ar: "استوديو" }, { en: "1", ar: "١" }, { en: "2", ar: "٢" }, { en: "3", ar: "٣" }, { en: "4", ar: "٤" }, { en: "5+", ar: "٥+" } ] },
{ label: "Baths", label_ar: "عدد الحمامات", name: "bathrooms", type: "select", options: [ { en: "1", ar: "١" }, { en: "2", ar: "٢" }, { en: "3", ar: "٣" }, { en: "4", ar: "٤" }, { en: "5+", ar: "٥+" } ] },
{ label: "Floor", label_ar: "الطابق", name: "floor_number", placeholder: "12", placeholder_ar: "١٢" },
{ label: "View", label_ar: "الإطلالة", name: "view_type", type: "select", options: [ { en: "Sea", ar: "إطلالة بحرية" }, { en: "City", ar: "إطلالة على المدينة" }, { en: "Community", ar: "إطلالة مجتمعية" }, { en: "Park", ar: "إطلالة على الحديقة" }, { en: "Burj View", ar: "إطلالة على برج خليفة" } ] },
{ label: "Furnishing", label_ar: "التأثيث", name: "furnishing", type: "select", options: [ { en: "Furnished", ar: "مفروش" }, { en: "Unfurnished", ar: "غير مفروش" }, { en: "Semi-furnished", ar: "مفروش جزئيًا" } ] },
{ label: "Amenities", label_ar: "وسائل الراحة", name: "amenities", placeholder: "Pool, Gym", placeholder_ar: "مسبح، صالة رياضية" },
{ label: "Ownership", label_ar: "نوع الملكية", name: "ownership_type", type: "select", options: [ { en: "Freehold", ar: "تملك حر" }, { en: "Leasehold", ar: "إيجار طويل الأمد" } ] }
],

"Properties For Rent": [
{ label: "Type", label_ar: "النوع", name: "property_type", type: "select", options: [ { en: "Apartment", ar: "شقة" }, { en: "Studio", ar: "استوديو" }, { en: "Villa", ar: "فيلا" }, { en: "Townhouse", ar: "تاون هاوس" } ] },
{ label: "Location", label_ar: "الموقع", name: "location", placeholder: "Dubai Marina", placeholder_ar: "مرسى دبي" },
{ label: "Size (sqft)", label_ar: "المساحة (قدم²)", name: "size", placeholder: "850", placeholder_ar: "٨٥٠" },
{ label: "Beds", label_ar: "غرف النوم", name: "bedrooms", type: "select", options: [ { en: "Studio", ar: "استوديو" }, { en: "1", ar: "١" }, { en: "2", ar: "٢" }, { en: "3", ar: "٣" }, { en: "4", ar: "٤" }, { en: "5+", ar: "٥+" } ] },
{ label: "Baths", label_ar: "الحمامات", name: "bathrooms", type: "select", options: [ { en: "1", ar: "١" }, { en: "2", ar: "٢" }, { en: "3", ar: "٣" }, { en: "4+", ar: "٤+" } ] },
{ label: "Floor", label_ar: "الطابق", name: "floor_number", placeholder: "8", placeholder_ar: "٨" },
{ label: "View", label_ar: "الإطلالة", name: "view_type", type: "select", options: [ { en: "Sea View", ar: "إطلالة بحرية" }, { en: "City View", ar: "إطلالة على المدينة" }, { en: "Community View", ar: "إطلالة مجتمعية" }, { en: "Park View", ar: "إطلالة على الحديقة" } ] },
{ label: "Furnishing", label_ar: "الأثاث", name: "furnishing", type: "select", options: [ { en: "Furnished", ar: "مفروش" }, { en: "Unfurnished", ar: "غير مفروش" }, { en: "Semi-furnished", ar: "مفروش جزئيًا" } ] },
{ label: "Amenities", label_ar: "وسائل الراحة", name: "amenities", placeholder: "Pool, Gym", placeholder_ar: "مسبح، نادي رياضي" },
{ label: "Payment", label_ar: "الدفع", name: "payment_terms", placeholder: "Monthly, 4 cheques", placeholder_ar: "شهري، ٤ شيكات" },
{ label: "Includes", label_ar: "يشمل", name: "rent_includes", placeholder: "Water, Internet", placeholder_ar: "ماء، إنترنت" },
{ label: "Deposit", label_ar: "التأمين", name: "security_deposit", placeholder: "5%", placeholder_ar: "٥٪" },
{ label: "Pets", label_ar: "الحيوانات الأليفة", name: "pet_policy", type: "select", options: [ { en: "Allowed", ar: "مسموح" }, { en: "Not Allowed", ar: "غير مسموح" } ] },
],



"Home & Garden": [
{ label: "Type", label_ar: "النوع", name: "product_type", placeholder: "Sofa, Lamp", placeholder_ar: "كنبة، مصباح" },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "IKEA, Bosch", placeholder_ar: "إيكيا، بوش" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Material", label_ar: "المادة", name: "material", placeholder: "Wood, Metal", placeholder_ar: "خشب، معدن" },
{ label: "Color", label_ar: "اللون", name: "color", placeholder: "White, Black", placeholder_ar: "أبيض، أسود" },
{ label: "Size (L×W×H)", label_ar: "الحجم (ط×ع×ا)", name: "dimensions", placeholder: "200x80x75cm", placeholder_ar: "٢٠٠×٨٠×٧٥ سم" },
{ label: "Used For", label_ar: "تم الاستخدام لمدة", name: "usage_duration", placeholder: "6 months", placeholder_ar: "٦ أشهر" },
],




"Cars & Vehicles": [
{ label: "Make & Model", label_ar: "الماركة والطراز", name: "make_model", placeholder: "Toyota Corolla", placeholder_ar: "تويوتا كورولا" },
{ label: "Year", label_ar: "سنة الصنع", name: "year", placeholder: "2020", placeholder_ar: "٢٠٢٠" },
{ label: "KM Driven", label_ar: "عدد الكيلومترات", name: "kilometers_driven", placeholder: "85,000", placeholder_ar: "٨٥٬٠٠٠" },
{ label: "Body Type", label_ar: "نوع السيارة", name: "body_type", type: "select", options: [ { en: "Sedan", ar: "سيدان" }, { en: "SUV", ar: "دفع رباعي" }, { en: "Hatchback", ar: "هاتشباك" }, { en: "Coupe", ar: "كوبيه" }, { en: "Convertible", ar: "قابلة للفتح" }, { en: "Pickup", ar: "بيك أب" }, { en: "Van", ar: "فان" } ] },
{ label: "Doors", label_ar: "عدد الأبواب", name: "number_of_doors", type: "select", options: [ { en: "2", ar: "2" }, { en: "3", ar: "3" }, { en: "4", ar: "4" }, { en: "5+", ar: "5+" } ] },
{ label: "Transmission", label_ar: "ناقل الحركة", name: "transmission", type: "select", options: [ { en: "Automatic", ar: "أوتوماتيك" }, { en: "Manual", ar: "عادي" }, { en: "CVT", ar: "CVT" } ] },
{ label: "Fuel Type", label_ar: "نوع الوقود", name: "fuel_type", type: "select", options: [ { en: "Petrol", ar: "بنزين" }, { en: "Diesel", ar: "ديزل" }, { en: "Hybrid", ar: "هايبرد" }, { en: "Electric", ar: "كهرباء" } ] },
{ label: "Color", label_ar: "اللون", name: "color", placeholder: "White", placeholder_ar: "أبيض" },
{ label: "Previous Owners", label_ar: "عدد الملاك السابقين", name: "number_of_owners", type: "select", options: [ { en: "1", ar: "1" }, { en: "2", ar: "2" }, { en: "3+", ar: "3+" }, { en: "Unknown", ar: "غير معروف" } ] },
{ label: "Service History", label_ar: "سجل الصيانة", name: "service_history", type: "select", options: [ { en: "Full", ar: "كامل" }, { en: "Partial", ar: "جزئي" }, { en: "None", ar: "لا يوجد" } ] },
{ label: "Warranty", label_ar: "الضمان", name: "warranty", type: "select", options: [ { en: "Yes", ar: "نعم" }, { en: "No", ar: "لا" } ] },
{ label: "Accident History", label_ar: "سجل الحوادث", name: "accident_history", type: "select", options: [ { en: "None", ar: "لا يوجد" }, { en: "Minor", ar: "طفيف" }, { en: "Major", ar: "حاد" } ] },
],




"Motorcycles & Scooters": [
{ label: "Make & Model", label_ar: "الماركة والطراز", name: "make_model", placeholder: "Yamaha R3", placeholder_ar: "ياماها R3" },
{ label: "Year", label_ar: "سنة الصنع", name: "year", placeholder: "2022", placeholder_ar: "٢٠٢٢" },
{ label: "KM Driven", label_ar: "عدد الكيلومترات", name: "kilometers_driven", placeholder: "15,000", placeholder_ar: "١٥٬٠٠٠" },
{ label: "Engine (cc)", label_ar: "سعة المحرك (سي سي)", name: "engine_capacity", placeholder: "300", placeholder_ar: "٣٠٠" },
{ label: "Fuel Type", label_ar: "نوع الوقود", name: "fuel_type", type: "select", options: [ { en: "Petrol", ar: "بنزين" }, { en: "Electric", ar: "كهرباء" } ] },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Accident History", label_ar: "سجل الحوادث", name: "accident_history", type: "select", options: [ { en: "None", ar: "لا يوجد" }, { en: "Minor", ar: "طفيف" }, { en: "Major", ar: "حاد" } ] },
{ label: "Previous Owners", label_ar: "عدد الملاك السابقين", name: "number_of_owners", type: "select", options: [ { en: "1", ar: "1" }, { en: "2", ar: "2" }, { en: "3+", ar: "3+" }, { en: "Unknown", ar: "غير معروف" } ] },
],




"Boats": [ 
{ label: "Type", label_ar: "النوع", name: "type", type: "select", options: [ { en: "Boat", ar: "قارب" }, { en: "Jetski", ar: "جت سكي" }, { en: "Yacht", ar: "يخت" }, { en: "Fishing Boat", ar: "قارب صيد" }, { en: "Speed Boat", ar: "قارب سريع" } ] },
{ label: "Make & Model", label_ar: "الماركة والطراز", name: "make_model", placeholder: "Yamaha FX Cruiser", placeholder_ar: "ياماها FX كروزر" },
{ label: "Year", label_ar: "سنة الصنع", name: "year_of_manufacture", placeholder: "2021", placeholder_ar: "٢٠٢١" },
{ label: "Length (ft)", label_ar: "الطول (قدم)", name: "length", placeholder: "22", placeholder_ar: "٢٢" },
{ label: "Engine Type", label_ar: "نوع المحرك", name: "engine_type", type: "select", options: [ { en: "Outboard", ar: "خارجي" }, { en: "Inboard", ar: "داخلي" }, { en: "Jet Drive", ar: "دفع مائي" }, { en: "Other", ar: "أخرى" } ] },
{ label: "Fuel Type", label_ar: "نوع الوقود", name: "fuel_type", type: "select", options: [ { en: "Petrol", ar: "بنزين" }, { en: "Diesel", ar: "ديزل" }, { en: "Electric", ar: "كهرباء" }, { en: "Other", ar: "أخرى" } ] },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Registration Emirate", label_ar: "الإمارة المسجلة", name: "registration_emirate", type: "select", options: [ { en: "Dubai", ar: "دبي" }, { en: "Abu Dhabi", ar: "أبوظبي" }, { en: "Sharjah", ar: "الشارقة" }, { en: "Ajman", ar: "عجمان" }, { en: "Ras Al Khaimah", ar: "رأس الخيمة" }, { en: "Umm Al Quwain", ar: "أم القيوين" }, { en: "Fujairah", ar: "الفجيرة" } ] },
{ label: "Extras", label_ar: "إضافات", name: "extras_included", placeholder: "Life jackets, Trailer", placeholder_ar: "سترات نجاة، مقطورة" },
],


"License Plates": [
{ label: "Emirate", label_ar: "الإمارة", name: "emirate", type: "select", options: [ { en: "Dubai", ar: "دبي" }, { en: "Abu Dhabi", ar: "أبوظبي" }, { en: "Sharjah", ar: "الشارقة" }, { en: "Ajman", ar: "عجمان" }, { en: "Ras Al Khaimah", ar: "رأس الخيمة" }, { en: "Umm Al Quwain", ar: "أم القيوين" }, { en: "Fujairah", ar: "الفجيرة" } ] },
{ label: "Plate Type", label_ar: "نوع اللوحة", name: "plate_type", type: "select", options: [ { en: "Private", ar: "خصوصي" }, { en: "Classic", ar: "كلاسيك" }, { en: "Motorcycle", ar: "دراجة نارية" }, { en: "Commercial", ar: "نقل" }, { en: "Diplomatic", ar: "دبلوماسي" } ] },
{ label: "Code", label_ar: "رمز", name: "code", placeholder: "A, B, C", placeholder_ar: "أ، ب، ج" },
{ label: "Plate Number", label_ar: "رقم اللوحة", name: "plate_number", placeholder: "12345", placeholder_ar: "١٢٣٤٥" },
],

"Electronics": [
{ label: "Product Type", label_ar: "نوع المنتج", name: "product_type", placeholder: "Phone, TV, Laptop", placeholder_ar: "هاتف، تلفاز، كمبيوتر محمول" },
{ label: "Brand & Model", label_ar: "العلامة التجارية والطراز", name: "brand_model", placeholder: "Samsung S23, MacBook Air", placeholder_ar: "سامسونج S23، ماكبوك إير" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" }, { en: "For Parts", ar: "للقطع" } ] },
{ label: "Storage", label_ar: "سعة التخزين", name: "storage_capacity", placeholder: "128GB, 1TB", placeholder_ar: "١٢٨ جيجابايت، ١ تيرابايت" },
{ label: "Screen Size", label_ar: "حجم الشاشة", name: "screen_size", placeholder: "6.1\", 15.6\"", placeholder_ar: "٦.١\"، ١٥.٦\"" },
{ label: "Warranty", label_ar: "الضمان", name: "warranty", type: "select", options: [ { en: "Yes", ar: "نعم" }, { en: "No", ar: "لا" }, { en: "Expired", ar: "منتهي" } ] },
{ label: "Accessories", label_ar: "الملحقات", name: "accessories_included", placeholder: "Charger, Case, Keyboard", placeholder_ar: "شاحن، غطاء، لوحة مفاتيح" },
],


"Appliances": [
{ label: "Product Type", label_ar: "نوع الجهاز", name: "product_type", placeholder: "Fridge, Oven", placeholder_ar: "ثلاجة، فرن" },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "LG, Samsung, Bosch", placeholder_ar: "إل جي، سامسونج، بوش" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" }, { en: "For Parts", ar: "للقطع" } ] },
{ label: "Energy Rating", label_ar: "تصنيف الطاقة", name: "energy_rating", placeholder: "A+++, A+, B", placeholder_ar: "A+++، A+، B" },
{ label: "Color", label_ar: "اللون", name: "color", placeholder: "White, Silver", placeholder_ar: "أبيض، فضي" },
{ label: "Size / Capacity", label_ar: "الحجم / السعة", name: "size", placeholder: "7kg, 500L, 90cm", placeholder_ar: "٧كغ، ٥٠٠ل، ٩٠سم" },
{ label: "Warranty", label_ar: "الضمان", name: "warranty", type: "select", options: [ { en: "Yes", ar: "نعم" }, { en: "No", ar: "لا" }, { en: "Expired", ar: "منتهي" } ] },
],


"Men's Apparel": [
{ label: "Item Type", label_ar: "نوع القطعة", name: "item_type", placeholder: "T-shirt, Suit, Thobe", placeholder_ar: "تيشيرت، بدلة، ثوب" },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "Nike, Zara, Gucci", placeholder_ar: "نايكي، زارا، قوتشي" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Size", label_ar: "المقاس", name: "size", placeholder: "M, L, 42 EU", placeholder_ar: "M، L، ٤٢ EU" },
{ label: "Color", label_ar: "اللون", name: "color", placeholder: "Black, Beige", placeholder_ar: "أسود، بيج" },
{ label: "Material", label_ar: "الخامة", name: "material", placeholder: "Cotton, Linen", placeholder_ar: "قطن، كتان" },
],

"Women's Apparel": [
{ label: "Item Type", label_ar: "نوع القطعة", name: "item_type", placeholder: "Dress, Abaya, Blouse", placeholder_ar: "فستان، عباية، بلوزة" },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "H&M, Dior, Zara", placeholder_ar: "إتش آند إم، ديور، زارا" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Size", label_ar: "المقاس", name: "size", placeholder: "S, M, 38 EU", placeholder_ar: "S، M، ٣٨ EU" },
{ label: "Color", label_ar: "اللون", name: "color", placeholder: "Beige, Red", placeholder_ar: "بيج، أحمر" },
{ label: "Material", label_ar: "الخامة", name: "material", placeholder: "Silk, Cotton", placeholder_ar: "حرير، قطن" },
],

"Kids, Toys & Baby": [
{ label: "Item Type", label_ar: "نوع القطعة", name: "item_type", placeholder: "Stroller, Puzzle, Shoes", placeholder_ar: "عربة أطفال، أحجية، حذاء" },
{ label: "Age Range", label_ar: "الفئة العمرية", name: "age_range", placeholder: "0–2 yrs, 3–5 yrs", placeholder_ar: "٠–٢ سنة، ٣–٥ سنوات" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "Chicco, LEGO, Zara Baby", placeholder_ar: "شيكو، ليغو، زارا بيبي" },
{ label: "Material", label_ar: "الخامة", name: "material", placeholder: "Plastic, Cotton", placeholder_ar: "بلاستيك، قطن" },
],



"Fitness & Sports Equipment": [
{ label: "Item Type", label_ar: "نوع المنتج", name: "product_type", placeholder: "Treadmill, Dumbbell", placeholder_ar: "جهاز مشي، دمبل" },
{ label: "Brand", label_ar: "العلامة التجارية", name: "brand", placeholder: "Nike, Technogym", placeholder_ar: "نايكي، تكنوجيم" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
{ label: "Weight (kg)", label_ar: "الوزن (كجم)", name: "weight", placeholder: "10", placeholder_ar: "١٠" },
{ label: "Size / Dimensions", label_ar: "الحجم / الأبعاد", name: "size", placeholder: "180x60x120 cm", placeholder_ar: "١٨٠×٦٠×١٢٠ سم" },
{ label: "Accessories Included", label_ar: "الملحقات المرفقة", name: "accessories_included", placeholder: "Mat, Remote", placeholder_ar: "حصيرة، ريموت" },
],

"Professional Services": [
{ label: "Service Type", label_ar: "نوع الخدمة", name: "service_type", placeholder: "Cleaning, Repairs", placeholder_ar: "تنظيف، إصلاحات" },
{ label: "Service Area", label_ar: "منطقة الخدمة", name: "service_area", placeholder: "Dubai, Sharjah", placeholder_ar: "دبي، الشارقة" },
{ label: "Experience Level", label_ar: "مستوى الخبرة", name: "experience_level", type: "select", options: [ { en: "Beginner", ar: "مبتدئ" }, { en: "Intermediate", ar: "متوسط" }, { en: "Expert", ar: "خبير" }, { en: "Certified", ar: "معتمد" } ] },
{ label: "Availability", label_ar: "التوفر", name: "availability", placeholder: "Weekdays, 24/7", placeholder_ar: "أيام الأسبوع، ٢٤/٧" },
],


"Jobs & Freelance": [
{ label: "Role / Position", label_ar: "الدور / المنصب", name: "role", placeholder: "Sales Manager", placeholder_ar: "مدير مبيعات" },
{ label: "Job Type", label_ar: "نوع الوظيفة", name: "job_type", type: "select", options: [ { en: "Full-time", ar: "دوام كامل" }, { en: "Part-time", ar: "دوام جزئي" }, { en: "Freelance", ar: "عمل حر" }, { en: "Temporary", ar: "مؤقت" }, { en: "Remote", ar: "عن بُعد" } ] },
{ label: "Location", label_ar: "الموقع", name: "location", placeholder: "Dubai", placeholder_ar: "دبي" },
{ label: "Salary Range", label_ar: "نطاق الراتب", name: "salary_range", placeholder: "AED 5000–8000", placeholder_ar: "٥٠٠٠–٨٠٠٠ درهم" },
{ label: "Required Skills", label_ar: "المهارات المطلوبة", name: "required_skills", placeholder: "Communication, Excel", placeholder_ar: "اتصال، إكسل" },
],


"Courses & Training": [
{ label: "Subject", label_ar: "الموضوع", name: "subject", placeholder: "Graphic Design", placeholder_ar: "تصميم جرافيك" },
{ label: "Course Type", label_ar: "نوع الدورة", name: "course_type", type: "select", options: [ { en: "Online", ar: "عبر الإنترنت" }, { en: "In-person", ar: "حضوري" }, { en: "Hybrid", ar: "مختلط" } ] },
{ label: "Skill Level", label_ar: "مستوى المهارة", name: "skill_level", type: "select", options: [ { en: "Beginner", ar: "مبتدئ" }, { en: "Intermediate", ar: "متوسط" }, { en: "Advanced", ar: "متقدم" }, { en: "All Levels", ar: "كل المستويات" } ] },
{ label: "Duration", label_ar: "المدة", name: "duration", placeholder: "4 weeks", placeholder_ar: "٤ أسابيع" },
],

"Books & Stationary": [
{ label: "Product Type", label_ar: "نوع المنتج", name: "product_type", type: "select", options: [ { en: "Book", ar: "كتاب" }, { en: "Notebook", ar: "دفتر" }, { en: "Pen", ar: "قلم" }, { en: "Supplies", ar: "لوازم" } ] },
{ label: "Genre", label_ar: "النوع الأدبي", name: "genre", placeholder: "Fiction, Education", placeholder_ar: "خيال، تعليم" },
{ label: "Language", label_ar: "اللغة", name: "language", placeholder: "English, Arabic", placeholder_ar: "الإنجليزية، العربية" },
{ label: "Condition", label_ar: "الحالة", name: "condition", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Used", ar: "مستخدم" }, { en: "Like New", ar: "كالجديد" } ] },
],


"Pets & Pet Supplies": [
{ label: "Item Type", label_ar: "نوع العنصر", name: "item_type", type: "select", options: [ { en: "Live Animal", ar: "حيوان حي" }, { en: "Pet Food", ar: "طعام حيوانات" }, { en: "Accessories", ar: "إكسسوارات" }, { en: "Toys", ar: "ألعاب" }, { en: "Care", ar: "عناية" }, { en: "Other", ar: "أخرى" } ] },
{ label: "Pet Type", label_ar: "نوع الحيوان", name: "pet_type", type: "select", options: [ { en: "Dog", ar: "كلب" }, { en: "Cat", ar: "قط" }, { en: "Bird", ar: "طائر" }, { en: "Fish", ar: "سمك" }, { en: "Rabbit", ar: "أرنب" }, { en: "Reptile", ar: "زواحف" }, { en: "Other", ar: "أخرى" } ] },
{ label: "Breed or Brand", label_ar: "السلالة أو العلامة", name: "breed_or_brand", placeholder: "Persian, Royal Canin", placeholder_ar: "برسي، رويال كانين" },
{ label: "Age (if pet)", label_ar: "العمر (إذا كان حيوانًا)", name: "age", placeholder: "3 months", placeholder_ar: "٣ أشهر" },
],


"Tickets & Experiences": [
{ label: "Event Type", label_ar: "نوع الفعالية", name: "event_type", placeholder: "Concert, Sports", placeholder_ar: "حفلة، رياضة" },
{ label: "Date", label_ar: "التاريخ", name: "date", placeholder: "YYYY-MM-DD", placeholder_ar: "سنة-شهر-يوم" },
{ label: "Location", label_ar: "الموقع", name: "location", placeholder: "Dubai Arena", placeholder_ar: "دبي أرينا" },
{ label: "Seat Category", label_ar: "فئة المقعد", name: "seat_category", placeholder: "VIP, General", placeholder_ar: "كبار الشخصيات، عادي" },
],


"Advertising Spaces": [
{ label: "Ad Location", label_ar: "موقع الإعلان", name: "location", placeholder: "Sheikh Zayed Rd, Mall Entrance", placeholder_ar: "شارع الشيخ زايد، مدخل المول" },
{ label: "Ad Size", label_ar: "حجم الإعلان", name: "size", placeholder: "6x3 meters", placeholder_ar: "٦×٣ متر" },
{ label: "Duration", label_ar: "المدة", name: "duration", placeholder: "1 month, 3 months", placeholder_ar: "شهر، ٣ أشهر" },
{ label: "Target Audience", label_ar: "الجمهور المستهدف", name: "target_audience", placeholder: "Tourists, Residents", placeholder_ar: "السياح، السكان" },
],


"Miscellaneous": [
{ label: "Item Type", label_ar: "نوع العنصر", name: "item_type", placeholder: "Collectible, Tool", placeholder_ar: "عنصر قابل للجمع، أداة" },
{ label: "Usage", label_ar: "الحالة", name: "usage", type: "select", options: [ { en: "New", ar: "جديد" }, { en: "Like New", ar: "كالجديد" }, { en: "Used", ar: "مستخدم" }, { en: "For Parts", ar: "للقطع" } ] },
{ label: "Brand (if any)", label_ar: "العلامة التجارية (إن وجدت)", name: "brand", placeholder: "Optional", placeholder_ar: "اختياري" },
],


};

function updateDescriptionFields() {
const category = document.getElementById('category').value;
const fieldsDiv = document.getElementById('descFields');
fieldsDiv.innerHTML = '';
const fields = descFieldsByCategory[category] || [];
const lang = localStorage.getItem("dealify_lang") || "en";

fields.forEach(f => {
if (f.type === "select" && f.options) {
const optionsHTML = f.options.map(opt => {
const [en, ar] = typeof opt === 'object' ? [opt.en, opt.ar] : [opt, opt];
const label = lang === "ar" ? ar : en;
return `<option value="${en}" data-en="${en}" data-ar="${ar}">${label}</option>`;
}).join('');

const placeholderText = lang === "ar"
? `اختر ${(f.label_ar || f.label).toLowerCase()}`
: `Select ${f.label.toLowerCase()}`;

fieldsDiv.innerHTML += `
<div class="description-field">
<span class="label-text" data-en="${f.label}" data-ar="${f.label_ar || f.label}">
  ${lang === "ar" ? (f.label_ar + " :") : f.label + " :"}
</span>
<select name="${f.name}">
  <option value="" disabled selected data-en="Select ${f.label.toLowerCase()}" data-ar="اختر ${(f.label_ar || f.label).toLowerCase()}">
    ${placeholderText}
  </option>
  ${optionsHTML}
</select>
</div>
`;
} else {
const placeholder = lang === "ar" ? (f.placeholder_ar || f.placeholder) : f.placeholder;
fieldsDiv.innerHTML += `
<div class="description-field">
<span class="label-text" data-en="${f.label}" data-ar="${f.label_ar || f.label}">
  ${lang === "ar" ? (f.label_ar + " :") : f.label + " :"}
</span>
<input type="text" name="${f.name}" 
  placeholder="${placeholder}"
  data-en="${f.placeholder || ''}" 
  data-ar="${f.placeholder_ar || f.placeholder || ''}" />
</div>
`;
}
});
}


// When form is submitted, combine fields and set the textarea value
document.querySelector('form').addEventListener('submit', function(e) {
const category = document.getElementById('category').value;
const fields = descFieldsByCategory[category] || [];
let desc = '';
fields.forEach(f => {
const val = document.querySelector(`[name="${f.name}"]`)?.value || '';
desc += `• ${f.label}: ${val}\n`;
});
document.getElementById('description').value = desc.trim();
// form submits as usual!
});

// Update fields when category changes
document.getElementById('category').addEventListener('change', updateDescriptionFields);

// Capitalize first letter of each word as user types
document.addEventListener('input', function (e) {
if (e.target.matches('.desc-input')) {
e.target.value = e.target.value.replace(/\b\w/g, char => char.toUpperCase());
}
});


const categoryCosts = {
"Cars & Vehicles": "6 credits",
"Motorcycles & Scooters": "6 credits",
"Boats": "6 credits",
"Properties For Sale": "12 credits",
"Properties For Rent": "12 credits",
"Advertising Spaces": "3 credits"
};

function updateCategoryCost() {
const selected = document.getElementById("category").value;
const cost = categoryCosts[selected] || "0.5 credits";
document.getElementById("categoryCost").textContent = `${cost}`;
}

// Register event listener
document.getElementById("category").addEventListener("change", updateCategoryCost);

const categoryImageLimits = {
"Properties For Sale": 15,
"Properties For Rent": 15,
"License Plates": 1,
"Home & Garden": 5,
"Cars & Vehicles": 10,
"Motorcycles & Scooters": 5,
"Boats": 5,
"Electronics": 5,
"Appliances": 5,
"Men's Apparel": 4,
"Women's Apparel": 4,
"Kids, Toys & Baby": 4,
"Fitness & Sports Equipment": 5,
"Professional Services": 3,
"Jobs & Freelance": 3,
"Courses & Training": 3,
"Books & Stationary": 3,
"Pets & Pet Supplies": 5,
"Tickets & Experiences": 3,
"Advertising Spaces": 5,
"Miscellaneous": 5
};

const fileInput = document.getElementById('image-upload');
const preview = document.getElementById('image-preview');
const hint = document.getElementById('image-limit-hint');
let currentCategory = null;
let selectedFiles = [];

function triggerFileInput() {
fileInput.click();
}

function updateHint() {
const max = categoryImageLimits[currentCategory] || 1;
const lang = localStorage.getItem("dealify_lang") || "en";
const count = selectedFiles.length;

if (lang === "ar") {
const toArabic = (n) => n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
hint.textContent = `يمكنك إضافة ما يصل إلى ${toArabic(max)} صورة — تم اختيار ${toArabic(count)}`;
} else {
hint.textContent = `You can add up to ${max} photos — ${count} selected`;
}
}


function refreshPreviews() {
preview.innerHTML = '';

selectedFiles.forEach((file, index) => {
const div = document.createElement('div');
div.className = 'preview-thumb';

const img = document.createElement('img');
const removeBtn = document.createElement('button');
const removeIcon = document.createElement('img');

removeBtn.className = 'remove-image-btn';
removeBtn.type = 'button';
removeBtn.onclick = () => removeImage(index);
removeIcon.src = "{{ url_for('static', filename='img/xbuttonpink.png') }}";
removeIcon.alt = "Remove";

removeBtn.appendChild(removeIcon);
div.appendChild(img);
div.appendChild(removeBtn);

const reader = new FileReader();
reader.onload = (e) => {
img.src = e.target.result;
};
reader.readAsDataURL(file);

preview.appendChild(div);
});

updateHint();
}


function removeImage(index) {
selectedFiles.splice(index, 1);
refreshPreviews();
}

fileInput.addEventListener('change', () => {
const files = Array.from(fileInput.files);
const max = categoryImageLimits[currentCategory] || 1;
if ((selectedFiles.length + files.length) > max) {
alert(`You can only upload up to ${max} images.`);
return;
}
selectedFiles.push(...files);
refreshPreviews();
});

// Hook category dropdown change to update limit
document.getElementById('category')?.addEventListener('change', (e) => {
currentCategory = e.target.value;
selectedFiles = [];
refreshPreviews();
});

// On form submit, recreate the FileList
document.querySelector('form')?.addEventListener('submit', (e) => {
if (selectedFiles.length === 0) {
e.preventDefault();
alert("Please select at least one photo before submitting.");
return;
}

const dataTransfer = new DataTransfer();
selectedFiles.forEach(file => dataTransfer.items.add(file));
fileInput.files = dataTransfer.files;
});

document.addEventListener("visibilitychange", function () {
if (document.visibilityState === "hidden") {
lastHiddenTime = Date.now();
} else if (document.visibilityState === "visible") {
const now = Date.now();
const minutesAway = (now - (lastHiddenTime || now)) / 1000 / 60;

if (minutesAway > 4) {
location.reload();
}
}
});

function changeLanguage(lang) {
localStorage.setItem("dealify_lang", lang);
location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
const savedLang = localStorage.getItem("dealify_lang") || "en";

// Set the language on <html>
document.documentElement.lang = savedLang;

// Update all [data-en] / [data-ar] text elements
document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
const txt = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
if (txt) el.textContent = txt;
});

// Update placeholders
document.querySelectorAll("[placeholder][data-en][data-ar]").forEach((el) => {
const ph = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
if (ph) el.setAttribute("placeholder", ph);
});

// Update <option> elements
document.querySelectorAll("option[data-en][data-ar]").forEach((opt) => {
const val = opt.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
if (val) opt.textContent = val;
});

// Handle navbar language buttons
const btnEn = document.getElementById("lang-en");
const btnAr = document.getElementById("lang-ar");
if (btnEn && btnAr) {
btnEn.style.display = savedLang === "ar" ? "inline-flex" : "none";
btnAr.style.display = savedLang === "ar" ? "none" : "inline-flex";
}

// Handle sidebar language buttons
const sidebarBtnEn = document.getElementById("sidebar-lang-en");
const sidebarBtnAr = document.getElementById("sidebar-lang-ar");
if (sidebarBtnEn && sidebarBtnAr) {
sidebarBtnEn.style.display = savedLang === "ar" ? "inline-flex" : "none";
sidebarBtnAr.style.display = savedLang === "ar" ? "none" : "inline-flex";
}

// Handle optional language icon/label toggle (if exists)
try {
const languageLabel = document.getElementById("languageLabel");
const langText = document.getElementById("languageText");
const langIcon = document.getElementById("languageIcon");

if (languageLabel && langText && langIcon) {
langText.textContent = ""; // hide text
langIcon.src = savedLang === "ar" ? languageLabel.dataset.arImg : languageLabel.dataset.enImg;
}
} catch (e) {
console.warn("Optional language icon/label not found.");
}
});

document.addEventListener("DOMContentLoaded", function () {
const form = document.querySelector("form");
const submitButton = form.querySelector("button[type='submit']");

let isSubmitting = false;

form.addEventListener("submit", function (e) {
if (isSubmitting) {
e.preventDefault();
return false;
}

isSubmitting = true;
submitButton.disabled = true;
submitButton.style.opacity = 0.6;
submitButton.textContent = "Submitting...";
});
});

function formatPrice(input) {
const raw = input.value.replace(/,/g, '').replace(/\D/g, '');
if (!raw) {
input.value = '';
return;
}
input.value = Number(raw).toLocaleString();
}

function stripCommas(input) {
input.value = input.value.replace(/,/g, '');
}

// Auto-strip commas on form submit
document.addEventListener("DOMContentLoaded", () => {
const form = document.querySelector("form");
if (form) {
form.addEventListener("submit", () => {
const priceInput = document.getElementById("price");
if (priceInput) {
priceInput.value = priceInput.value.replace(/,/g, '');
}
});
}
});

let isNavigating = false;

function resetAnimationState() {
isNavigating = false;
document.body.classList.remove("page-slide-in", "page-slide-out");
}

function playEnterAnimationIfNotReload() {
const navType = performance.getEntriesByType("navigation")[0]?.type;
const isReload = navType === "reload";
const isBack = navType === "back_forward";

if (!isReload) {
document.body.classList.add("page-slide-in");
document.body.addEventListener("animationend", (e) => {
if (e.animationName === "slideInRight") {
resetAnimationState();
}
}, { once: true });
}
}

document.addEventListener("DOMContentLoaded", () => {
playEnterAnimationIfNotReload();

document.querySelectorAll("a").forEach(link => {
const href = link.getAttribute("href");

if (
href &&
!href.startsWith("#") &&
!link.hasAttribute("target") &&
!href.includes("javascript:")
) {
link.addEventListener("click", (e) => {
e.preventDefault();
if (isNavigating) return;
isNavigating = true;

document.body.classList.add("page-slide-out");

setTimeout(() => {
window.location.href = href;
}, 300);
});
}
});
});

// Back/forward navigation (bfcache)
window.addEventListener("pageshow", (event) => {
resetAnimationState(); // 🔥 fixes the "can't click again" bug
const navType = performance.getEntriesByType("navigation")[0]?.type;
if (event.persisted || navType === "back_forward") {
document.body.classList.add("page-slide-in");
document.body.addEventListener("animationend", (e) => {
if (e.animationName === "slideInRight") {
resetAnimationState();
}
}, { once: true });
}
});

document.addEventListener("DOMContentLoaded", function () {
let lastHiddenTime;

document.addEventListener("visibilitychange", function () {
if (document.visibilityState === "hidden") {
lastHiddenTime = Date.now();
} else if (document.visibilityState === "visible") {
const now = Date.now();
const minutesAway = (now - (lastHiddenTime || now)) / 1000 / 60;

if (minutesAway > 4) {
location.reload(true);
}
}
});
});
document.addEventListener("visibilitychange", function() {
if (!document.hidden) {
location.reload(); // reload when app becomes visible again
}
});
