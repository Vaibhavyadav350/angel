const nodemailer = require('nodemailer');

// Create transporter ONCE at module load — reuses the TCP connection across all emails
const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com.au',
    port: 465,
    secure: true,
    auth: {
        user: process.env.ZOHO_EMAIL_USER,
        pass: process.env.ZOHO_EMAIL_PASS,
    },
});

const sendEmail = async (options) => {
    const mailOptions = {
        from: process.env.ZOHO_EMAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.info(`[EMAIL SENT] To: ${options.email} | Subject: "${options.subject}"`);
    } catch (error) {
        console.error(`[EMAIL FAILED] To: ${options.email} | Subject: "${options.subject}" | Error: ${error.message}`);
        throw error;
    }
};

module.exports = sendEmail;
