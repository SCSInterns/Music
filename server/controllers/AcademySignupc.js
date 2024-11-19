const Admin = require('../models/Admin');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MusicAcademy = require('../models/MusicAcademy')

// Academy Signup Controller
const academy_signup = async (req, res) => {
    try {
        const { academy_name, academy_email } = req.body;

        // Check if the academy is already registered
        const existingUser = await Admin.findOne({ academy_email });
        if (existingUser) {
            return res.status(409).json({ error: 'Academy is already registered' });
        }

        // Prevent conflict with existing academy names
        let resolvedAcademyName = academy_name;
        const existingNameConflict = await preventconflict(academy_name);

        if (existingNameConflict) {
            let isConflict = true;

            while (isConflict) {
                const randomSuffix = generateRandomThreeDigitNumber();
                resolvedAcademyName = `${academy_name}${randomSuffix}`;
                isConflict = await preventconflict(resolvedAcademyName);
            }
        }

        // Fetch basic details from MusicAcademy after resolving name conflict
        const basicDetails = await MusicAcademy.findOne({ academy_name: resolvedAcademyName });

        let id = ""
        if (basicDetails) {
            id = basicDetails._id
        } else {
            id = "";
        }

        // Create a new admin entry
        const newUser = new Admin({
            academy_name: resolvedAcademyName,
            academy_email,
            academy_id: id
        });

        const user = await newUser.save();
        res.status(200).json(user);

    } catch (error) {
        console.error('Error in academy_signup:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Academy Login Controller
const academy_login = async (req, res) => {
    const { academy_email, academy_password, academy_username } = req.body;
    const user = await Admin.findOne({ academy_email });

    if (user) {
        const validPassword = await bcrypt.compare(academy_password, user.academy_password);
        if (validPassword && (academy_username === user.academy_username) && (user.academy_access === "Accept")) {
            const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '16h' });
            const refreshtoken = jwt.sign(user.toJSON(), process.env.REFRESH_KEY);
            const newToken = new Token({ token: refreshtoken });
            await newToken.save();
            return res.status(200).json({ accesstoken, academyname: user.academy_name, refreshtoken });
        } else {
            res.status(404).json({ message: "Invalid Credentials" });
        }
    } else {
        return res.status(404).json({ message: "User Not Found" });
    }
};

// get details of the academy by name 

const academybyname = async (req, res) => {
    const { academy_name } = req.body;
    const response = await Admin.find({ academy_name: academy_name });

    if (response) {
        res.status(200).json(response);
    }
    else {
        res.status(404).json({ msg: 'No user found ' })
    }

}



// random 3 digit genearator  

function generateRandomThreeDigitNumber() {
    return Math.floor(Math.random() * 900) + 100;
}

// function to check the academy name exists for conflict prevent 

const preventconflict = async (academyname) => {
    const existingacademy = await Admin.findOne({ academy_name: academyname })
    if (existingacademy) {
        return true
    } else {
        return false
    }

}

module.exports = {
    academy_login,
    academy_signup,
    academybyname
};