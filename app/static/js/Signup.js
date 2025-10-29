
document.getElementById('signupForm').addEventListener('submit', function (e) {
  let isValid = true;

  // Username
  const username = document.getElementById("username");
  const errorUsername = document.getElementById("error-username");
  if (username.value.trim().length < 3) {
    errorUsername.textContent = "Full name must be at least 3 characters.";
    errorUsername.style.display = "block";
    isValid = false;
  } else {
    errorUsername.style.display = "none";
  }

  // Email
  const email = document.getElementById('email');
const emailError = document.getElementById('error-email');

if (!email.validity.valid) {
  if (email.validity.valueMissing) {
    emailError.textContent = 'Email is required.';
  } else if (email.validity.typeMismatch || email.validity.patternMismatch) {
    emailError.textContent = 'Enter a valid email address (e.g. user@example.com).';
  }
  emailError.classList.add('active');
  isValid = false;
} else {
  emailError.textContent = '';
  emailError.classList.remove('active');
}

  // Phone
  const phone = document.getElementById("phoneInput");
  const errorPhone = document.getElementById("error-phone");
  const phoneRegex = /^05[0-9]{8}$/;
  if (!phoneRegex.test(phone.value.trim())) {
    errorPhone.textContent = "Enter a valid UAE phone number (e.g. 0501234567).";
    errorPhone.style.display = "block";
    isValid = false;
  } else {
    errorPhone.style.display = "none";
  }

  // Password
  const password = document.getElementById("password");
  const errorPassword = document.getElementById("error-password");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password.value)) {
    errorPassword.textContent = "Password must be at least 6 characters, include one uppercase letter and one number.";
    errorPassword.style.display = "block";
    isValid = false;
  } else {
    errorPassword.style.display = "none";
  }

  // Confirm Password
  const confirm = document.getElementById("password_confirm");
  const errorConfirm = document.getElementById("error-password-confirm");
  if (confirm.value !== password.value) {
    errorConfirm.textContent = "Passwords do not match.";
    errorConfirm.style.display = "block";
    isValid = false;
  } else {
    errorConfirm.style.display = "none";
  }

  // City
  const city = document.getElementById("city");
  const errorCity = document.getElementById("error-city");
  if (!city.value) {
    errorCity.textContent = "Please select your Emirate.";
    errorCity.style.display = "block";
    isValid = false;
  } else {
    errorCity.style.display = "none";
  }

  if (!isValid) {
    e.preventDefault(); // Stop form submission if invalid
  }
});

function showError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.add('active');
}

function clearErrors() {
  document.querySelectorAll('.error-text').forEach(e => {
    e.textContent = '';
    e.classList.remove('active');
  });
}

function togglePassword(inputId, iconWrapper) {
  const input = document.getElementById(inputId);
  const icon = iconWrapper.querySelector("i");

  if (!input || !icon) return; // safeguard

  const isHidden = input.type === "password";
  input.type = isHidden ? "text" : "password";
  icon.classList.toggle("fa-eye", !isHidden);
  icon.classList.toggle("fa-eye-slash", isHidden);
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



document.getElementById('phoneInput').addEventListener('input', function (e) {
    let input = this.value;

    // Remove anything that's not a digit
    input = input.replace(/\D/g, '');

    // Enforce: first digit = 0
    if (input.length === 1 && input !== '0') {
        input = '';
    }

    // Enforce: second digit = 5
    if (input.length === 2 && input !== '05') {
        input = input[0] === '0' ? '05' : '';
    }

    // Enforce: third digit must be allowed
    const allowedThird = ['0', '2', '3', '4', '5', '6', '8'];
    if (input.length === 3 && !allowedThird.includes(input[2])) {
        input = input.slice(0, 2);
    }

    // Limit to 10 digits total
    if (input.length > 10) {
        input = input.slice(0, 10);
    }

    this.value = input;
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

