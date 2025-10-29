const categories = [
    { en: "Properties for Sale", ar: "عقارات للبيع", img: "../img/homesale.png", id: "properties-sale" },
    { en: "Properties for Rent", ar: "عقارات للإيجار", img: "properties-rent.png", id: "properties-rent" },
    { en: "Home & Garden", ar: "المنزل والحديقة", img: "home-garden.png", id: "home-garden" },
    { en: "Cars & Vehicles", ar: "السيارات والمركبات", img: "cars-vehicles.png", id: "cars-vehicles" },
    { en: "Motorcycles & Scooters", ar: "الدراجات النارية", img: "motorcycles.png", id: "motorcycles" },
    { en: "Electronics", ar: "الإلكترونيات", img: "electronics.png", id: "electronics" },
    { en: "Appliances", ar: "الأجهزة", img: "appliances.png", id: "appliances" },
    { en: "Men's Apparel", ar: "ملابس الرجال", img: "mens-apparel.png", id: "mens-apparel" },
    { en: "Women's Apparel", ar: "ملابس النساء", img: "womens-apparel.png", id: "womens-apparel" },
    { en: "Kids, Toys & Baby", ar: "الأطفال والألعاب والرضع", img: "kids-toys-baby.png", id: "kids-toys-baby" },
    { en: "Fitness & Sports Equipment", ar: "معدات اللياقة والرياضة", img: "fitness-sports.png", id: "fitness-sports" },
    { en: "Professional Services", ar: "خدمات احترافية", img: "services.png", id: "services" },
    { en: "Jobs & Freelance", ar: "وظائف وفرص عمل حر", img: "jobs.png", id: "jobs" },
    { en: "Courses & Training", ar: "الدورات التدريبية", img: "courses-training.png", id: "courses-training" },
    { en: "Books & Stationery", ar: "الكتب والقرطاسية", img: "books-stationery.png", id: "books-stationery" },
    { en: "Pets & Pet Supplies", ar: "الحيوانات الأليفة ولوازمها", img: "pets-supplies.png", id: "pets-supplies" },
    { en: "Tickets & Experiences", ar: "تذاكر وتجارب", img: "tickets-experiences.png", id: "tickets-experiences" },
    { en: "Miscellaneous", ar: "منوعات", img: "miscellaneous.png", id: "miscellaneous" }
];

let currentLanguage = 'en';  // Default language is English

// Function to render categories
function renderCategories() {
    const categoriesGrid = document.getElementById("categories-grid");
    categoriesGrid.innerHTML = ""; // Clear the grid

    categories.forEach(category => {
        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");
        categoryItem.setAttribute('data-category-id', category.id); // Set data-id for easier selection later

        categoryItem.innerHTML = `
            <img src="${category.img}" alt="${category[currentLanguage]}">
            <p>${category[currentLanguage]}</p>
        `;
        
        categoryItem.addEventListener('click', function () {
            // Redirect to marketplace page with category as a URL parameter
            window.location.href = `marketplace.html?category=${category.id}`;
        });

        categoriesGrid.appendChild(categoryItem);
    });
}

let timer;
const listingUrlBase = "{{ url_for('listing_page', listing_id=0) }}".replace("/0", ""); // Base URL without ID

document.getElementById("searchBar").addEventListener("input", function () {
    let query = this.value.trim();
    clearTimeout(timer);

    if (query.length > 2) {
        timer = setTimeout(() => {
            fetch(`/search?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    let resultsContainer = document.getElementById("searchResults");
                    resultsContainer.innerHTML = "";
              
                    data.forEach(item => {
                        let div = document.createElement("div");
                        div.className = "search-result-item";
                        div.innerHTML = `
                            <a href="${listingUrlBase}/${item.id}" class="search-result-link">
                                <div class="search-result-info">
                                    <span class="search-result-title">${highlightMatch(item.title, query)}</span>
                                    <span class="search-result-price">${item.price}</span>
                                </div>
                            </a>`;
                        resultsContainer.appendChild(div);
                    });
                    resultsContainer.style.display = "block"; // Show results
                });
        }, 300); // Debounce 300ms
    } else {
        document.getElementById("searchResults").style.display = "none"; // Hide results if query is too short
    }
});

// Handle Enter key to go to search results page
document.getElementById("searchBar").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        let query = this.value.trim();
        if (query.length > 2) {
            window.location.href = `/search-results?query=${encodeURIComponent(query)}`;
        }
    }
});

// Highlight search matches
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
}

// Close search results when clicking outside the search container
document.addEventListener("click", function (event) {
    const searchContainer = document.querySelector(".search-container");
    const searchResults = document.getElementById("searchResults");

    // Check if the click is outside the search container
    if (!searchContainer.contains(event.target)) {
        searchResults.style.display = "none"; // Hide results
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

document.getElementById('shopNowBtn').addEventListener('click', () => {
const target = document.getElementById('property-category');
if (target) {
  const rect = target.getBoundingClientRect();
  const scrollOffset = rect.top + window.pageYOffset - window.innerHeight * 0;

  window.scrollTo({
    top: scrollOffset,
    behavior: 'smooth'
  });

  // Optional mobile haptic feedback
  if (navigator.vibrate) navigator.vibrate(10);
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





// Marketplace page logic (to be placed on marketplace.html page)
function loadCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    
    const category = categories.find(cat => cat.id === categoryId);
    
    if (category) {
        // Set category title
        const categoryTitle = document.getElementById('category-title');
        categoryTitle.textContent = category[currentLanguage];

        // Simulate fetching and displaying products (replace with actual data)
        const categoryProducts = document.getElementById('category-products');
        categoryProducts.innerHTML = `<p>Displaying products for ${category[currentLanguage]}...</p>`;
    }
}

// Initialize rendering categories on the homepage
renderCategories();

// Load category page content if on the marketplace page
if (window.location.pathname.includes('marketplace.html')) {
    loadCategoryPage();
}
categoryItem.innerHTML = `
    <img src="${category.img}" alt="${category[currentLanguage]}">
    <p>${category[currentLanguage]}</p>
`;
