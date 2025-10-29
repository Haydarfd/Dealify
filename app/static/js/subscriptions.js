
const stripe = Stripe("pk_live_51QyiaZK8JI68MNtwd8k1xiqv9dDSIbYoW1VeeGYCDuf2QxccuWjEHOYBcC8ogKe9RmwKyq7ywuVx8hsk3DG2PiqB00asB0rUGM");
const currentUserId = {{ current_user.id }};

// Unified payment handler
function handlePayment(packageId, price, packageName, maxListings, userId) {
  // Check if running in Appilix WebView
  if (typeof Appilix !== 'undefined' && Appilix.isRunningInApp()) {
    startAppilixPurchase(packageId, price, packageName, maxListings, userId);
  } else {
    startStripePayment(packageId, price, packageName, maxListings, userId);
  }
}

// Handle Appilix purchases
function startAppilixPurchase(packageId, price, packageName, maxListings, userId) {
  // Map package IDs to Appilix product IDs
  const productMap = {
    1: 'dealify_1_credit',
    2: 'dealify_3_credits',
    3: 'dealify_6_credits',
    4: 'dealify_12_credits'
  };
  
  const productId = productMap[packageId];
  
  if (!productId) {
    alert('Product not available in app');
    return;
  }

  Appilix.openCheckout({
    productId: productId,
    quantity: maxListings,
    userId: userId
  }, function(result) {
    if (result.success) {
      // Verify purchase with backend
      verifyAppilixPurchase(userId, packageId, result.transactionId);
    } else {
      alert('Purchase failed: ' + (result.error || 'Unknown error'));
    }
  });
}
    

// Verify Appilix purchase with backend
function verifyAppilixPurchase(userId, packageId, transactionId) {
  fetch('/appilix-purchase-verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
user_id: userId,
package_id: packageId,
purchase_token: transactionId  // ✅ Must match backend key
})

  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert('Purchase successful! Credits added.');
      // Optional: Refresh user data or redirect
      window.location.reload();
    } else {
      alert('Purchase verification failed: ' + (data.error || ''));
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Verification error. Please contact support.');
  });
}

// Handle Stripe payments
function startStripePayment(packageId, price, packageName, maxListings, userId) {
  fetch('/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ packageId, price, packageName, maxListings, userId })
  })
  .then(response => response.json())
  .then(session => {
    if (session.id) {
      return stripe.redirectToCheckout({ sessionId: session.id });
    } else {
      console.error('Stripe session creation failed:', session);
      alert('Payment initialization failed. Please try again.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  });
}

document.querySelectorAll('.menu-item').forEach(item => {
item.classList.remove('active');
});

<script src="{{ url_for('static', filename='js/navscript.js') }}"></script>



document.addEventListener("DOMContentLoaded", () => {
document.querySelectorAll(".plan.hidden-plan").forEach(plan => {
  plan.classList.remove("hidden-plan");
  plan.style.visibility = "visible";
  plan.style.height = "auto";
  plan.style.opacity = "1";
});
});

function scrollToTop(event) {
event.preventDefault(); // Prevent link jump
window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
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
    if (txt) el.innerHTML = txt.replace(/\\n/g, "<br>");
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

function updateLanguageTexts(lang) {
document.querySelectorAll('[data-en], [data-ar]').forEach(el => {
  const text = lang === 'ar' ? el.getAttribute('data-ar') : el.getAttribute('data-en');
  if (text) {
    el.innerHTML = text.replace(/\\n/g, "<br>");
  }
});
}

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

