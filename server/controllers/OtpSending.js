const sendMail = require('./emailc');
const { storeOTP, verifyOTP } = require('./Otpc');


const sendotp = async (req, res) => {
    const { email } = req.body;
    try {
        const otp = await storeOTP(email);
        await sendMail(email, otp);
        res.status(200).send('OTP sent successfully');
    } catch (error) {
        res.status(500).json({ message: 'Error sending OTP', error });
    }
}


const verifyotp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const isValid = await verifyOTP(email, otp);
        if (isValid) {
            res.status(200).send('OTP verified');
        } else {
            res.status(400).send('Invalid or expired OTP');
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying OTP', error });
    }
}


module.exports = {
    sendotp, verifyotp
}; 