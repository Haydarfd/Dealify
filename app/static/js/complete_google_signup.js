
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

