// General site-wide JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add any other site-wide JavaScript here
    console.log('HealthTrack Pro initialized');
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}