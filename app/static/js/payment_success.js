
// Simple confetti effect
document.addEventListener('DOMContentLoaded', () => {
    const colors = ['#3a86ff', '#4cc9a7', '#8338ec', '#ff006e'];
    const card = document.querySelector('.success-card');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = -10 + 'px';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.width = Math.random() * 8 + 4 + 'px';
        confetti.style.height = Math.random() * 3 + 2 + 'px';
        card.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.opacity = 1;
            confetti.style.animation = `fall-${Math.ceil(Math.random() * 4)} ${Math.random() * 3 + 2}s forwards`;
        }, Math.random() * 500);
    }
    
    // Add fall animations dynamically
    const style = document.createElement('style');
    for (let i = 1; i <= 4; i++) {
        style.textContent += `
            @keyframes fall-${i} {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
                100% { transform: translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 360}deg); opacity: 0; }
            }
        `;
    }
    document.head.appendChild(style);
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

