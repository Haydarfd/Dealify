
// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDT9_FOEODcmcpG3Df00xb2rbsS2M2bmB8",
  authDomain: "dealify-ios.firebaseapp.com",
  projectId: "dealify-ios",
  storageBucket: "dealify-ios.appspot.com",
  messagingSenderId: "828643865110",
  appId: "1:828643865110:web:089519ab562ced49183b37",
  measurementId: "G-SM2PW250JG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
  // Language initialization
  const savedLang = localStorage.getItem("dealify_lang") || "en";
  document.documentElement.lang = savedLang;
  updateLanguageElements(savedLang);

  // Get form data from sessionStorage
  const formData = JSON.parse(sessionStorage.getItem('signupFormData'));
  if (!formData || !formData.phone) {
    window.location.href = "{{ url_for('signup') }}";
    return;
  }

  // Initialize reCAPTCHA verifier
  let recaptchaVerifier;
  try {
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        console.log('reCAPTCHA solved', response);
      }
    });
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    document.getElementById('otp-error').textContent = 'Error initializing security verification. Please refresh the page.';
    return;
  }

  // Verify OTP button handler
  document.getElementById('verify-otp-btn').addEventListener('click', function() {
    const otpCode = document.getElementById('otpInput').value.trim();
    const errorElement = document.getElementById('otp-error');
    
    if (!otpCode || otpCode.length !== 6) {
      errorElement.textContent = 'Please enter a valid 6-digit OTP.';
      return;
    }
    
    const credential = firebase.auth.PhoneAuthProvider.credential(
      formData.verificationId,
      otpCode
    );
    
    auth.signInWithCredential(credential)
      .then((userCredential) => {
        return userCredential.user.getIdToken();
      })
      .then((idToken) => {
        formData.firebase_id_token = idToken;
        return fetch("{{ url_for('complete_signup') }}", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          sessionStorage.removeItem('signupFormData');
          window.location.href = data.redirect_url || "{{ url_for('profile_panel') }}";
        } else {
          document.getElementById('otp-error').textContent = data.message || 'Verification failed. Please try again.';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        document.getElementById('otp-error').textContent = 'Invalid OTP. Please try again.';
      });
  });
  
  // Resend OTP functionality
  document.getElementById('resend-otp').addEventListener('click', function(e) {
    e.preventDefault();
    
    const resendBtn = document.getElementById('resend-otp');
    const originalBtnText = resendBtn.textContent;
    resendBtn.disabled = true;
    resendBtn.textContent = "Sending...";
    
    const phoneInput = formData.phone;
    const fullPhoneNumber = "+971" + phoneInput.substring(1);

    // Reset reCAPTCHA if needed
    document.getElementById('recaptcha-container').innerHTML = '';
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'callback': function(response) {
        console.log('reCAPTCHA solved', response);
      }
    });

    auth.signInWithPhoneNumber(fullPhoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        formData.verificationId = confirmationResult.verificationId;
        sessionStorage.setItem('signupFormData', JSON.stringify(formData));
        
        document.getElementById('otp-error').textContent = 'New OTP sent successfully!';
        document.getElementById('otp-error').style.color = 'green';
        
        resendBtn.disabled = false;
        resendBtn.textContent = originalBtnText;
      })
      .catch((error) => {
        console.error('Error resending OTP:', error);
        document.getElementById('otp-error').textContent = 'Error resending OTP: ' + error.message;
        document.getElementById('otp-error').style.color = 'red';
        
        resendBtn.disabled = false;
        resendBtn.textContent = originalBtnText;
      });
  });
});

// Language functions
function updateLanguageElements(lang) {
  // Update all [data-en] / [data-ar] text elements
  document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
    const txt = el.getAttribute(lang === "ar" ? "data-ar" : "data-en");
    if (txt) el.textContent = txt;
  });

  // Update placeholders
  document.querySelectorAll("[placeholder][data-en][data-ar]").forEach((el) => {
    const ph = el.getAttribute(lang === "ar" ? "data-ar" : "data-en");
    if (ph) el.setAttribute("placeholder", ph);
  });

  // Update <option> elements
  document.querySelectorAll("option[data-en][data-ar]").forEach((opt) => {
    const val = opt.getAttribute(lang === "ar" ? "data-ar" : "data-en");
    if (val) opt.textContent = val;
  });
}
