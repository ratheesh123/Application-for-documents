const { sendEmail } = require('./emailService'); // Adjust the path as needed

async function sendTestEmail() {
    try {
        await sendEmail({
            to: 'recipient@example.com',
            subject: 'Test Email from Nodemailer',
            text: 'This is a test email sent using Nodemailer.',
            html: '<strong>This is a test email sent using Nodemailer.</strong>',
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Failed to send test email", error);
    }
}

sendTestEmail();
