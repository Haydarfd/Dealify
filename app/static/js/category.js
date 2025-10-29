
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
                                    <span class="search-result-price">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91" class="aed-icon" aria-hidden="true">
<path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
</svg>
${Number(item.price).toLocaleString()}
</span>

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


function updateListingsGrid(listings) {
  const listingsGrid = document.querySelector(".listings-grid");
  listingsGrid.innerHTML = ""; // Clear the current listings

 listings.forEach(listing => {
const listingCard = document.createElement("div");
listingCard.className = "listing-card horizontal-card";

listingCard.innerHTML = `
<div class="image-slider swiper">
<div class="swiper-wrapper">
${listing.image_paths && listing.image_paths.length > 0 ? listing.image_paths.map(img => `
  <div class="swiper-slide">
    <img src="/static/${img}" alt="${listing.title}">
  </div>
`).join("") : `
  <div class="swiper-slide">
    <img src="/static/img/placeholder.jpg" alt="${listing.title}">
  </div>
`}
</div>
<div class="swiper-button-next"></div>
<div class="swiper-button-prev"></div>
</div>
<div class="listing-details">
<h3>${listing.title}</h3>
<p class="price price-inline">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91" class="aed-icon" aria-hidden="true">
  <path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
</svg>
<span class="price-value">${Number(listing.price).toLocaleString()}</span>
</p>
<p class="location">${listing.city}, ${listing.address}</p>
<a href="${listingUrlBase}/${listing.id}" class="view-btn" data-en="Details" data-ar="التفاصيل">Details</a>
</div>
`;

listingsGrid.appendChild(listingCard);

function applyFilter(filter) {
const listingsGrid = document.querySelector(".listings-grid");
listingsGrid.innerHTML = "<div class='loading'>Loading...</div>"; // Show loading state

fetch(`/filter-listings?filter=${encodeURIComponent(filter)}`)
    .then(response => response.json())
    .then(data => {
        updateListingsGrid(data); // Update the listings grid with filtered results
    })
    .catch(error => {
        console.error("Error applying filter:", error);
        listingsGrid.innerHTML = "<div class='error'>Failed to load listings. Please try again.</div>";
    });
}
function toggleLanguageImage() {
const label = document.getElementById('languageLabel');
const enImg = label.dataset.enImg;
const arImg = label.dataset.arImg;

const isEnglish = label.innerHTML.includes(enImg);

if (isEnglish) {
label.innerHTML = `<img src="${arImg}" alt="Arabic" style="width: 20px;"> العربية`;
changeLanguage('ar');
} else {
label.innerHTML = `<img src="${enImg}" alt="English" style="width: 20px;"> English`;
changeLanguage('en');
}
}

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
document.getElementById("applyFiltersBtn").addEventListener("click", applyAllFilters);
});

function applyAllFilters() {
const price = document.getElementById("priceFilter").value;
const location = document.getElementById("locationFilter").value;
const query = new URLSearchParams();

// ✅ Add selected filters
if (price) query.append("price", price);
if (location) query.append("location", location);

// ✅ Add category from current URL
const categoryName = decodeURIComponent(window.location.pathname.split('/').pop());
query.append("category", categoryName);

fetch(`/filter-listings?${query.toString()}`)
.then(res => res.json())
.then(updateListingsGrid)
.catch(err => console.error("Filter fetch failed:", err));
}

function updateListingsGrid(listings) {
const grid = document.querySelector(".listings-grid");
grid.innerHTML = ""; // Clear old cards

listings.forEach((listing) => {
const wrapper = document.createElement("div");
wrapper.style.paddingBottom = "10px";

const card = document.createElement("div");
card.className = "listing-card horizontal-card";

wrapper.appendChild(card);

card.innerHTML = `
<div class="listing-left">
<div class="image-slider swiper">
  <div class="swiper-wrapper">
    ${listing.image_paths.length > 0
      ? listing.image_paths.map(img => `
        <div class="swiper-slide">
          <img src="/static/${img}" alt="${listing.title}">
        </div>`).join("")
      : `
        <div class="swiper-slide">
          <img src="/static/img/placeholder.jpg" alt="No Image">
        </div>`
    }
  </div>
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>
<div class="image-counter">
  <span>${listing.image_paths.length}</span>
  <img src="/static/img/imgicon.png" alt="Image icon">
</div>
</div>
<div class="listing-right">
<h3 class="listing-title">${listing.title}</h3>
<p class="price price-inline">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91" class="aed-icon" aria-hidden="true">
<path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
</svg>
  <span class="price-value">${Number(listing.price).toLocaleString()}</span>
</p>
<p class="location">${listing.city}, ${listing.address}</p>
<div class="action-button-row">
  <div class="left-buttons">
    <a href="/listing-item/${listing.id}" class="view-btn" data-en="Details" data-ar="التفاصيل">Details</a>
  </div>
  <div class="right-buttons">
    <button class="btn btn-share" onclick="shareListing('${listing.id}')">
      <i class="fas fa-share-alt"></i>
      <span data-en="Share" data-ar="مشاركة">Share</span>
    </button>
  </div>
</div>
</div>
`;

grid.appendChild(wrapper);
// Make the entire card clickable except for buttons/links inside
card.addEventListener('click', function (e) {
const isButton = e.target.closest('a, button');
if (!isButton) {
window.location.href = `/listing-item/${listing.id}`;
}
});

// 🔁 Re-initialize Swipers for dynamically added listings
document.querySelectorAll('.image-slider').forEach(function (swiperEl) {
new Swiper(swiperEl, {
loop: false,
grabCursor: true,
slidesPerView: 1,
spaceBetween: 0,
observer: true,
observeParents: true,
watchOverflow: true,
navigation: {
nextEl: swiperEl.querySelector('.swiper-button-next'),
prevEl: swiperEl.querySelector('.swiper-button-prev')
}
});
});
});
}

async function toggleFavorite(listingId) {
const btn = document.querySelector(`.favorite-btn[onclick*="(${listingId})"]`);
try {
const res = await fetch(`/toggle_favorite/${listingId}`, {
method: 'POST',
headers: {
  'X-Requested-With': 'XMLHttpRequest'
}
});
if (res.ok) {
btn.classList.toggle('active');
} else {
// not logged in?
window.location = '/login';
}
} catch (err) {
console.error(err);
}
}

function shareListing(listingId) {
const shareData = {
title: 'Check this listing on Dealify!',
text: 'I found this listing on Dealify. Take a look:',
url: `https://dealify.ae/listing-item/${listingId}`
};

if (navigator.share) {
navigator.share(shareData).catch((error) => console.error('Sharing failed', error));
} else {
alert("Sharing is not supported on this browser.");
}
}

function toggleFavorite(listingId) {
fetch(`/toggle_favorite/${listingId}`, {
method: 'POST',
headers: {
'X-Requested-With': 'XMLHttpRequest'
}
})
.then(response => response.json())
.then(data => {
if (data.success) {
const btn = document.querySelector(`.favorite-btn[onclick="toggleFavorite(${listingId})"]`);
if (btn) {
btn.classList.toggle('active', data.is_favorite);
}
}
});
}

document.addEventListener("DOMContentLoaded", function () {
document.querySelectorAll('.image-slider').forEach(function (swiperEl) {
new Swiper(swiperEl, {
loop: false,
grabCursor: true,
slidesPerView: 1,
spaceBetween: 0,
observer: true,
observeParents: true,
watchOverflow: true,
navigation: {
nextEl: swiperEl.querySelector('.swiper-button-next'),
prevEl: swiperEl.querySelector('.swiper-button-prev')
}
});
});
});

document.getElementById("searchBar").addEventListener("keypress", function (e) {
if (e.key === "Enter") {
let query = this.value.trim();
if (query.length > 2) {
window.location.href = `/search-results?query=${encodeURIComponent(query)}`;
}
}
});

document.querySelectorAll("a").forEach(link => {
if (
link.href &&
!link.href.startsWith("#") &&
!link.hasAttribute("target") &&
!link.href.includes("javascript:")
) {
link.addEventListener("click", function (e) {
e.preventDefault();
document.body.classList.add("page-slide-out");

setTimeout(() => {
window.location.href = link.href;
}, 300);
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