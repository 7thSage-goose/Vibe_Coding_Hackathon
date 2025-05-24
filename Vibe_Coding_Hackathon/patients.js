document.addEventListener('DOMContentLoaded', function() {
    // Toggle patient details view
    const viewButtons = document.querySelectorAll('table button:first-child');
    const patientList = document.querySelector('.section:first-child');
    const patientDetails = document.getElementById('patient-details');
    const backToListBtn = document.getElementById('back-to-list');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            patientList.style.display = 'none';
            patientDetails.style.display = 'block';
            
            // In a real app, you would fetch the patient data here
            const patientName = this.closest('tr').querySelector('td:nth-child(2)').textContent;
            document.getElementById('patient-details-name').textContent = `${patientName}'s Details`;
        });
    });
    
    if (backToListBtn) {
        backToListBtn.addEventListener('click', function() {
            patientDetails.style.display = 'none';
            patientList.style.display = 'block';
        });
    }
    
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
    
    // Add new patient
    const addPatientBtn = document.getElementById('add-patient-btn');
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In a complete implementation, this would open a form to add a new patient.');
        });
    }
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}