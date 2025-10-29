document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.getElementById('loginLink');
    const loginPopup = document.getElementById('loginPopup');
    const closeButton = document.getElementById('closeButton');
  
    // Open the popup when the login link is clicked
    loginLink.addEventListener('click', () => {
      loginPopup.style.display = 'flex'; // Show the popup
    });
  
    // Close the popup when the "X" button is clicked
    closeButton.addEventListener('click', () => {
      loginPopup.style.display = 'none'; // Hide the popup
    });
  
    // Close the popup when clicking outside of the popup content
    window.addEventListener('click', (event) => {
      if (event.target === loginPopup) {
        loginPopup.style.display = 'none'; // Hide the popup if clicked outside
      }
    });
  }

  // -------------------------------
  // SWIPER + IMAGE COUNTER FOR MULTIPLE CARDS
  // -------------------------------
  document.addEventListener("DOMContentLoaded", function () {
  // 🔹 Load Swiper sliders
  document.querySelectorAll('.swiper').forEach((slider, index) => {
    const swiper = new Swiper(slider, {
      loop: true,
      allowTouchMove: true,
      grabCursor: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
    });

    const counterEl = document.getElementById(`image-counter-${index + 1}`);
    const totalSlides = slider.querySelectorAll('.swiper-slide').length;

    if (counterEl) {
      swiper.on('slideChange', () => {
        const current = swiper.realIndex + 1;
        counterEl.textContent = `${current} / ${totalSlides}`;
      });
    }
  });

  // 🔹 Auto-load seller listings on page load
  loadSellerListings({{ listing.user_id }}, {{ listing.id }});
});
