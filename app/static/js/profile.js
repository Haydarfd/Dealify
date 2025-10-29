
const current_user_name = "{{ current_user.name | escape }}";

  // Global variable for cropper instance
  let avatarCropper = null;
  

  function uploadAvatar(input) {
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Validate file size
      if (file.size > 6 * 1024 * 1024) {
        alert('Image size should be less than 6 MB');
        return;
      }
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = function(e) {
        showCropModal(e.target.result);
      }
      reader.readAsDataURL(file);
    }
  }

  function showCropModal(imageSrc) {
    // Create modal elements
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'crop-overlay';
    overlay.onclick = closeCropModal;
    document.body.appendChild(overlay);

    const popup = document.createElement('div');
    popup.className = 'edit-popup';
    popup.innerHTML = `
  <div class="popup-header" style="display: flex; justify-content: center; align-items: center; padding-bottom: 8px;">
  <h2 style="margin: 0; font-size: 18px; color: #0cc4e9; text-align: center; width: 100%;">Crop Profile Picture</h2>
</div>
  <div style="flex: 1; overflow: auto; margin-top: 10px;">
    <img id="image-to-crop" src="${imageSrc}" style="max-width: 100%; display: block; margin: 0 auto;">
    <div style="margin: 12px 0; text-align: center;">
      <input type="range" id="zoomSlider" min="0.5" max="3" step="0.05" value="1" style="width: 100%;">
    </div>
  </div>
  <div class="form-footer" style="display: flex; justify-content: space-between; margin-top: 16px;">
    <button type="button" class="cancel-btn" onclick="closeCropModal()" style="flex: 1; margin-right: 10px; padding: 10px; background: #ccc; border: none; border-radius: 6px;">Cancel</button>
    <button type="button" class="save-btn" id="save-avatar-btn" style="flex: 1; padding: 10px; background: #0cc4e9; color: white; border: none; border-radius: 6px;">Save</button>
  </div>
`;
    document.body.appendChild(popup);
    
    // Initialize cropper
    const image = document.getElementById('image-to-crop');
avatarCropper = new Cropper(image, {
  aspectRatio: 1,                // force square
  viewMode: 2,                   // restrict crop box inside image
  autoCropArea: 1,              // fill the canvas with crop box
  responsive: true,
  dragMode: 'move',              // drag the image, not the crop box
  background: false,             // remove checkerboard bg
  guides: false,                 // remove dashed lines
  highlight: false,              // remove outer highlight
  cropBoxMovable: true,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false
});

    // Add event listener for save button
    document.getElementById('save-avatar-btn').addEventListener('click', saveCroppedImage);
  }

  function saveCroppedImage() {
    if (!avatarCropper) {
      console.error('Cropper instance not found');
      return;
    }
    
    // Get the cropped image
    const croppedCanvas = avatarCropper.getCroppedCanvas({
      width: 300,
      height: 300,
      minWidth: 256,
      minHeight: 256,
      maxWidth: 1024,
      maxHeight: 1024,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });
    
    if (!croppedCanvas) {
      console.error('Failed to get cropped canvas');
      return;
    }
    
    // Convert to blob and upload
    croppedCanvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.jpg');

      
      // Show loading state
      const saveBtn = document.getElementById('save-avatar-btn');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
      
      fetch('/upload_avatar', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          document.getElementById('profile-image').src = data.avatar_url;
          closeCropModal();
          alert('Profile picture updated successfully!');
        } else {
          throw new Error(data.message || 'Upload failed');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Failed to upload avatar');
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save';
      });
    }, 'image/jpeg', 0.9);
  }

  function closeCropModal() {
    // Clean up cropper instance
    if (avatarCropper) {
      avatarCropper.destroy();
      avatarCropper = null;
    }
    
    // Remove modal elements
    const overlay = document.getElementById('crop-overlay');
    const popups = document.querySelectorAll('.edit-popup');
    
    if (overlay) overlay.remove();
    popups.forEach(popup => popup.remove());
    
    // Clear file input
    document.getElementById('avatar-upload').value = '';
  }

  // Remove avatar function
  function removeAvatar() {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      fetch('/remove_avatar', {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          document.getElementById('profile-image').src = data.default_avatar;
          alert('Profile picture removed successfully!');
        } else {
          alert('Error: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to remove avatar');
      });
    }
  }

// Show name edit form
function showNameEdit() {
  const nameElement = document.getElementById('profile-name-text');
  const currentName = nameElement.textContent.trim();

  // Save the original name as data attribute
  nameElement.setAttribute('data-original-name', currentName);

  // Hide the pen icon
  const editBtn = document.getElementById('edit-name-btn');
  if (editBtn) {
    editBtn.style.display = 'none';
  }

  // Insert editable form
  nameElement.innerHTML = `
    <form class="name-edit-form" onsubmit="saveName(event)">
      <input type="text" class="name-edit-input" value="${currentName}" required>
      <button type="submit" class="btn-action"><i class="fas fa-check"></i></button>
      <button type="button" class="btn-action btn-danger" onclick="cancelNameEdit()"><i class="fas fa-times"></i></button>
    </form>
  `;
}

// Cancel name editing
function cancelNameEdit() {
  const nameElement = document.getElementById('profile-name-text');
  const originalName = nameElement.getAttribute('data-original-name') || '';

  // Restore name
  nameElement.innerHTML = originalName;

  // Show pen icon again
  const editBtn = document.getElementById('edit-name-btn');
  if (editBtn) {
    editBtn.style.display = 'inline-block';
  }
}

// Save new name
function saveName(event) {
  event.preventDefault();
  const newName = event.target.querySelector('input').value;

  fetch('/update_profile_name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName })
  })
    .then(response => response.json())
    .then(data => {
      const nameElement = document.getElementById('profile-name-text');

      if (data.success) {
        nameElement.innerHTML = newName;
      } else {
        const fallback = nameElement.getAttribute('data-original-name') || '';
        nameElement.innerHTML = fallback;
        alert('Error updating name: ' + data.message);
      }

      // Show pen icon again
      const editBtn = document.getElementById('edit-name-btn');
      if (editBtn) {
        editBtn.style.display = 'inline-block';
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Failed to update name');
      cancelNameEdit(); // fallback
    });
}

// Show Content Function with smooth scrolling
    let isInitialLoad = true;
function showContent(title) {
  const content = document.getElementById("content");
  content.style.display = "none";
  document.getElementById("RequestVerification").style.display = "none";
  content.innerHTML = "";
  document.getElementById("RequestVerification").style.display = "none";

  document.querySelectorAll('.content-section').forEach(section => {
    section.style.display = 'none';
  });

  if (title === "Dashboard") {
    content.innerHTML = `
  <div class="welcome-message">
    <h2 class="welcome-title" data-en="Welcome to Your Dashboard" data-ar="مرحبًا بك في لوحة التحكم">
      Welcome to Your Dashboard
    </h2>
    <p data-en="Access all your tools in one place - manage listings, view favorites, request verification, and handle your account settings with ease" 
   data-ar="كل أدواتك في مكان واحد - إدارة الإعلانات، عرض المفضلة، طلب التوثيق، والتحكم في إعدادات الحساب بكل سهولة">
   Access all your tools in one place - manage listings, view favorites, request verification, and handle your account settings with ease
</p>
  </div>`;
    content.style.display = "block";
    if (!isInitialLoad) {
  content.scrollIntoView({ behavior: "smooth" });
}
    applyLanguage();
  }
  else if (title === "Manage Listings") {
  content.innerHTML = `<p style="padding: 20px;">Loading...</p>`;
  content.style.display = "block";

  fetch('/get_user_listings')
  .then(response => response.json())
  .then(data => {
    document.getElementById('listings-count').textContent = data.length;

    let html = `
      <div class="card">
        <h3 data-en="Your Listings" data-ar="إعلاناتك">Your Listings</h3>`;

    if (data.length === 0) {
      html += `
        <p class="no-listings" data-en="You haven't posted any listings yet" data-ar="لم تقم بإضافة أي إعلانات بعد">
          You haven't posted any listings yet
        </p>
      </div>`;
      content.innerHTML = html;
      applyLanguage();
      return;
    }

    html += `<div class="listing-grid">`;

    data.forEach(listing => {
      const image = listing.image_paths?.[0] ? `/static/${listing.image_paths[0]}` : '/static/img/no-image.png';
      const createdAt = new Date(listing.created_at).toLocaleDateString('en-GB');
      const status = listing.status === "Sold" ? "Sold" : "Active";
      const statusClass = status === "Sold" ? "status-sold" : "status-active";

      html += `
      <div class="listing-card">
        <div class="listing-photo">
          <img src="${image}" alt="${listing.title}">
        </div>
        <div class="listing-details">
          <h3 class="listing-title">${listing.title}</h3>
          <p class="listing-meta">${listing.category_name} • ${listing.city}</p>
          <p class="listing-date">${createdAt}</p>
          <div class="listing-price-status-row">
<span class="price-badge">
  <svg class="aed-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91">
    <path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
  </svg>
  ${Number(listing.price).toLocaleString()}
</span>
          <span class="listing-status ${statusClass}">${status}</span>
          </div>
          <div class="listing-actions">
            <button onclick="editListing(${listing.id})" title="Edit"><i class="fas fa-edit"></i></button>
            <button class="btn-danger" onclick="deleteListing(${listing.id})" title="Delete"><i class="fas fa-trash"></i></button>
            <button onclick="copyListingLink(${listing.id})" title="Copy Link"><i class="fas fa-link"></i></button>
          </div>
        </div>
      </div>`;
    });

    html += `</div></div>`;
    content.innerHTML = html;
    content.scrollIntoView({ behavior: "smooth" });
    applyLanguage();
  })
  .catch(() => {
    content.innerHTML = `<p class="error-message" data-en="Error loading listings. Please try again." data-ar="حدث خطأ أثناء تحميل الإعلانات. يرجى المحاولة مرة أخرى.">
      Error loading listings. Please try again.
    </p>`;
    applyLanguage();
  });
}
  else if (title === "Favorites") {
    content.innerHTML = `<p style="padding: 20px;">Loading...</p>`;
    content.style.display = "block";
    fetch('/get_user_favorites')
      .then(response => response.json())
      .then(data => {
        document.getElementById('favorites-count').textContent = data.length;

        let html = `
          <div class="card">
            <h3 data-en="Your Favorite Listings" data-ar="إعلاناتك المفضلة">Your Favorite Listings</h3>
            <div class="products-container">`;

        if (data.length === 0) {
          html += `<p class="no-favorites" data-en="You haven't added any listings to favorites yet" data-ar="لم تقم بإضافة أي إعلانات إلى المفضلة بعد">You haven't added any listings to favorites yet</p>`;
        } else {
          data.forEach(listing => {
            html += `
            <div class="product-item">
  <div class="product-image">
    <img src="/static/${listing.image_path}" alt="${listing.title}">
  </div>
  <div class="product-details">
    <h4>${listing.title}</h4>    
    <div class="footer-btn-row">
      <a href="/listing-item/${listing.id}" class="listing-btn-view" data-en="View Details" data-ar="عرض التفاصيل">
        View Details
      </a>
      <span class="listing-btn-price">
        <svg class="price-aed-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.84 299.91">
          <path d="M342.14,140.96l2.7,2.54v-7.72c0-17-11.92-30.84-26.56-30.84h-23.41C278.49,36.7,222.69,0,139.68,0c-52.86,0-59.65,0-109.71,0,0,0,15.03,12.63,15.03,52.4v52.58h-27.68c-5.38,0-10.43-2.08-14.61-6.01l-2.7-2.54v7.72c0,17.01,11.92,30.84,26.56,30.84h18.44s0,29.99,0,29.99h-27.68c-5.38,0-10.43-2.07-14.61-6.01l-2.7-2.54v7.71c0,17,11.92,30.82,26.56,30.82h18.44s0,54.89,0,54.89c0,38.65-15.03,50.06-15.03,50.06h109.71c85.62,0,139.64-36.96,155.38-104.98h32.46c5.38,0,10.43,2.07,14.61,6l2.7,2.54v-7.71c0-17-11.92-30.83-26.56-30.83h-18.9c.32-4.88.49-9.87.49-15s-.18-10.11-.51-14.99h28.17c5.37,0,10.43,2.07,14.61,6.01ZM89.96,15.01h45.86c61.7,0,97.44,27.33,108.1,89.94l-153.96.02V15.01ZM136.21,284.93h-46.26v-89.98l153.87-.02c-9.97,56.66-42.07,88.38-107.61,90ZM247.34,149.96c0,5.13-.11,10.13-.34,14.99l-157.04.02v-29.99l157.05-.02c.22,4.84.33,9.83.33,15Z"/>
        </svg>
        ${Number(listing.price).toLocaleString()}
      </span>
      <button class="btn-action btn-danger" onclick="removeFavorite(${listing.id}, this)">
        <i class="fas fa-heart-broken"></i>
      </button>
    </div>
  </div>
            </div>`;
          });
        }
        html += `</div></div>`;
        content.innerHTML = html;
        content.scrollIntoView({ behavior: "smooth" });
      	applyLanguage();
      })
      .catch(() => {
        content.innerHTML = `<p class="error-message">Error loading favorites. Please try again.</p>`;
      });
  } else if (title === "RequestVerification") {
    document.querySelectorAll('.content-section').forEach(section => {
      section.style.display = 'none';
    });

    const formSection = document.getElementById("RequestVerification");
    if (formSection) {
      formSection.style.display = "block";
      formSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

  // Remove favorite function
  function removeFavorite(listingId, element) {
    fetch(`/remove_favorite/${listingId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Remove the item from UI
        element.closest('.product-item').remove();
        // Update favorites count
        const currentCount = parseInt(document.getElementById('favorites-count').textContent);
        document.getElementById('favorites-count').textContent = currentCount - 1;
      } else {
        alert('Error removing favorite: ' + data.message);
      }
    })
    .catch(() => {
      alert('Failed to remove favorite');
    });
  }

  // Edit Listing Function
  function editListing(listingId) {
    fetch(`/get_listing/${listingId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Listing not found');
        }
        return response.json();
      })
      .then(data => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.id = 'edit-overlay';
        document.body.appendChild(overlay);

const popup = document.createElement('div');
popup.className = 'edit-popup';
popup.innerHTML = `
  <div class="popup-header">
    <h2 data-en="Edit Listing" data-ar="تعديل الإعلان">Edit Listing</h2>
    <button class="close-btn" onclick="closeEditPopup()">×</button>
  </div>
  <form id="edit-listing-form" class="popup-form">
    <div class="input-group">
      <label data-en="Title" data-ar="العنوان">Title</label>
      <input type="text" name="title" value="${escapeHtml(data.title) || ''}" required>
    </div>
    <div class="input-group">
      <label data-en="Description" data-ar="الوصف">Description</label>
      <textarea name="description">${escapeHtml(data.description) || ''}</textarea>
    </div>
    <div class="row">
      <div class="input-group">
        <label data-en="Price (AED)" data-ar="السعر (درهم)">Price (AED)</label>
        <input type="number" name="price" step="0.01" value="${data.price || ''}">
      </div>
      <div class="input-group">
        <label data-en="City" data-ar="المدينة">City</label>
        <select name="city" class="custom-select">
          <option value="" data-en="Select City" data-ar="اختر المدينة">Select City</option>
          <option value="Dubai" data-en="Dubai" data-ar="دبي">Dubai</option>
          <option value="Abu Dhabi" data-en="Abu Dhabi" data-ar="أبو ظبي">Abu Dhabi</option>
          <option value="Sharjah" data-en="Sharjah" data-ar="الشارقة">Sharjah</option>
          <option value="Ajman" data-en="Ajman" data-ar="عجمان">Ajman</option>
          <option value="Ras Al Khaimah" data-en="Ras Al Khaimah" data-ar="رأس الخيمة">Ras Al Khaimah</option>
          <option value="Fujairah" data-en="Fujairah" data-ar="الفجيرة">Fujairah</option>
          <option value="Umm Al Quwain" data-en="Umm Al Quwain" data-ar="أم القيوين">Umm Al Quwain</option>
        </select>
      </div>
    </div>
    <div class="input-group">
      <label data-en="Address" data-ar="العنوان">Address</label>
      <input type="text" name="address" value="${escapeHtml(data.address) || ''}">
    </div>
    <div class="form-footer">
      <button type="button" class="cancel-btn" data-en="Cancel" data-ar="إلغاء" onclick="closeEditPopup()">Cancel</button>
      <button type="submit" class="save-btn" data-en="Save" data-ar="حفظ التعديلات">Save Changes</button>
    </div>
  </form>
`;

        document.body.appendChild(popup);
      // Reapply language to dynamic content
const savedLang = localStorage.getItem("dealify_lang") || "en";

// Update text inside the newly added popup
popup.querySelectorAll("[data-en][data-ar]").forEach((el) => {
  const txt = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
  if (txt) el.textContent = txt;
});

// Update placeholders inside the popup if needed
popup.querySelectorAll("[placeholder][data-en][data-ar]").forEach((el) => {
  const ph = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
  if (ph) el.setAttribute("placeholder", ph);
});

// Update dropdown options inside the popup
popup.querySelectorAll("option[data-en][data-ar]").forEach((opt) => {
  const val = opt.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
  if (val) opt.textContent = val;
});

      // Set selected city after popup is added
const selectCity = popup.querySelector('select[name="city"]');
if (selectCity && data.city) {
  [...selectCity.options].forEach(opt => {
    if (opt.value === data.city) {
      opt.selected = true;
    }
  });
}


        // Add form submit handler
        document.getElementById("edit-listing-form").addEventListener("submit", function(e) {
          e.preventDefault();
          const formData = new FormData(this);
          
          fetch(`/edit_listing/${listingId}`, {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to update listing');
            }
            return response.json();
          })
          .then(result => {
            closeEditPopup();
            showContent('Manage Listings');
            alert(result.message || 'Listing updated successfully!');
          })
          .catch(error => {
            console.error('Error updating listing:', error);
            alert(error.message || 'Failed to update listing. Please try again.');
          });
        });
      })
      .catch(error => {
        console.error('Error fetching listing:', error);
        alert(error.message || 'Failed to load listing details. Please try again.');
      });
  }

  // Helper function to escape HTML
  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function closeEditPopup() {
    const overlay = document.getElementById('edit-overlay');
    const popup = document.querySelector('.edit-popup');
    
    if (overlay) overlay.remove();
    if (popup) popup.remove();
  }

  // Delete Listing Function
  function deleteListing(id) {
  const lang = localStorage.getItem("dealify_lang") || "en";

  const messages = {
    confirm: {
      en: "Are you sure you want to delete this listing?",
      ar: "هل أنت متأكد أنك تريد حذف هذا الإعلان؟"
    },
    fail: {
      en: "Failed to delete listing.",
      ar: "فشل في حذف الإعلان."
    }
  };

  if (confirm(messages.confirm[lang])) {
    fetch(`/delete_user_listing/${id}`, { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        showContent('Manage Listings');
      })
      .catch(() => alert(messages.fail[lang]));
  }
}


  // Logout Function
  function logout() {
  const lang = localStorage.getItem("dealify_lang") || "en";

  const msg = {
    en: "Are you sure you want to logout?",
    ar: "هل أنت متأكد أنك تريد تسجيل الخروج؟"
  };

  if (confirm(msg[lang])) {
    document.getElementById("logout-form").submit();
  }
}

    

  // Delete Account Function
  function deleteAccount() {
  const lang = localStorage.getItem("dealify_lang") || "en";

  const msg1 = {
    en: "Are you sure you want to delete your account? This action cannot be undone.",
    ar: "هل أنت متأكد أنك تريد حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه."
  };

  const msg2 = {
    en: "This is your final confirmation. Do you really want to delete your account permanently?",
    ar: "هذا هو التأكيد النهائي. هل تريد بالتأكيد حذف حسابك نهائيًا؟"
  };

  if (confirm(msg1[lang])) {
    if (confirm(msg2[lang])) {
      fetch("/delete_my_account", {
  method: "DELETE",
  headers: {
    "X-Lang": lang
  }
})
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        if (data.success) {
          window.location.href = "/login";
        }
      })
      .catch(() => {
        alert(lang === "ar" ? "فشل في حذف الحساب. حاول مرة أخرى." : "Failed to delete account. Please try again.");
      });
    }
  }
}


  // Initialize with dashboard content
  document.addEventListener("DOMContentLoaded", function() {
    showContent("Dashboard");
    
    // Load user avatar if available
    fetch('/get_user_avatar')
  .then(response => response.json())
  .then(data => {
    if (data.avatar_url) {
      document.getElementById('profile-image').src = `${data.avatar_url}?t=${new Date().getTime()}`;
    }
  })
  .catch(error => console.error('Error loading avatar:', error));

      
    // Load initial counts
    fetch('/get_user_listings')
      .then(response => response.json())
      .then(data => {
        document.getElementById('listings-count').textContent = data.length;
      });
      
    fetch('/get_user_favorites')
      .then(response => response.json())
      .then(data => {
        document.getElementById('favorites-count').textContent = data.length;
      });
  });


      

  function closeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.style.display = 'none';
  }

  function changeLanguage(lang) {
    localStorage.setItem("dealify_lang", lang);
    applyLanguage();
  }

  function applyLanguage() {
    const savedLang = localStorage.getItem("dealify_lang") || "en";
    document.documentElement.lang = savedLang;

    document.querySelectorAll("[data-en][data-ar]").forEach((el) => {
      const txt = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
      if (txt) el.textContent = txt;
    });

    document.querySelectorAll("[placeholder][data-en][data-ar]").forEach((el) => {
      const ph = el.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
      if (ph) el.setAttribute("placeholder", ph);
    });

    document.querySelectorAll("option[data-en][data-ar]").forEach((opt) => {
      const val = opt.getAttribute(savedLang === "ar" ? "data-ar" : "data-en");
      if (val) opt.textContent = val;
    });

    // Toggle navbar language buttons
    const btnEn = document.getElementById("lang-en");
    const btnAr = document.getElementById("lang-ar");
    if (btnEn && btnAr) {
      btnEn.style.display = savedLang === "ar" ? "inline-flex" : "none";
      btnAr.style.display = savedLang === "ar" ? "none" : "inline-flex";
    }

    // Toggle sidebar buttons
    const sidebarBtnEn = document.getElementById("sidebar-lang-en");
    const sidebarBtnAr = document.getElementById("sidebar-lang-ar");
    if (sidebarBtnEn && sidebarBtnAr) {
      sidebarBtnEn.style.display = savedLang === "ar" ? "inline-flex" : "none";
      sidebarBtnAr.style.display = savedLang === "ar" ? "none" : "inline-flex";
    }

    // Optional icon/label support
    try {
      const languageLabel = document.getElementById("languageLabel");
      const langText = document.getElementById("languageText");
      const langIcon = document.getElementById("languageIcon");

      if (languageLabel && langText && langIcon) {
        langText.textContent = "";
        langIcon.src = savedLang === "ar" ? languageLabel.dataset.arImg : languageLabel.dataset.enImg;
      }
    } catch (e) {
      console.warn("Optional language icon/label not found.");
    }
  }

  // Initial run on page load
  document.addEventListener("DOMContentLoaded", applyLanguage);

  const image = document.getElementById('image-to-crop');
avatarCropper = new Cropper(image, {
  aspectRatio: 1,
  viewMode: 2,
  autoCropArea: 1,
  dragMode: 'move',
  background: false,
  guides: false,
  highlight: false,
  cropBoxMovable: true,
  cropBoxResizable: true,
  toggleDragModeOnDblclick: false
});

// 🔄 Real-time zoom
document.getElementById('zoomSlider').oninput = function () {
  avatarCropper.zoomTo(parseFloat(this.value));
};

function selectLanguageFirstTime(lang) {
  localStorage.setItem("dealify_lang", lang);

  fetch('/set_lang_selected', {
    method: 'POST'
  })
  .then(() => {
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  document.body.addEventListener("input", function (e) {
    const target = e.target;

    if (target.classList.contains("name-edit-input")) {
      // Block anything except letters, numbers, and spaces
      target.value = target.value.replace(/[^\p{L}\p{N} ]+/gu, '');
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // FRONT ID
  const frontInput = document.getElementById("emirates_id_front");
  const frontPreview = document.getElementById("eid-front-preview");

  frontInput.addEventListener("change", function () {
    const file = frontInput.files[0];
    frontPreview.textContent = file ? file.name : '';
  });

  // BACK ID
  const backInput = document.getElementById("emirates_id_back");
  const backPreview = document.getElementById("eid-back-preview");

  backInput.addEventListener("change", function () {
    const file = backInput.files[0];
    backPreview.textContent = file ? file.name : '';
  });
});

  document.getElementById("verificationForm").addEventListener("submit", function () {
  const btn = document.getElementById("submitBtn");
  const lang = localStorage.getItem("dealify_lang") || "en";  // ✅ correct key

  btn.disabled = true;

  if (lang === "ar") {
    btn.textContent = "...جارٍ الإرسال";
  } else {
    btn.textContent = "Submitting...";
  }
});

function smartBack() {
    const referrer = document.referrer;
    const cameFromLoginOrSignup = referrer.includes('/login') || referrer.includes('/signup');

    if (cameFromLoginOrSignup) {
        window.location.href = "/";
    } else {
        window.history.back();
    }
}

function copyListingLink(listingId) {
  const link = `${window.location.origin}/listing-item/${listingId}`;
  navigator.clipboard.writeText(link)
    .then(() => {
      alert("Link copied to clipboard!");
    })
    .catch(() => {
      alert("Failed to copy link. Please try manually.");
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

