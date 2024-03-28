"use strict"
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "MyBlog@astrominingoption.com",
    pass: "Test123.com",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function mailSender(mailTo, subject, message) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'MyBlog@astrominingoption.com', // sender address
    to: mailTo, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: message, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// mailSender().catch(console.error);

module.exports = mailSender
