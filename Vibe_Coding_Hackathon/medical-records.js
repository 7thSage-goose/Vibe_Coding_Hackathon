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

class MedicalRecordSearch {
    async searchRecords(query) {
        const searchParams = {
            patientName: query.name,
            dateRange: query.dates,
            recordType: query.type
        };
        // ...implement search functionality
    }
}

const recordSearch = new MedicalRecordSearch();

document.getElementById('records-search-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = {
        name: document.getElementById('patient-name').value,
        dates: {
            from: document.getElementById('date-from').value,
            to: document.getElementById('date-to').value
        },
        type: document.getElementById('record-type').value
    };

    const results = await recordSearch.searchRecords(query);
    displaySearchResults(results);
});

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = results.map(record => `
        <div class="record-card">
            <h3>${record.patientName}</h3>
            <p>Date: ${record.date}</p>
            <p>Type: ${record.type}</p>
            <button onclick="viewRecord('${record.id}')">View Details</button>
        </div>
    `).join('');
}