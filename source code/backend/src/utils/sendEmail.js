const nodemailer = require('nodemailer');
async function sendVerificationEmail(to, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'sudeshsawant162@gmail.com',
            pass: 'yqzgqucumuaqlzai' 
        }
    });

    const mailOptions = {
        from: 'your email',
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
