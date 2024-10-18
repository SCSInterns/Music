const Userlogin = require('../models/User')
const Form = require('../models/Form')
const User = require('../models/User')


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

        console.log(user)
        const formData = user.additionalFields.get('formdata');
        console.log(formData)
        const foundStudentName = formData.Name;
        const foundStatus = user.status;

        const password = generateRandomPin()

        if (foundStudentName !== studentname) {
            return res.status(400).json({ message: 'Student name does not match' });
        }


        if (foundStatus === 'To be updated') {
            return res.status(200).json({ message: 'Form is valid and status is pending update', user });
        } else if (foundStatus === 'Reject') {
            return res.status(200).json({ message: 'Status is rejected ', user });
        }
        const newuser = new User({
            academyname: academyname,
            email: email,
            username: studentname,
            password: password
        })

        await newuser.save()

        res.status(200).json({ msg: "Credentials setted success ", newuser })


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server not supported', error });
    }
}

module.exports = { setusercredentials }