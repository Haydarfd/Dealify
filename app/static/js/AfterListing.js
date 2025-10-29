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
