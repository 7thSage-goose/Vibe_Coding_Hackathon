document.addEventListener('DOMContentLoaded', function() {
    // Filter reminders
    const filterButtons = document.querySelectorAll('.filter-options button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would filter the reminders here
            console.log(`Showing ${this.textContent} reminders`);
        });
    });
    
    // Create new reminder
    const newReminderBtn = document.getElementById('new-reminder-btn');
    if (newReminderBtn) {
        newReminderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In a complete implementation, this would open a form to create a new reminder.');
        });
    }
    
    // Save reminder settings
    const reminderSettingsForm = document.getElementById('reminder-settings-form');
    if (reminderSettingsForm) {
        reminderSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Reminder settings saved successfully!');
        });
    }
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}