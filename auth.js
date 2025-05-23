document.addEventListener('DOMContentLoaded', function() {
    // ========== LOGIN MODAL HANDLING ========== //
    const loginBtn = document.getElementById('login-btn');
    const heroLoginBtn = document.getElementById('hero-login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Open modal when login buttons are clicked
    if (loginBtn) loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });
    
    if (heroLoginBtn) heroLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'flex';
    });

    // Close modal when X is clicked
    if (closeModal) closeModal.addEventListener('click', () => loginModal.style.display = 'none');

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    // ========== LOGIN FORM SUBMISSION ========== //
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const license = document.getElementById('license').value;

            // Simple validation (no auto-login)
            if (!email || !password || !license) {
                alert("Please fill in all fields!");
                return;
            }

            // License format check (8+ chars with uppercase)
            if (license.length < 8 || !/[A-Z]/.test(license)) {
                alert("License must be 8+ characters with at least one uppercase letter!");
                return;
            }

            // Manual login (stores session only after validation)
            localStorage.setItem('doctorLoggedIn', 'true');
            localStorage.setItem('doctorEmail', email);
            window.location.href = 'doctor-dashboard.html';
        });
    }

    // ========== LOGOUT FUNCTIONALITY ========== //
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('doctorLoggedIn');
        localStorage.removeItem('doctorEmail');
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