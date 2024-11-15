const nodemailer = require('nodemailer');

// Configuration de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Fonction pour envoyer un email de contact
const sendContactEmail = async (name, email, message) => {
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,  // L'email qui reçoit les messages
    subject: `Nouveau message de ${name}`,
    text: `Nom: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendContactEmail };
