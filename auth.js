// assets/js/auth.js

document.addEventListener('DOMContentLoaded', function() {
    // Handle login modal functionality
    const loginBtn = document.getElementById('login-btn');
    const heroLoginBtn = document.getElementById('hero-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (heroLoginBtn) {
        heroLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const license = document.getElementById('license').value;
            
            try {
                // Simulate API call to verify medical license
                const verified = await verifyMedicalLicense(license);
                
                if (verified) {
                    // Store login state and redirect
                    localStorage.setItem('doctorLoggedIn', 'true');
                    localStorage.setItem('doctorEmail', email);
                    window.location.href = 'doctor-dashboard.html';
                } else {
                    alert('License verification failed. Please check your credentials.');
                }
            } catch (error) {
                alert('Error during verification. Please try again.');
            }
        });
    }
    
    // Handle logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // Check if user is logged in when accessing protected pages
    if (window.location.pathname.includes('doctor-dashboard.html') || 
        window.location.pathname.includes('appointments.html') ||
        window.location.pathname.includes('patients.html') ||
        window.location.pathname.includes('medical-records.html') ||
        window.location.pathname.includes('reminders.html') ||
        window.location.pathname.includes('messages.html') ||
        window.location.pathname.includes('settings.html')) {
        if (!localStorage.getItem('doctorLoggedIn')) {
            window.location.href = 'index.html';
        }
    }
});

// Mock license verification function
async function verifyMedicalLicense(license) {
    // In a real app, this would call your backend API
    // which would verify with the appropriate medical board database
    return new Promise(resolve => {
        setTimeout(() => {
            // Simple validation for demo
            resolve(license.length >= 8 && /[A-Z]/.test(license));
        }, 1000);
    });
}

// Logout function
function logoutUser() {
    // Clear authentication data
    localStorage.removeItem('doctorLoggedIn');
    localStorage.removeItem('doctorEmail');
    
    // Redirect to login page
    window.location.href = 'index.html';
}

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}

// Verify doctor credentials
function loginDoctor(email, password, license) {
  if (license.length >= 8 && /[A-Z]/.test(license)) {
    localStorage.setItem('doctorLoggedIn', 'true');
    localStorage.setItem('doctorEmail', email);
    window.location.href = 'doctor-dashboard.html';
  } else {
    alert('Invalid license format!');
  }
}

// Logout function
function logout() {
  localStorage.removeItem('doctorLoggedIn');
  window.location.href = 'index.html';
}