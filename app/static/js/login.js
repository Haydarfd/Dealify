function togglePassword(inputId, toggleEl) {
    const input = document.getElementById(inputId);
    const icon = toggleEl.querySelector('i');
  
    if (input.type === "password") {
      input.type = "text";
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
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

    async function handleGoogleResponse(response) {
      const credential = response.credential;
  
      // Send token to your backend to decode it & check user status
      const res = await fetch('/google_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: credential })
      });
  
      const data = await res.json();
  
      if (data.status === 'existing') {
        // ✅ Logged in
        window.location.href = '/profile';
      } else if (data.status === 'new') {
        // 🔄 Need more info (phone, emirate)
        localStorage.setItem('google_token', credential);
        window.location.href = '/complete_google_signup';
      }
    }

  <script src="https://accounts.google.com/gsi/client" async defer></script>

  // STEP 1: Levenshtein function
  window.levenshtein = function(a, b) {
    const an = a.length;
    const bn = b.length;
    if (an === 0) return bn;
    if (bn === 0) return an;
  
    const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
    for (let j = 1; j <= an; j++) matrix[0][j] = j;
  
    for (let i = 1; i <= bn; i++) {
      for (let j = 1; j <= an; j++) {
        matrix[i][j] = b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
      }
    }
  
    return matrix[bn][an];
  };
  
  // STEP 2: Typo detection and correction
  const validDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com'];
  
  function suggestEmailFix(email) {
    const [localPart, domainPart] = email.split('@');
    if (!domainPart) return email;
  
    if (validDomains.includes(domainPart)) return email;
  
    let closest = domainPart;
    let minDistance = Infinity;
  
    for (const domain of validDomains) {
      const distance = window.levenshtein(domainPart, domain);
      if (distance < minDistance) {
        minDistance = distance;
        closest = domain;
      }
    }
  
    if (minDistance <= 2) {
      return `${localPart}@${closest}`;
    }
  
    return email;
  }
  
  // STEP 3: Attach to email input field
  document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;
  
    emailInput.addEventListener('blur', () => {
      const corrected = suggestEmailFix(emailInput.value);
      if (corrected !== emailInput.value) {
        alert(`Did you mean: ${corrected}?`);
        emailInput.value = corrected;
      }
    });
  });

  <script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
  

    document.addEventListener('DOMContentLoaded', function () {
      AppleID.auth.init({
        clientId: "ae.dealify.web", // must match Services ID
        scope: "name email",
        redirectURI: "https://dealify.ae/apple_callback",
        usePopup: true
      });
  
      document.getElementById("apple-signin-btn").addEventListener("click", function () {
        AppleID.auth.signIn()
          .then((response) => {
            const idToken = response.authorization.id_token;
  
            // Try to get full name (only available on first login)
            let fullName = "Apple User";
            if (response.user && response.user.name) {
              const { firstName, lastName } = response.user.name;
              fullName = `${firstName || ''} ${lastName || ''}`.trim() || "Apple User";
            }
  
            fetch("/apple_login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ identityToken: idToken, fullName })
            })
            .then(res => res.json())
            .then(data => {
              if (data.status === "existing") {
                window.location.href = "/profile";
              } else if (data.status === "new") {
                localStorage.setItem("apple_token", idToken);
                window.location.href = "/complete_google_signup";
              } else {
                alert("Apple sign-in failed. Please try again.");
              }
            })
            .catch(err => {
              console.error("❌ Apple login request failed", err);
              alert("An unexpected error occurred. Please try again.");
            });
          })
          .catch(err => {
            console.warn("❌ Apple Sign-In popup closed or failed:", err);
  
            // Don't show alert if user cancelled or dismissed the popup
            const silentCancel =
              err?.error === "popup_closed_by_user" ||
              err?.error === "user_cancelled_authorize" ||
              err?.message?.toLowerCase().includes("popup") ||
              err?.message?.toLowerCase().includes("cancel");
  
            if (!silentCancel) {
              alert("Apple Sign-In failed. Please Restart App.");
            }
          });
      });
    });

  function openWhatsApp() {
    const email = document.getElementById('email')?.value.trim();
    const baseURL = "https://wa.me/971526006875"; // Replace with your number (no +, no dashes)
    const msg = `Hello, I forgot my password on Dealify.${email ? ' My email is ' + email : ''}`;
    const encoded = encodeURIComponent(msg);
    window.open(`${baseURL}?text=${encoded}`, '_blank');
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