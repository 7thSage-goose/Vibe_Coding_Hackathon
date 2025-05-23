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
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}