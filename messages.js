document.addEventListener('DOMContentLoaded', function() {
    // Switch conversations
    const conversations = document.querySelectorAll('.conversation');
    
    conversations.forEach(conversation => {
        conversation.addEventListener('click', function() {
            conversations.forEach(conv => conv.classList.remove('active'));
            this.classList.add('active');
            
            // In a real app, you would load the conversation messages here
            const patientName = this.querySelector('h3').textContent;
            document.querySelector('.message-recipient h3').textContent = patientName;
        });
    });
    
    // Send message
    const messageForm = document.querySelector('.message-compose');
    if (messageForm) {
        const textarea = messageForm.querySelector('textarea');
        const sendBtn = messageForm.querySelector('.btn:last-child');
        
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (textarea.value.trim() === '') return;
            
            // In a real app, you would send the message to the server here
            const messageHistory = document.querySelector('.message-history');
            const newMessage = document.createElement('div');
            newMessage.className = 'message sent';
            newMessage.innerHTML = `
                <div class="message-content">
                    <p>${textarea.value}</p>
                    <span class="message-time">Just now</span>
                </div>
            `;
            messageHistory.appendChild(newMessage);
            textarea.value = '';
            
            // Scroll to bottom
            messageHistory.scrollTop = messageHistory.scrollHeight;
        });
    }
});

// Check if user is logged in
if (!localStorage.getItem('doctorLoggedIn')) {
    window.location.href = 'index.html';
    return;
}

// Sample messages data
let messages = {
  "Robert Wilson": [
    { sender: "patient", text: "Hi Doctor, is my appointment confirmed?", time: "10:30 AM" },
    { sender: "doctor", text: "Yes, see you tomorrow!", time: "10:35 AM" }
  ]
};

// Send new message
function sendMessage(patient, message) {
  if (!messages[patient]) messages[patient] = [];
  messages[patient].push({
    sender: "doctor",
    text: message,
    time: new Date().toLocaleTimeString()
  });
  renderMessages();
}