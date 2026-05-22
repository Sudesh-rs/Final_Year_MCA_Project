const nodemailer = require('nodemailer');

async function sendVerificationEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
