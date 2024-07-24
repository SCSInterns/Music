const SuperAdmin = require('../models/Superadmin');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Academy = require('../models/Admin')
const AcademyDetails = require('../models/MusicAcademy')

// SuperAdmin Signup Controller
const superadmin_signup = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const existingUser = await SuperAdmin.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'Email is already registered' });
        }
        const salt = await bcrypt.genSalt();
        const hashedpwd = await bcrypt.hash(password, salt);
        const newUser = new SuperAdmin({ name, password: hashedpwd, email });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
};

// SuperAdmin Login Controller
const superadmin_login = async (req, res) => {
    const { email, password } = req.body;
    const user = await SuperAdmin.findOne({ email });

    if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) {
            const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '4h' });
            const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_KEY);
            const newToken = new Token({ token: refreshtoken });
            await newToken.save();
            return res.status(200).json({ accesstoken, name: user.name, refreshtoken });
        } else {
            res.status(404).json({ message: "Invalid Credentials" });
        }
    } else {
        return res.status(404).json({ message: "User Not Found" });
    }
};

// get the info of super admin 

const getsuperinfo = async (req, res) => {
    try {
        const { name } = req.body;
        const response = await SuperAdmin.find({ name: name })

        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({ msg: " User not found " })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


// get all academy details 

const getallacademydetails = async (req, res) => {
    try {

        const { email } = req.body;

        const validuser = await SuperAdmin.findOne({ email: email })
        if (validuser) {
            const response = await AcademyDetails.find({});

            if (response) {
                res.status(200).json(response)
            } else {
                res.status(404).json({ msg: 'Details not available' })
            }
        }
        else {
            res.status(400).json({ msg: ' Invalid Request ' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

// superadmin access control for academy  

const academy_access = async (req, res) => {
    try {
        const { status } = req.body;
        const academyexists = await Academy.findById(req.params.id);

        if (!academyexists) {
            res.status(404).json({ msg: 'Academy doesnt exist ' })
        }

        const updatedApplication = await Academy.findByIdAndUpdate(
            req.params.id,
            { $set: { academy_access: status } },
            { new: true }
        );
        console.log("Updated application:", updatedApplication);

        if (!updatedApplication) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        return res.status(200).json({ msg: "Status updated successfully", updatedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }

}


// credentials setup by superadmin 

const credsetup = async (req, res) => {
    try {
        const { username, password } = req.body

        const finddetails = await Academy.findById(req.params.id);


        if (!finddetails) {
            res.status(404).json({ msg: 'Academy doesnt exist ' })
        }

        const updatedApplication = await Academy.findByIdAndUpdate(
            req.params.id,
            { $set: { academy_username: username, academy_password: password } },
            { new: true }
        );
        console.log("Updated application:", updatedApplication);

        if (!updatedApplication) {
            return res.status(404).json({ msg: 'Application not found' });
        }

        return res.status(200).json({ msg: "Status updated successfully", updatedApplication });
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

module.exports = {
    superadmin_login,
    superadmin_signup,
    academy_access,
    getallacademydetails,
    getsuperinfo,
    credsetup
};