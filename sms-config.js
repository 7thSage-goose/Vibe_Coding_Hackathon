// Update sms-config.js with your Twilio credentials
class SMSConfig {
    constructor() {
        this.apiUrl = 'https://api.twilio.com/2010-04-01/Accounts/';
        this.accountSid = 'YOUR_ACCOUNT_SID'; // Replace with your Twilio Account SID
        this.authToken = 'YOUR_AUTH_TOKEN'; // Replace with your Twilio Auth Token
        this.messagingServiceSid = 'YOUR_MESSAGING_SERVICE_SID'; // Replace with your Messaging Service SID
    }

    getConfig() {
        return {
            apiUrl: this.apiUrl,
            accountSid: this.accountSid,
            authToken: this.authToken,
            messagingServiceSid: this.messagingServiceSid
        };
    }
}