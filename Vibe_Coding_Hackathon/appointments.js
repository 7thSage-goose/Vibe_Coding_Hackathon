document.addEventListener('DOMContentLoaded', function() {
    // Toggle new appointment form
    const newAppointmentBtn = document.getElementById('new-appointment-btn');
    const appointmentForm = document.getElementById('appointment-form');
    
    if (newAppointmentBtn && appointmentForm) {
        newAppointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            appointmentForm.style.display = appointmentForm.style.display === 'none' ? 'block' : 'none';
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
        
        // Add calendar days
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day-cell';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day-cell';
            dayCell.textContent = day;
            
            // Highlight today
            if (day === date.getDate() && month === date.getMonth()) {
                dayCell.classList.add('today');
            }
            
            // Add sample events (in a real app, these would come from your data)
            if (day === 1 || day === 15 || day === 20) {
                const event = document.createElement('div');
                event.className = 'calendar-event';
                event.textContent = day === 1 ? '9:00 AM - Robert Wilson' : 
                                  day === 15 ? '11:30 AM - Sarah Johnson' : '3:00 PM - Michael Brown';
                dayCell.appendChild(event);
            }
            
            calendarGrid.appendChild(dayCell);
        }
    }
    
    // Handle form submission
    const appointmentForm = document.getElementById('appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Appointment scheduled successfully!');
            this.reset();
            this.style.display = 'none';
        });
    }
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}

// Sample appointments data
let appointments = [
  { id: 1, patient: "Robert Wilson", date: "2023-06-15", time: "09:00", purpose: "Checkup" },
  { id: 2, patient: "Sarah Johnson", date: "2023-06-16", time: "11:30", purpose: "Follow-up" }
];

// Add new appointment
function addAppointment(patient, date, time, purpose) {
  const newAppt = { id: Date.now(), patient, date, time, purpose };
  appointments.push(newAppt);
  renderAppointments();
}

const reminderSystem = new AppointmentReminder();

document.getElementById('appointment-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // ...existing appointment creation code...

    // Schedule reminders
    const appointmentId = /* newly created appointment ID */;
    reminderSystem.scheduleReminder(appointmentId, 'email', 24); // 24 hours before
    reminderSystem.scheduleReminder(appointmentId, 'sms', 2); // 2 hours before
});