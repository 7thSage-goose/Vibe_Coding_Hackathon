document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Handle form submissions
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Settings saved successfully!');
        });
    });
    
    // Enable two-factor authentication
    const twoFactorBtn = document.querySelector('.two-factor button');
    if (twoFactorBtn) {
        twoFactorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In a complete implementation, this would set up two-factor authentication.');
        });
    }
    
    // Export data
    const exportBtn = document.querySelector('.danger-actions:first-child button');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In a complete implementation, this would export your data.');
        });
    }
    
    // Delete account
    const deleteBtn = document.querySelector('.danger-actions:last-child button');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to permanently delete your account? This cannot be undone.')) {
                alert('In a complete implementation, your account would be deleted.');
            }
        });
    }
    
    // Get form elements
    const profileForm = document.getElementById('profile-form');
    const doctorNameDisplay = document.querySelector('.doctor-name');

    // Load saved profile data
    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('doctorProfile')) || {
            firstName: 'John',
            lastName: 'Smith'
        };

        // Set form values
        document.getElementById('firstName').value = profileData.firstName;
        document.getElementById('lastName').value = profileData.lastName;
        
        // Update header display
        updateDoctorNameDisplay(profileData.firstName, profileData.lastName);
    }

    // Update doctor name in header
    function updateDoctorNameDisplay(firstName, lastName) {
        const doctorNameDisplay = document.querySelector('.doctor-name');
        if (doctorNameDisplay) {
            doctorNameDisplay.textContent = `Dr. ${firstName} ${lastName}`;
        }
    }

    // Handle profile update
    document.getElementById('updateProfile').addEventListener('click', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        
        const profileData = {
            firstName: firstName,
            lastName: lastName,
            // ...other profile data
        };

        // Save to localStorage
        localStorage.setItem('doctorProfile', JSON.stringify(profileData));
        
        // Update header display
        updateDoctorNameDisplay(firstName, lastName);
        
        // Show success notification
        showNotification('Profile updated successfully!');
    });

    // Helper function for notifications
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Load data when page loads
    loadProfileData();
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}