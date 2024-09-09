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


// payment custom button nodification 

const sendcustomnodi = async (req,res) => {

    const {email, amount, name, academyname , role} = req.body  

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

        if(role === "Admin")
        {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);

        if(info)
        {
            res.status(200).json({msg : " Email send success "})
        }
        else
        {
            res.status(404).json({msg : " Email sending failed "})
        } 
    } 
    else{
        res.status(401).json({msg : "Unauthorized Access"})
    }
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }

}

module.exports = { sendMail, sendpaymentmail  , sendcustomnodi};