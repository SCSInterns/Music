const Form = require('../models/Form')
const User = require('../models/User')
const Mail = require('../controllers/emailc')
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateRandomPin() {
    const pin = Math.floor(1000 + Math.random() * 9000);
    return pin;
}


const setusercredentials = async (req, res) => {

    try {
        const { academyname, email, role, studentname } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ msg: 'Unauthorized access' })
        }

        const settedpwd = await User.findOne({
            academyname: academyname,
            email: email,
            username: studentname
        })

        if (settedpwd) {
            return res.status(409).json({ msg: "Password already exist " })
        }

        const user = await Form.findOne({ academy_name: academyname, "additionalFields.formdata.Email": email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const formData = user.additionalFields.get('formdata');
        const foundStudentName = formData.Name;
        const foundStatus = user.status;

        const password = generateRandomPin().toString()

        if (foundStudentName !== studentname) {
            return res.status(400).json({ message: 'Student name does not match' });
        }


        if (foundStatus === 'To be updated') {
            return res.status(200).json({ message: 'Form is valid and status is pending update', user });
        } else if (foundStatus === 'Reject') {
            return res.status(200).json({ message: 'Status is rejected ', user });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(password, salt);

        const newuser = new User({
            academyname: academyname,
            email: email,
            username: studentname,
            password: hashedpwd
        })

        await newuser.save()
        const mail = await Mail.welcome(email, studentname, academyname, password, role)

        if (mail) {
            res.status(200).json({ msg: "Credentials setted and shared success ", newuser })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server not supported', error });
    }
}

// forget password api 


const forgetpass = async (req, res) => {

    try {

        const { academyname, email, role, studentname } = req.body

        if (role !== "Admin") {
            return res.status(401).json({ msg: 'Unauthorized access' })
        }


        const settedpwd = await User.findOne({
            academyname: academyname,
            email: email,
            username: studentname
        })

        if (!settedpwd) {
            res.status(404).json({ msg: "No password is setted " })
        }

        const newpassword = generateRandomPin().toString();
        const salt = await bcrypt.genSalt(10);
        const hashedpwd = await bcrypt.hash(newpassword, salt);
        settedpwd.password = hashedpwd

        const newcred = await settedpwd.save()
        const mail = await Mail.welcome(email, studentname, academyname, newpassword, role)
        if (mail) {
            res.status(200).json({ msg: "Credentials resetted successfully  ", newcred })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server not supported', error });
    }
}


// login of user 

const loginuser = async (req, res) => {

    try {

        const { email, password, academyname } = req.body

        const user = await User.findOne({
            email: email, academyname: academyname
        })

        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {

                const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '1h' });
                const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_KEY);
                const newToken = new Token({ token: refreshtoken });
                await newToken.save();
                return res.status(200).json({ accesstoken, user, refreshtoken });
            }
            else {
                return res.status(400).json({ msg: "Invalid Credentials " })
            }
        }
        else {
            res.status(404).json({ msg: "User not found " })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server not supported', error });
    }
}

module.exports = { setusercredentials, forgetpass, loginuser }