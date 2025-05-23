// Dashboard specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!localStorage.getItem('doctorLoggedIn')) {
        window.location.href = 'index.html';
        return;
    }
    
    // Set the doctor's name in the header
    const doctorEmail = localStorage.getItem('doctorEmail');
    if (doctorEmail) {
        const doctorName = doctorEmail.split('@')[0];
        const welcomeHeader = document.querySelector('.header h1');
        if (welcomeHeader) {
            welcomeHeader.textContent = `Welcome Back, Dr. ${doctorName.charAt(0).toUpperCase() + doctorName.slice(1)}`;
        }
    }
    
    // Add animation to patient cards
    const patientCards = document.querySelectorAll('.patient-card');
    patientCards.forEach((card, index) => {
        card.style.animationDelay = `${0.3 + (index * 0.1)}s`;
        card.classList.add('fade-in');
    });
    
    // Handle logout
    const logoutBtn = document.querySelector('.sidebar-menu a[href="#"]:last-child');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('doctorLoggedIn');
            localStorage.removeItem('doctorEmail');
            window.location.href = 'index.html';
        });
    }
    
    // Simulate loading data
    setTimeout(() => {
        // You would typically fetch appointment data here
        console.log('Dashboard data loaded');
    }, 1000);
    
    // Add click handlers for action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.getAttribute('title');
            const patientName = this.closest('.patient-card').querySelector('h3').textContent;
            console.log(`${action} for ${patientName}`);
            
            // In a real app, this would trigger the appropriate action
            if (action === 'Send Reminder') {
                alert(`Reminder sent to ${patientName}`);
            }
        });
    });
});

