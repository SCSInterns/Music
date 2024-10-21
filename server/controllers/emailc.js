const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
const Logo = require("../models/Logo")
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


// payment custom button nodification 

const sendcustomnodi = async (req, res) => {

    const { email, amount, name, academyname, role } = req.body

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

        if (role === "Admin") {
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);

            if (info) {
                res.status(200).json({ msg: " Email send success " })
            }
            else {
                res.status(404).json({ msg: " Email sending failed " })
            }
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }

}


// email for pin and welcoming new user 

const welcome = async (email, username, academyname, password, role) => {

    const academylogo = await Logo.findOne({ academyname: academyname })
    const logolink = await academylogo.link

    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: `Welcome to ${academyname} Music Academy`,
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
                <img src=${logolink} alt="Academy Logo" width="150"/>
            </div>
            <h2 style="text-align: center; color: #004b87;">Welcome to ${academyname}!</h2>
            <p>Hello ${username},</p>
            <p>We are excited to welcome you to our academy. Below are your login credentials:</p>
            
            <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Username:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${username}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Password:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${password}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;"><strong>Academy Name:</strong></td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${academyname}</td>
                </tr>
            </table>
            
            <p style="text-align: center; margin-top: 20px;">
                <a href=${`http://localhost:3000/${academyname}/login`} style="display: inline-block; padding: 10px 20px; background-color: #004b87; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
            </p>
            
            <p>If you have any questions, feel free to reach out to us. We're here to help you succeed!</p>
            
            <div style="text-align: center; margin-top: 30px;">
                <img src="https://img.freepik.com/premium-vector/banner-speech-bubble-thank-you_136321-98.jpg?w=1000&h=200" alt="Ending Pic" width="150"/>
            </div>

            <p style="text-align: center; color: #aaa; margin-top: 20px;">&copy; ${academyname}, All rights reserved.</p>
        </div>
        `
    };

    try {

        if (role === "Admin") {
            let info = await transporter.sendMail(mailOptions);
            return info;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = { sendMail, sendpaymentmail, sendcustomnodi, welcome };