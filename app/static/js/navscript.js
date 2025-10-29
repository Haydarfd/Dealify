let currentLanguage = 'en';  

// Change the language based on the button click
function changeLanguage(language) {
  currentLanguage = language;

  // Update the content of each link and placeholder
  document.querySelectorAll('[data-en]').forEach(function (element) {
  if (language === 'en') {
    const enText = element.getAttribute('data-en');
    element.innerHTML = enText.replace(/\n|&#10;/g, '<br>'); // ✅ Render line breaks
    if (element.placeholder) {
      element.placeholder = enText.replace(/\n|&#10;/g, ' '); // no <br> in placeholder
    }
  } else if (language === 'ar') {
    const arText = element.getAttribute('data-ar');
    element.innerHTML = arText.replace(/\n|&#10;/g, '<br>'); // ✅ Same for Arabic
    if (element.placeholder) {
      element.placeholder = arText.replace(/\n|&#10;/g, ' ');
    }
  }
});


  // Change the button's label based on the selected language
  if (language === 'en') {
    document.getElementById('lang-en').style.display = 'none';
    document.getElementById('lang-ar').style.display = 'block';
    document.body.classList.remove('rtl'); // Switch to LTR
  } else {
    document.getElementById('lang-en').style.display = 'block';
    document.getElementById('lang-ar').style.display = 'none';
    document.body.classList.add('rtl'); // Switch to RTL
  }
}

// Initially set to English
changeLanguage('en');

// Burger menu functionality for mobile view
document.getElementById('burger-menu')?.addEventListener('click', function () {
  const navLinks = document.querySelector('.nav-links');
  navLinks.classList.toggle('active');
});
// Load Lucide icons
lucide.createIcons();
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', function() {
      document.querySelectorAll('.nav-links a').forEach(item => item.classList.remove('active'));
      this.classList.add('active');
  });
});
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('active'); // Toggle the 'active' class
}

function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const hamburger = document.querySelector('.mobile-menu-btn');
  
  menu.classList.toggle('open');
  overlay.classList.toggle('active');
  
  // Animate hamburger to X
  if (menu.classList.contains('open')) {
    hamburger.innerHTML = `
      <div class="hamburger-line" style="transform: rotate(45deg) translate(5px, 5px);"></div>
      <div class="hamburger-line" style="opacity: 0;"></div>
      <div class="hamburger-line" style="transform: rotate(-45deg) translate(5px, -5px);"></div>
    `;
  } else {
    hamburger.innerHTML = `
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    `;
  }
}

// Close menu when clicking on a link or anywhere outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('mobileMenu');
  const overlay = document.getElementById('menuOverlay');
  const hamburger = document.querySelector('.mobile-menu-btn');
  
  if (!menu.contains(event.target) && !hamburger.contains(event.target) && menu.classList.contains('open')) {
    toggleMenu();
  }
});
function toggleLanguageImage() {
  const label = document.getElementById('languageLabel');
  const enImg = label.dataset.enImg;
  const arImg = label.dataset.arImg;

  const isEnglish = label.innerHTML.includes(enImg);

  if (isEnglish) {
    // If it's English, show Arabic flag and text
    label.innerHTML = `<img src="${arImg}" alt="Arabic" style="width: 20px;"> العربية`;
    changeLanguage('ar');
  } else {
    // If it's Arabic, show English flag and text
    label.innerHTML = `<img src="${enImg}" alt="English" style="width: 20px;"> English`;
    changeLanguage('en');
  }
}


  function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = "/"; // fallback to homepage if no history
  }
}

