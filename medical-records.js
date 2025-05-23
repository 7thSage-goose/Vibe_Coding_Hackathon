document.addEventListener('DOMContentLoaded', function() {
    // View record details
    const viewButtons = document.querySelectorAll('.record-actions button:first-child');
    const recordsList = document.querySelector('.section:first-child');
    const recordViewer = document.getElementById('record-viewer');
    const backToRecordsBtn = document.getElementById('back-to-records');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            recordsList.style.display = 'none';
            recordViewer.style.display = 'block';
            
            // In a real app, you would fetch the record data here
            const recordTitle = this.closest('.record-card').querySelector('h3').textContent;
            document.getElementById('record-title').textContent = recordTitle;
        });
    });
    
    if (backToRecordsBtn) {
        backToRecordsBtn.addEventListener('click', function() {
            recordViewer.style.display = 'none';
            recordsList.style.display = 'block';
        });
    }
    
    // Upload record
    const uploadRecordBtn = document.getElementById('upload-record-btn');
    if (uploadRecordBtn) {
        uploadRecordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('In a complete implementation, this would open a file upload dialog.');
        });
    }
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}