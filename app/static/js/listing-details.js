
    // Initialize Swiper
    const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

    // Go to specific slide when thumbnail is clicked
    function goToSlide(index) {
        swiper.slideTo(index + 1); // +1 because of loop
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    // Update active thumbnail when slide changes
    swiper.on('slideChange', function() {
        const activeIndex = swiper.realIndex;
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            if (i === activeIndex) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    });

    // Image Modal Functions
    function openImageModal(src) {
  const modal = document.getElementById("image-modal");
  const img = document.getElementById("modal-image");
  img.src = src;
  modal.classList.add("active");

  // Hide hamburger
  const hamburger = document.querySelector(".mobile-menu-btn");
  if (hamburger) hamburger.style.display = "none";
}


    function closeImageModal() {
  const modal = document.getElementById("image-modal");
  modal.classList.remove("active");

  // Show hamburger back
  const hamburger = document.querySelector(".mobile-menu-btn");
  if (hamburger) hamburger.style.display = "";
}


    // Report Modal Functions
    function openModal() {
        document.getElementById('report-modal').classList.add('active');
    }

    function closeModal() {
        document.getElementById('report-modal').classList.remove('active');
    }

    // Toggle Favorite
    async function toggleFavorite(listingId) {
        const btn = document.querySelector('.favorite-btn');
        const isActive = btn.classList.contains('active');
        
        try {
            const response = await fetch(`/toggle_favorite/${listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                btn.classList.toggle('active');
            } else {
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Copy to Clipboard
    function copyToClipboard() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    }

    // Load Seller Listings
    // Load Seller Listings Automatically
function loadSellerListings(userId, currentListingId) {
    const container = document.getElementById("sellerListings");
    container.innerHTML = "<p>Loading...</p>";

    fetch(`/get_seller_listings/${userId}`)
        .then(res => res.json())
        .then(data => {
            const listings = data.filter(item => item.id !== currentListingId);
            if (listings.length === 0) {
                const lang = localStorage.getItem("dealify_lang") || "en";
const textEn = "No other listings available from this seller";
const textAr = "لا توجد إعلانات أخرى من هذا البائع";
container.innerHTML = `<p class="no-seller-listings"><strong>${lang === "ar" ? textAr : textEn}</strong></p>`;

                return;
            }

            let html = `<h3 class="section-title" data-en="More from this seller" data-ar="المزيد من هذا البائع">More from this seller</h3><div class="products-grid">`;
            listings.forEach(item => {
                html += `
                    <a href="/listing-item/${item.id}" class="product-card">
                        ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="product-image">` : 
                          `<img src="/static/img/placeholder.jpg" alt="No Image" class="product-image">`}
                        <div class="product-details">
                            <div class="product-title">${item.title}</div>
                            <div class="product-price">AED ${item.price}</div>
                            <div class="product-location">${item.city}</div>
                        </div>
                    </a>`;
            });
            html += `</div>`;

            container.innerHTML = html;
      // Re-run translation for new dynamic content
document.querySelectorAll("#sellerListings [data-en][data-ar]").forEach((el) => {
  const lang = localStorage.getItem("dealify_lang") || "en";
  const txt = el.getAttribute(lang === "ar" ? "data-ar" : "data-en");
  if (txt) el.textContent = txt;
});

        })
        .catch(err => {
            container.innerHTML = "<p>Error loading listings.</p>";
        });
}

// Auto load seller listings when page is ready
window.onload = function() {
    loadSellerListings({{ listing.user_id }}, {{ listing.id }});
};


    // Auto-load on page load
    document.addEventListener("DOMContentLoaded", function() {
        loadSellerListings({{ listing.user_id }}, {{ listing.id }});
    });
    // Event Listeners
    document.addEventListener('DOMContentLoaded', function() {
        // Report button
        document.querySelector('.report-btn').addEventListener('click', function() {
            document.getElementById('listing_id').value = this.getAttribute('data-listing-id');
            openModal();
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === document.getElementById('report-modal')) {
                closeModal();
            }
            if (event.target === document.getElementById('image-modal')) {
                closeImageModal();
            }
        });
        
        // Form submission
        document.getElementById('report-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const submitBtn = document.querySelector('.submit-btn');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            
            try {
                const response = await fetch('/report-listing', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.redirected) {
                    window.location.href = response.url;
                } else {
                    const result = await response.json();
                    if (result.error) {
                        alert(result.error);
                    } else {
                        closeModal();
                        alert('Thank you for your report. We will review it shortly.');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while submitting your report.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Report';
            }
        });
        
        // Secure Trade payment form
        document.getElementById('secure-trade-payment-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    alert('Error: ' + (data.error || 'Unexpected error'));
                }
            })
            .catch(error => console.error('Error:', error));
        });
    });




  document.addEventListener("DOMContentLoaded", function() {
    // Load Seller Listings automatically
    loadSellerListings({{ listing.user_id }}, {{ listing.id }});

    // Load User Avatar
    fetch('/get_user_avatar')
        .then(response => response.json())
        .then(data => {
            const avatarImg = document.getElementById('userAvatar');
            avatarImg.src = data.avatar_url;
        })
        .catch(error => {
            console.error('Error loading avatar:', error);
        });
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

