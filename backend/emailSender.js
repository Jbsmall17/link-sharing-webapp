const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs')
require("dotenv").config()

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    auth: {
        user: process.env.email, 
        pass: process.env.password 
    },
    tls: {
        rejectUnauthorized: false
      },
      debug: true
});

const sendWelcomeEmail = (recipientEmail) => {
    const templatePath = path.join(__dirname, 'views', 'welcome.ejs');

    fs.readFile(templatePath, 'utf8', (err, template) => {
        if (err) {
            return console.log('Error reading template:', err);
        }

        const htmlContent = ejs.render(template);

        const mailOptions = {
            from: process.env.email,
            to: recipientEmail,
            subject: 'Welcome to Devlinks!',
            html: htmlContent
        };

        // Directly send email without verify
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error occurred:', error.message);
            } else {
                console.log('Message sent:', info.messageId);
            }
        });
    });
};

module.exports = {sendWelcomeEmail}