document.addEventListener('DOMContentLoaded', function() {
    // Toggle new appointment form
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const appointmentForm = document.getElementById('appointment-form');
    const cancelAppointmentBtn = document.getElementById('cancel-appointment-btn');
    
    if (newAppointmentBtn && appointmentForm) {
        newAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            appointmentForm.style.display = appointmentForm.style.display === 'none' ? 'block' : 'none';
        });
    }
    
    // Handle cancel button in the form
    if (cancelAppointmentBtn && appointmentForm) {
        cancelAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            appointmentForm.reset();
            appointmentForm.style.display = 'none';
            showToast('Appointment creation cancelled', 'info');
        });
    }
    
    // Toggle between list and calendar view
    const viewOptions = document.querySelectorAll('.view-options button');
    const appointmentsList = document.getElementById('appointments-list');
    const appointmentsCalendar = document.getElementById('appointments-calendar');
    
    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            viewOptions.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.view === 'list') {
                appointmentsList.style.display = 'block';
                appointmentsCalendar.style.display = 'none';
            } else {
                appointmentsList.style.display = 'none';
                appointmentsCalendar.style.display = 'block';
                generateCalendar();
            }
        });
    });
    
    // Generate calendar view
    function generateCalendar() {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Get current month and year
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();

        // Update month display
        const monthDisplay = document.getElementById('current-month');
        if (monthDisplay) {
            monthDisplay.textContent = new Intl.DateTimeFormat('en-US', { 
                month: 'long', 
                year: 'numeric' 
            }).format(date);
        }

        // Generate calendar days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            calendarGrid.appendChild(emptyCell);
        }

        // Get appointments from localStorage
        const allAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
        console.log('Calendar view: Found', allAppointments.length, 'appointments');

        // Add cells for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.innerHTML = `<span class="day-number">${day}</span>`;

            // Add appointments for this day
            const dayAppointments = allAppointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getDate() === day && 
                       aptDate.getMonth() === month &&
                       aptDate.getFullYear() === year;
            });

            dayAppointments.forEach(apt => {
                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = 'calendar-event';
                appointmentDiv.textContent = `${apt.time} - ${apt.patientName}`;
                appointmentDiv.title = apt.purpose;
                dayCell.appendChild(appointmentDiv);
            });

            // Highlight today
            if (day === date.getDate() && month === date.getMonth()) {
                dayCell.classList.add('today');
            }

            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Initialize ReminderSystem
    const reminderSystem = new ReminderSystem();

    // Load existing appointments - make it globally accessible
    window.loadAppointments = function() {
        console.log('Loading appointments...');
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        console.log('Found appointments in localStorage:', appointments);
        
        const tbody = document.querySelector('#appointments-list table tbody');
        
        if (tbody) {
            console.log('Found tbody element, updating list view');
            tbody.innerHTML = ''; // Clear existing appointments
            
            if (appointments.length === 0) {
                console.log('No appointments found, displaying empty message');
                tbody.innerHTML = `
                    <tr>
                        <td colspan="5" style="text-align: center;">No appointments scheduled</td>
                    </tr>`;
                return;
            }

            console.log('Sorting appointments by date and time');
            // Sort appointments by date and time
            appointments.sort((a, b) => {
                try {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA - dateB;
                } catch (error) {
                    console.error('Error sorting appointments:', error);
                    return 0;
                }
            });

            console.log('Creating rows for each appointment');
            appointments.forEach(apt => {
                try {
                    const row = document.createElement('tr');
                    console.log('Creating row for appointment:', apt);
                    
                    // Use ISO format for more reliable date parsing
                    const appointmentDate = new Date(`${apt.date}T${apt.time}`);
                    
                    // Format date nicely
                    const formattedDate = new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                    }).format(appointmentDate);

                    // Determine status
                    let status = 'Scheduled';
                    let statusClass = 'primary';
                    if (apt.reminderSent) {
                        status = 'Reminded';
                        statusClass = 'success';
                    }

                    row.innerHTML = `
                        <td>${apt.patientName}</td>
                        <td>${formattedDate}</td>
                        <td>${apt.purpose}</td>
                        <td><span class="badge badge-${statusClass}">${status}</span></td>
                        <td>
                            <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="details">Details</button>
                            <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="cancel">Cancel</button>
                            <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="sms" title="Send SMS">
                                <i class="fas fa-sms"></i> SMS
                            </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                } catch (error) {
                    console.error('Error creating appointment row:', error, apt);
                }
            });
        }

        // Also update calendar view if it exists
        updateCalendarView(appointments);
    }

    function updateCalendarView(appointments) {
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) return;

        // Clear existing calendar
        calendarGrid.innerHTML = '';

        // Add day headers
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        days.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            calendarGrid.appendChild(dayHeader);
        });

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Update month display
        const monthDisplay = document.getElementById('current-month');
        if (monthDisplay) {
            monthDisplay.textContent = new Intl.DateTimeFormat('en-US', { 
                month: 'long', 
                year: 'numeric' 
            }).format(now);
        }

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell empty';
            calendarGrid.appendChild(emptyCell);
        }

        // Add cells for each day
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            if (day === now.getDate()) dayCell.classList.add('today');

            dayCell.innerHTML = `<span class="day-number">${day}</span>`;

            // Add appointments for this day
            const dayAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getDate() === day && 
                       aptDate.getMonth() === currentMonth &&
                       aptDate.getFullYear() === currentYear;
            });

            dayAppointments.forEach(apt => {
                const appointmentDiv = document.createElement('div');
                appointmentDiv.className = 'calendar-event';
                appointmentDiv.textContent = `${apt.time} - ${apt.patientName}`;
                appointmentDiv.title = apt.purpose;
                appointmentDiv.onclick = () => viewDetails(apt.id);
                dayCell.appendChild(appointmentDiv);
            });

            calendarGrid.appendChild(dayCell);
        }
    }

    // Handle form submission
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const appointment = {
                id: Date.now().toString(),
                patientName: document.getElementById('patientName').value,
                patientPhone: document.getElementById('patientPhone').value,
                date: document.getElementById('appointmentDate').value,
                time: document.getElementById('appointmentTime').value,
                purpose: document.getElementById('purpose').value,
                enableReminder: document.getElementById('enableReminder').checked,
                reminderSent: false,
                created: new Date().toISOString()
            };

            try {
                // Save appointment
                const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
                appointments.push(appointment);
                
                // Explicitly stringify and save to localStorage
                const appointmentsJSON = JSON.stringify(appointments);
                localStorage.setItem('appointments', appointmentsJSON);
                
                console.log('Appointment saved:', appointment);
                console.log('All appointments JSON:', appointmentsJSON);
                console.log('Appointment count:', appointments.length);

                // Schedule reminder check
                if (appointment.enableReminder) {
                    await reminderSystem.scheduleReminder(appointment);
                }

                // Force a small delay to ensure localStorage is updated
                setTimeout(() => {
                    // Refresh display
                    if (typeof window.loadAppointments === 'function') {
                        window.loadAppointments(); // Use window.loadAppointments to ensure it's globally accessible
                    } else {
                        console.error('loadAppointments function not found, reloading page');
                        location.reload(); // Fallback: reload the page
                    }
                    
                    // Force update both views
                    updateCalendarView(appointments);
                    
                    // Log to verify appointments are loaded
                    console.log('Appointments loaded after scheduling');
                    
                    // Verify appointments in localStorage after saving
                    const savedAppointments = JSON.parse(localStorage.getItem('appointments')) || [];
                    console.log('Verified appointments in localStorage:', savedAppointments);
                    console.log('Verified appointment count:', savedAppointments.length);
                }, 100);
            } catch (error) {
                console.error('Error saving appointment:', error);
                showToast('Error saving appointment. Please try again.', 'error');
            }
            
            // Reset form
            this.reset();
            this.style.display = 'none';
            
            // Show success toast instead of alert
            showToast('Appointment scheduled successfully!', 'success');
        });
    }

    // Appointment filtering
    const searchInput = document.getElementById('appointment-search');
    const statusFilter = document.getElementById('status-filter');
    const todayFilter = document.getElementById('today-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterAppointments);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterAppointments);
    }
    
    if (todayFilter) {
        todayFilter.addEventListener('click', function() {
            // Set status filter to "all"
            if (statusFilter) statusFilter.value = 'all';
            
            // Clear search input
            if (searchInput) searchInput.value = '';
            
            // Filter to show only today's appointments
            filterAppointmentsByDate(new Date());
            
            showToast('Showing today\'s appointments', 'info');
        });
    }
    
    function filterAppointments() {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const tbody = document.querySelector('#appointments-list table tbody');
        if (!tbody) return;
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusValue = statusFilter ? statusFilter.value : 'all';
        
        // Clear existing appointments
        tbody.innerHTML = '';
        
        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No appointments scheduled</td>
                </tr>`;
            return;
        }
        
        // Filter appointments
        let filteredAppointments = appointments.filter(apt => {
            // Filter by search term
            const matchesSearch = searchTerm === '' || 
                apt.patientName.toLowerCase().includes(searchTerm) ||
                apt.purpose.toLowerCase().includes(searchTerm);
            
            // Filter by status
            const matchesStatus = statusValue === 'all' || 
                (statusValue === 'reminded' && apt.reminderSent) ||
                (statusValue === 'scheduled' && !apt.reminderSent);
            
            return matchesSearch && matchesStatus;
        });
        
        // Sort appointments by date and time
        filteredAppointments.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
        });
        
        if (filteredAppointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No appointments match your filters</td>
                </tr>`;
            return;
        }
        
        // Display filtered appointments
        filteredAppointments.forEach(apt => {
            const row = document.createElement('tr');
            const appointmentDate = new Date(`${apt.date} ${apt.time}`);
            
            // Format date nicely
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(appointmentDate);

            // Determine status
            let status = 'Scheduled';
            let statusClass = 'primary';
            if (apt.reminderSent) {
                status = 'Reminded';
                statusClass = 'success';
            }

            row.innerHTML = `
                <td>${apt.patientName}</td>
                <td>${formattedDate}</td>
                <td>${apt.purpose}</td>
                <td><span class="badge badge-${statusClass}">${status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="details">Details</button>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="cancel">Cancel</button>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="sms" title="Send SMS">
                        <i class="fas fa-sms"></i> SMS
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    function filterAppointmentsByDate(date) {
        const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
        const tbody = document.querySelector('#appointments-list table tbody');
        if (!tbody) return;
        
        // Clear existing appointments
        tbody.innerHTML = '';
        
        if (appointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No appointments scheduled</td>
                </tr>`;
            return;
        }
        
        // Filter appointments for the specified date
        const targetDate = new Date(date);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth();
        const day = targetDate.getDate();
        
        let filteredAppointments = appointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate.getFullYear() === year && 
                   aptDate.getMonth() === month && 
                   aptDate.getDate() === day;
        });
        
        // Sort appointments by time
        filteredAppointments.sort((a, b) => {
            const timeA = a.time;
            const timeB = b.time;
            return timeA.localeCompare(timeB);
        });
        
        if (filteredAppointments.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No appointments for this date</td>
                </tr>`;
            return;
        }
        
        // Display filtered appointments
        filteredAppointments.forEach(apt => {
            const row = document.createElement('tr');
            const appointmentDate = new Date(`${apt.date} ${apt.time}`);
            
            // Format date nicely
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            }).format(appointmentDate);

            // Determine status
            let status = 'Scheduled';
            let statusClass = 'primary';
            if (apt.reminderSent) {
                status = 'Reminded';
                statusClass = 'success';
            }

            row.innerHTML = `
                <td>${apt.patientName}</td>
                <td>${formattedDate}</td>
                <td>${apt.purpose}</td>
                <td><span class="badge badge-${statusClass}">${status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="details">Details</button>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="cancel">Cancel</button>
                    <button class="btn btn-outline btn-sm" data-id="${apt.id}" data-action="sms" title="Send SMS">
                        <i class="fas fa-sms"></i> SMS
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Jump to Today button in calendar view
    const jumpToTodayBtn = document.getElementById('jump-to-today');
    if (jumpToTodayBtn) {
        jumpToTodayBtn.addEventListener('click', function() {
            // Update calendar to current month
            updateCalendarView(JSON.parse(localStorage.getItem('appointments')) || []);
            
            // Scroll to today's cell
            const todayCell = document.querySelector('.calendar-day-cell.today');
            if (todayCell) {
                todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                todayCell.style.animation = 'highlight 2s';
            }
            
            showToast('Jumped to today\'s date', 'info');
        });
    }
    
    // Start checking for reminders
    setInterval(() => checkForDueReminders(), 60000); // Check every minute
    checkForDueReminders(); // Initial check

    // Initialize form state
    if (appointmentForm) {
        appointmentForm.reset();
        appointmentForm.style.display = 'none';
    }
    
    // Use event delegation for appointment buttons
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a button or an icon inside a button
        let target = e.target;
        if (target.tagName === 'I' && target.parentElement.tagName === 'BUTTON') {
            target = target.parentElement; // If clicked on icon, use the parent button
        }
        
        if (target && target.matches('.btn-outline.btn-sm')) {
            const action = target.getAttribute('data-action');
            const appointmentId = target.getAttribute('data-id');
            
            if (action === 'details' && appointmentId) {
                window.viewDetails(appointmentId);
            } else if (action === 'cancel' && appointmentId) {
                window.cancelAppointment(appointmentId);
            } else if (action === 'sms' && appointmentId) {
                window.showSMSModal(appointmentId);
            }
        }
    });
    
    // SMS Modal functionality
    const smsModal = document.getElementById('sms-modal');
    const smsForm = document.getElementById('sms-form');
    const smsCloseBtn = document.getElementById('close-sms-modal');
    const smsCancelBtn = document.getElementById('cancel-sms');
    
    // Close modal when clicking the close button
    if (smsCloseBtn) {
        smsCloseBtn.addEventListener('click', function() {
            smsModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking the cancel button
    if (smsCancelBtn) {
        smsCancelBtn.addEventListener('click', function(e) {
            e.preventDefault();
            smsModal.style.display = 'none';
            showToast('SMS cancelled', 'info');
        });
    }
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target === smsModal) {
            smsModal.style.display = 'none';
        }
    });
    
    // Handle SMS form submission
    if (smsForm) {
        smsForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const phoneNumber = document.getElementById('sms-recipient').value;
            const message = document.getElementById('sms-message').value;
            const patientId = document.getElementById('sms-patient-id').value;
            
            if (!phoneNumber || !message) {
                showToast('Please fill in all fields', 'error');
                return;
            }
            
            try {
                const reminderSystem = new ReminderSystem();
                await reminderSystem.sendSMS(phoneNumber, message);
                
                smsModal.style.display = 'none';
                showToast('SMS sent successfully', 'success');
            } catch (error) {
                console.error('Error sending SMS:', error);
                showToast('Error sending SMS. Please try again.', 'error');
            }
        });
    }
    
    // Load appointments on page load
    loadAppointments();
    
    // Initialize calendar view if it's the active view
    if (document.querySelector('.view-options button[data-view="calendar"].active') && 
        document.getElementById('appointments-calendar').style.display !== 'none') {
        generateCalendar();
    }
    
    // Force a refresh after a short delay to ensure everything is loaded
    setTimeout(() => {
        loadAppointments();
    }, 500);
});

// Function to check for due reminders
async function checkForDueReminders() {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const now = new Date();

    for (const apt of appointments) {
        if (apt.enableReminder && !apt.reminderSent) {
            const appointmentTime = new Date(`${apt.date}T${apt.time}`);
            const twentyFourHoursBefore = new Date(appointmentTime - 24 * 60 * 60 * 1000);

            if (now >= twentyFourHoursBefore) {
                try {
                    const doctorName = localStorage.getItem('doctorName') || 'your doctor';
                    const formattedDate = new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'full'
                    }).format(appointmentTime);
                    const formattedTime = new Intl.DateTimeFormat('en-US', {
                        timeStyle: 'short'
                    }).format(appointmentTime);
                    
                    const message = `Reminder: You have an appointment with Dr. ${doctorName} tomorrow, ${formattedDate} at ${formattedTime}. Purpose: ${apt.purpose}`;
                    const reminderSystem = new ReminderSystem();
                    await reminderSystem.sendSMS(apt.patientPhone, message);

                    // Mark reminder as sent
                    apt.reminderSent = true;
                    localStorage.setItem('appointments', JSON.stringify(appointments));
                    
                    // Refresh display if in DOM context
                    if (typeof loadAppointments === 'function') {
                        loadAppointments();
                    } else {
                        // If called outside DOM context, just update localStorage
                        console.log('Reminder sent and marked in localStorage');
                    }
                } catch (error) {
                    console.error('Failed to send reminder:', error);
                }
            }
        }
    }
}

// Make functions globally accessible
window.viewDetails = function(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (appointment) {
        alert(`
            Patient: ${appointment.patientName}
            Phone: ${appointment.patientPhone}
            Date: ${appointment.date}
            Time: ${appointment.time}
            Purpose: ${appointment.purpose}
            Reminder Status: ${appointment.reminderSent ? 'Sent' : 'Pending'}
        `);
    } else {
        console.error('Appointment not found:', appointmentId);
        showToast('Appointment not found', 'error');
    }
};

// Function to cancel appointment - globally accessible
window.cancelAppointment = function(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
            const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
            console.log('Before cancellation:', appointments);
            
            const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
            console.log('After cancellation:', updatedAppointments);
            
            localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
            
            // Use window.loadAppointments to ensure it's globally accessible
            if (typeof window.loadAppointments === 'function') {
                window.loadAppointments();
            } else {
                console.error('loadAppointments function not found');
                // Fallback: reload the page
                location.reload();
            }
            
            showToast('Appointment cancelled successfully', 'info');
        } catch (error) {
            console.error('Error cancelling appointment:', error);
            showToast('Error cancelling appointment', 'error');
        }
    }
};

// Function to show SMS modal - globally accessible
window.showSMSModal = function(appointmentId) {
    const appointments = JSON.parse(localStorage.getItem('appointments')) || [];
    const appointment = appointments.find(apt => apt.id === appointmentId);
    
    if (!appointment) {
        console.error('Appointment not found for SMS:', appointmentId);
        showToast('Appointment not found', 'error');
        return;
    }
    
    const smsModal = document.getElementById('sms-modal');
    const smsRecipient = document.getElementById('sms-to');
    const smsMessage = document.getElementById('sms-message');
    const smsPatientId = document.getElementById('sms-patient-id');
    
    if (!smsModal || !smsRecipient || !smsMessage || !smsPatientId) {
        console.error('SMS modal elements not found');
        showToast('Could not open SMS form', 'error');
        return;
    }
    
    // Populate the form with patient information
    smsRecipient.value = appointment.patientPhone;
    smsPatientId.value = appointment.id;
    
    // Add patient name to modal header
    const modalHeader = document.querySelector('.modal-header h3');
    if (modalHeader) {
        modalHeader.textContent = `Send SMS to ${appointment.patientName}`;
    }
    
    // Clear any previous message
    smsMessage.value = '';
    
    // Show the modal
    smsModal.style.display = 'flex';
    
    // Focus on the message textarea
    setTimeout(() => smsMessage.focus(), 100);
};

// Toast notification function
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}