const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config()

const pass = process.env.APP_PWD
const user = process.env.MAIL

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${user}`,
        pass: `${pass}`,
    },
});

const sendMail = async (email, otp) => {
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: 'Your OTP Code For Music Academy Application ',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }


};

const sendpaymentmail = async (email, amount, name, academyname) => {
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: 'Reminder for payment',
        text: ` Please pay your pending fees of music academy course . 

           Find your details here :- 
           Student Name - ${name} 
           Amount due - ₹ ${amount} 
           
           This is system generate mail , 
           Please ignore if you have already paid payment . 
           Have a nice day
           Thank you , 
           ${academyname} Music Academy 
        `
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }

}
module.exports = { sendMail, sendpaymentmail };