const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST,
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, html, text? }
 */
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from:    process.env.EMAIL_FROM || 'MHD Store <noreply@mhdstore.com>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  if (process.env.NODE_ENV === 'development') {
    console.log(`📧 [Email] To: ${to} | Subject: ${subject}`);
    return;   // skip actual sending in dev
  }

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
