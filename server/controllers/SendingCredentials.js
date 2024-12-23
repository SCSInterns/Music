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



const sendcredentials = async (email, myusername, mypassword) => {
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: ' Your Credentials for music academy application ',
        text: ` Find your details here :  
              Username : ${myusername}
              Password : ${mypassword}
              `
    }

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

const sendcred = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        const response = await sendcredentials(email, username, password);
        res.status(200).send('Credentials sent successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
}

const sendautocred = async (email, username, password) => {
    try {
        const response = await sendcredentials(email, username, password);
        return response

    } catch (error) {
        console.log(error)
        return error
    }
}

module.exports = { sendcred, sendautocred }; 