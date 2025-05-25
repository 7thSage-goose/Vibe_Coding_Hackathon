class ReminderSystem {
    constructor() {
        this.smsConfig = new SMSConfig().getConfig();
        this.checkInterval = 60000; // Check every minute
        this.startReminderCheck();
    }

    async sendSMS(phoneNumber, message) {
        try {
            const url = `${this.smsConfig.apiUrl}${this.smsConfig.accountSid}/Messages.json`;
            const auth = btoa(`${this.smsConfig.accountSid}:${this.smsConfig.authToken}`);

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    To: phoneNumber,
                    MessagingServiceSid: this.smsConfig.messagingServiceSid,
                    Body: message
                })
            });

            if (!response.ok) {
                throw new Error(`SMS sending failed: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('SMS sent successfully:', result.sid);
            return result;

        } catch (error) {
            console.error('SMS sending error:', error);
            this.logError({
                type: 'SMS_SEND_ERROR',
                phoneNumber,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    logError(error) {
        const errors = JSON.parse(localStorage.getItem('smsErrors')) || [];
        errors.push(error);
        localStorage.setItem('smsErrors', JSON.stringify(errors));
    }

    async checkReminders() {
        const reminders = this.getReminders();
        const now = new Date();

        for (const reminder of reminders) {
            if (!reminder.sent && new Date(reminder.scheduledTime) <= now) {
                try {
                    // Format messages
                    const patientMessage = `Reminder: Your appointment with Dr. ${reminder.doctorName} is tomorrow at ${reminder.appointmentTime}. Please reply Y to confirm or N to reschedule.`;
                    const doctorMessage = `Reminder: Appointment with patient ${reminder.patientName} tomorrow at ${reminder.appointmentTime}.`;

                    // Send reminders with error handling
                    await Promise.all([
                        this.sendSMSWithRetry(reminder.patientPhone, patientMessage, 3),
                        this.sendSMSWithRetry(reminder.doctorPhone, doctorMessage, 3)
                    ]);

                    this.markReminderSent(reminder.appointmentId);

                } catch (error) {
                    console.error('Failed to process reminder:', error);
                    this.logError({
                        type: 'REMINDER_PROCESSING_ERROR',
                        reminderId: reminder.appointmentId,
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
    }

    async sendSMSWithRetry(phoneNumber, message, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await this.sendSMS(phoneNumber, message);
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }

    // ... existing reminder management methods ...
}