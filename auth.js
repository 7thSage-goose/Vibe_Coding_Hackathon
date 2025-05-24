document.addEventListener('DOMContentLoaded', function() {
    // Get modal elements
    const loginModal = document.getElementById('login-modal');
    const loginBtn = document.getElementById('login-btn');
    const heroLoginBtn = document.getElementById('hero-login-btn');
    const closeModal = document.querySelector('.close-modal');

    // Show modal function
    function showModal() {
        if (loginModal) {
            loginModal.style.display = 'flex';
        }
    }

    // Hide modal function
    function hideModal() {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
    }

    // Event listeners for opening modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    if (heroLoginBtn) {
        heroLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showModal();
        });
    }

    // Event listener for closing modal
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            hideModal();
        }
    });

    // ========== DOCTOR LOGIN VALIDATION ========== //
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const license = document.getElementById('license').value;

            // Enhanced validation
            if (!email || !password || !license) {
                alert("Please fill in all fields!");
                return;
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Please enter a valid email address!");
                return;
            }

            // License format validation (MED followed by 8 digits)
            const licenseRegex = /^MED\d{8}$/;
            if (!licenseRegex.test(license)) {
                alert("License must start with 'MED' followed by 8 digits!");
                return;
            }

            // Password strength validation
            if (password.length < 8) {
                alert("Password must be at least 8 characters long!");
                return;
            }

            // If all validations pass, log in the doctor
            localStorage.setItem('doctorLoggedIn', 'true');
            localStorage.setItem('doctorEmail', email);
            localStorage.setItem('doctorLicense', license);
            window.location.href = 'doctor-dashboard.html';
        });
    }

    // ========== LOGOUT FUNCTIONALITY ========== //
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear(); // Clear all stored data
        window.location.href = 'index.html';
    });

    // ========== PROTECTED PAGE CHECK ========== //
    const protectedPages = [
        'doctor-dashboard.html',
        'appointments.html',
        'patients.html',
        'medical-records.html',
        'reminders.html',
        'messages.html',
        'settings.html'
    ];

    if (protectedPages.some(page => window.location.pathname.includes(page))) {
        if (!localStorage.getItem('doctorLoggedIn')) {
            window.location.href = 'index.html';
        }
    }
});