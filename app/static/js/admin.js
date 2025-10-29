// Toggle sidebar on mobile
        function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');

    const overlay = document.getElementById('sidebar-overlay');
    overlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').style.display = 'none';
}

      document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeSidebar();
  }
});


        // Show content based on menu selection
        function showContent(title) {
            document.querySelector('.sidebar-menu li.active').classList.remove('active');
            event.currentTarget.parentElement.classList.add('active');
            document.querySelector('.header h1').textContent = title;

            // Hide dashboard when showing other content
            if (title !== 'Dashboard') {
                document.getElementById('dashboard-content').style.display = 'none';
                document.getElementById('dynamic-content').style.display = 'block';
            } else {
                document.getElementById('dashboard-content').style.display = 'block';
                document.getElementById('dynamic-content').style.display = 'none';
                return;
            }

            if (title === "Manage Users") {
                fetch('/get_users')
                    .then(response => response.json())
                    .then(data => {
                        let content = `<div class="card">
                            <div class="card-header">
                                <h2>Manage Users</h2>
                                <button class="btn btn-primary" onclick="showAddUserForm()">
                                    <i class="fas fa-plus"></i> Add User
                                </button>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
											<th>Phone</th>
											<th>Emirate</th>
											<th>Created At</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                        
                        data.forEach(user => {
                            content += `<tr>
                                <td>${user.id}</td>
                                <td>
  <div style="display: flex; align-items: center; gap: 0.75rem;">
   <img src="${user.has_avatar ? `${user.avatar_url}?t=${Date.now()}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff`}" 
     alt="${user.name}" 
         style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
    ${user.name}
  </div>
</td>

                                <td>${user.email}</td>
								<td>${user.phone || '-'}</td> <!-- ✅ SHOW PHONE -->
								<td>${user.emirate || '-'}</td>
								<td>${user.created_at}</td> 
                                <td><span class="badge ${user.role === 'admin' ? 'badge-success' : ''}">${user.role}</span></td>
                                <td>
                                    <span class="status">
                                        <span class="status-indicator ${user.status === 'active' ? 'status-active' : 'status-inactive'}"></span>
                                        ${user.status || 'active'}
                                    </span>
                                </td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                        <button class="btn btn-sm btn-primary" onclick="editUser(${user.id})">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-success" onclick="showAddListingForm(${user.id})">
                                            <i class="fas fa-plus"></i> Listing
                                        </button>
                                    </div>
                                    <div id="add-listing-form-${user.id}" class="hidden-form">
                                        <div class="form-row">
                                            <div class="form-group">
                                                <label>Listing Count</label>
                                                <input type="number" id="listing-count-${user.id}" class="form-control" 
                                                       placeholder="Count" min="1">
                                            </div>
                                            <button class="btn btn-sm btn-primary" onclick="submitListingCount(${user.id})">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>`;
                        });
                        
                        content += `</tbody></table></div></div>`;
                        document.getElementById('dynamic-content').innerHTML = content;
                    })
                    .catch(error => {
                        console.error('Error fetching users:', error);
                        document.getElementById('dynamic-content').innerHTML = `
                            <div class="card">
                                <div class="card-header">
                                    <h2>Error</h2>
                                </div>
                                <div style="padding: 1.5rem; color: var(--danger);">
                                    Failed to load users. Please try again.
                                </div>
                            </div>`;
                    });
                    
            } else if (title === "Reports") {
                fetch('/get_reports')
                    .then(response => response.json())
                    .then(data => {
                        let content = `<div class="card">
                            <div class="card-header">
                                <h2>Reported Listings</h2>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Listing ID</th>
                                            <th>Title</th>
                                            <th>Reason</th>
                                            <th>Reported By</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                        
                        data.forEach(report => {
                            content += `<tr>
                                <td>${report.listing_id}</td>
                                <td>${report.listing_title}</td>
                                <td>${report.reason}</td>
                                <td>${report.reported_by}</td>
                                <td>${report.date || 'N/A'}</td>
                                <td>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-sm btn-danger" onclick="deleteReportedListing(${report.listing_id})">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                        <button class="btn btn-sm btn-warning" onclick="ignoreReport(${report.report_id})">
                                            <i class="fas fa-times"></i> Ignore
                                        </button>
                                    </div>
                                </td>
                            </tr>`;
                        });
                        
                        content += `</tbody></table></div></div>`;
                        document.getElementById('dynamic-content').innerHTML = content;
                    })
                    .catch(error => {
                        console.error('Error fetching reports:', error);
                        document.getElementById('dynamic-content').innerHTML = `
                            <div class="card">
                                <div class="card-header">
                                    <h2>Error</h2>
                                </div>
                                <div style="padding: 1.5rem; color: var(--danger);">
                                    Failed to load reports. Please try again.
                                </div>
                            </div>`;
                    });
                    
            } else if (title === "Manage Listings") {
                fetch('/get_listings')
                    .then(response => response.json())
                    .then(data => {
                        let content = `<div class="card">
                            <div class="card-header">
                                <h2>Manage Listings</h2>
                                <div style="display: flex; gap: 0.5rem;">
                                    <button class="btn btn-primary">
                                        <i class="fas fa-filter"></i> Filter
                                    </button>
                                    <button class="btn btn-success">
                                        <i class="fas fa-download"></i> Export
                                    </button>
                                </div>
                            </div>
                            <div class="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Title</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>User</th>
                                            <th>Phone</th>
                                            <th>Emirate</th>
                                            <th>Created At</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>`;
                        
                        data.forEach(listing => {
    content += `<tr>
        <td>${listing.id}</td>
        <td>
            <a href="/listing-item/${listing.id}" target="_blank" style="color: var(--primary); text-decoration: none;">
                ${listing.title}
            </a>
        </td>
        <td>${listing.price}</td>
        <td>${listing.category_name}</td>
        <td>${listing.user_name}</td>
        <td>${listing.phone || '-'}</td>
        <td>${listing.emirate || '-'}</td>
        <td>${listing.created_at || '-'}</td>
        <td>
            <span class="badge ${listing.status === 'active' ? 'badge-success' : ''}">
                ${listing.status || 'active'}
            </span>
        </td>
        <td>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-sm btn-danger" onclick="deleteListing(${listing.id})">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-sm btn-primary" onclick="editListing(${listing.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </td>
    </tr>`;
});

                        
                        content += `</tbody></table></div></div>`;
                        document.getElementById('dynamic-content').innerHTML = content;
                    })
                    .catch(error => {
                        console.error('Error fetching listings:', error);
                        document.getElementById('dynamic-content').innerHTML = `
                            <div class="card">
                                <div class="card-header">
                                    <h2>Error</h2>
                                </div>
                                <div style="padding: 1.5rem; color: var(--danger);">
                                    Failed to load listings. Please try again.
                                </div>
                            </div>`;
                    });
                    
            } else if (title === "Payments") {
                document.getElementById('dynamic-content').innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h2>Payment Management</h2>
                        </div>
                        <div style="padding: 1.5rem;">
                            <p>Payment overview and transaction history will be displayed here.</p>
                            <div style="background: var(--light-gray); padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                                <h3 style="margin-bottom: 0.5rem;">Recent Transactions</h3>
                                <p style="color: var(--gray);">No recent transactions found.</p>
                            </div>
                        </div>
                    </div>`;
            } else {
                document.getElementById('dynamic-content').innerHTML = `
                    <div class="card">
                        <div class="card-header">
                            <h2>${title}</h2>
                        </div>
                        <div style="padding: 1.5rem;">
                            <p>Content for ${title} will be displayed here.</p>
                        </div>
                    </div>`;
            }
        }

        // User management functions
        function deleteUser(userId) {
            if (confirm("Are you sure you want to delete this user?")) {
                fetch(`/delete_user/${userId}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        showToast(data.message, 'success');
                        showContent("Manage Users");  // Refresh table after deletion
                    })
                    .catch(error => {
                        console.error('Error deleting user:', error);
                        showToast('Failed to delete user', 'error');
                    });
            }
        }

        function editUser(userId) {
            // In a real app, this would show an edit form or modal
            alert(`Edit user ${userId} functionality would go here`);
        }

        function showAddUserForm() {
            // In a real app, this would show an add user form
            alert('Add user form would appear here');
        }

        // Listing management functions
        function deleteListing(listingId) {
            if (confirm("Are you sure you want to delete this listing?")) {
                fetch(`/delete_listing/${listingId}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        showToast(data.message, 'success');
                        showContent("Manage Listings");  // Refresh table after deletion
                    })
                    .catch(error => {
                        console.error('Error deleting listing:', error);
                        showToast('Failed to delete listing', 'error');
                    });
            }
        }

        function editListing(listingId) {
    fetch(`/admin_get_listing/${listingId}`)
        .then(response => {
            if (!response.ok) throw new Error('Listing not found');
            return response.json();
        })
        .then(data => {
            const popup = document.createElement('div');
            popup.className = 'edit-popup';
            popup.innerHTML = `
                <div class="popup-header">
                    <h2>Edit Listing</h2>
                    <button class="close-btn" onclick="popup.remove()">×</button>
                </div>
                <form id="admin-edit-form">
                    <label>Title</label>
                    <input type="text" name="title" value="${data.title || ''}" required>
                    <label>Description</label>
                    <textarea name="description">${data.description || ''}</textarea>
                    <label>Price (AED)</label>
                    <input type="number" name="price" step="0.01" value="${data.price || ''}">
                    <label>City</label>
                    <input type="text" name="city" value="${data.city || ''}">
                    <label>Address</label>
                    <input type="text" name="address" value="${data.address || ''}">
                    <div class="form-footer" style="margin-top: 1rem;">
                        <button type="button" onclick="popup.remove()">Cancel</button>
                        <button type="submit">Save Changes</button>
                    </div>
                </form>
            `;
            document.body.appendChild(popup);

            // Submit logic
            document.getElementById("admin-edit-form").onsubmit = function (e) {
                e.preventDefault();
                const formData = new FormData(this);
                fetch(`/admin_edit_listing/${listingId}`, {
                    method: 'POST',
                    body: formData
                })
                .then(res => res.json())
                .then(result => {
                    popup.remove();
                    showToast(result.message || "Listing updated", "success");
                    showContent("Manage Listings");
                })
                .catch(() => {
                    showToast("Failed to update listing", "error");
                });
            };
        })
        .catch(error => {
            showToast(error.message || 'Error loading listing', 'error');
        });
}


        // Report management functions
        function deleteReportedListing(listingId) {
            if (confirm("Are you sure you want to delete this reported listing?")) {
                fetch(`/delete_listing/${listingId}`, { method: 'DELETE' })
                    .then(response => response.json())
                    .then(data => {
                        showToast(data.message, 'success');
                        showContent("Reports");  // Refresh after deletion
                    })
                    .catch(error => {
                        console.error('Error deleting reported listing:', error);
                        showToast('Failed to delete reported listing', 'error');
                    });
            }
        }

        function ignoreReport(reportId) {
    if (!reportId) return alert("Invalid report ID");

    fetch(`/ignore_report/${reportId}`, {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        showToast(data.message, data.success ? 'success' : 'error');
        if (data.success) showContent("Reports"); // Refresh the table
    })
    .catch(err => {
        console.error("Error ignoring report:", err);
        showToast("Failed to ignore report", "error");
    });
}

        // Listing count functions
        function showAddListingForm(userId) {
            const form = document.getElementById(`add-listing-form-${userId}`);
            form.classList.toggle('active');
        }
        
        function submitListingCount(userId) {
            const countInput = document.getElementById(`listing-count-${userId}`);
            const count = parseInt(countInput.value);
        
            if (isNaN(count) ){
                showToast('Please enter a valid number', 'error');
                return;
            }
        
            if (count <= 0) {
                showToast('Count must be at least 1', 'error');
                return;
            }
        
            fetch(`/add_listing_count/${userId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ count })
            })
            .then(response => response.json())
            .then(data => {
                showToast(data.message, 'success');
                showContent("Manage Users"); // Refresh the table
            })
            .catch(error => {
                console.error('Error adding listing count:', error);
                showToast('Failed to add listing count', 'error');
            });
        }

        // Toast notification
        function showToast(message, type = 'info') {
            // In a real app, this would show a nice toast notification
            console.log(`${type.toUpperCase()}: ${message}`);
        }

        // Initialize dashboard stats
        document.addEventListener('DOMContentLoaded', function() {
            // Simulate loading stats
            setTimeout(() => {
                fetch('/admin_user_count')
  .then(res => res.json())
  .then(data => {
      document.getElementById('total-users').textContent = data.count.toLocaleString();
  })
  .catch(err => {
      console.error('Failed to load user count:', err);
  });

                fetch('/admin_listing_count')
  .then(res => res.json())
  .then(data => {
      document.getElementById('total-listings').textContent = data.count.toLocaleString();
  })
  .catch(err => {
      console.error('Failed to load listing count:', err);
  });

                document.getElementById('total-revenue').textContent = '$24,890';
                fetch('/admin_report_count')
  .then(res => res.json())
  .then(data => {
      document.getElementById('total-reports').textContent = data.count.toLocaleString();
  })
  .catch(err => {
      console.error('Failed to load report count:', err);
  });

            }, 500);
        });
 

fetch('/admin_activity_feed')
  .then(res => res.json())
  .then(activities => {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = '';

    activities.forEach(activity => {
      let icon = '';
      let title = '';
      if (activity.type === 'user') {
        icon = 'fas fa-user-plus';
        title = 'New user registration';
      } else if (activity.type === 'listing') {
        icon = 'fas fa-list-alt';
        title = 'New listing created';
      } else if (activity.type === 'report') {
        icon = 'fas fa-flag';
        title = 'Listing reported';
      }

      const li = document.createElement('li');
      li.className = 'activity-item';
      li.innerHTML = `
        <div class="activity-icon"><i class="${icon}"></i></div>
        <div class="activity-content">
          <strong>${title}</strong>
          <p>${activity.message}</p>
          <span class="activity-time">${formatTimeAgo(activity.timestamp)}</span>
        </div>
      `;
      feed.appendChild(li);
    });
  })
  .catch(err => console.error('Activity feed error:', err));

// Relative time formatter
function formatTimeAgo(timestamp) {
    const utcDate = new Date(timestamp);

    // Convert to Dubai time (UTC+4)
    const dubaiOffset = 4 * 60; // 4 hours in minutes
    const localDate = new Date(utcDate.getTime() + dubaiOffset * 60000);

    const now = new Date();
    const diff = Math.floor((now - localDate) / 1000); // seconds

    let timeAgo = '';
    if (diff < 60) timeAgo = 'just now';
    else if (diff < 3600) timeAgo = `${Math.floor(diff / 60)} minutes ago`;
    else if (diff < 86400) timeAgo = `${Math.floor(diff / 3600)} hours ago`;
    else timeAgo = `${Math.floor(diff / 86400)} days ago`;

    const fullDate = localDate.toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        hour12: true
    });

    return `${timeAgo} <br><small style="color:#888;">(${fullDate})</small>`;
}

// Example dynamic activities
const activities = [
    {
        icon: 'fa-user-plus',
        title: 'New user registration',
        description: 'John Doe signed up as a new user',
        time: '10 minutes ago'
    },
    {
        icon: 'fa-list-alt',
        title: 'New listing created',
        description: '"Luxury Apartment in Downtown" was added',
        time: '1 hour ago'
    },
    {
        icon: 'fa-flag',
        title: 'Listing reported',
        description: '"Cheap Smartphone" was reported by user',
        time: '3 hours ago'
    },
    {
        icon: 'fa-credit-card',
        title: 'Payment processed',
        description: 'Premium subscription payment from Jane Smith',
        time: '5 hours ago'
    }
];

function renderActivityFeed() {
    const feed = document.getElementById('activity-feed');
    feed.innerHTML = ''; // Clear existing content

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <strong>${activity.title}</strong>
                <p>${activity.description}</p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        feed.appendChild(li);
    });
}

// Call this after DOM loads
document.addEventListener('DOMContentLoaded', renderActivityFeed);

