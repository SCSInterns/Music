const Admin  = require('../models/Admin');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const MusicAcademy = require('../models/MusicAcademy')

// Academy Signup Controller
const academy_signup = async (req, res) => {
    try {
        const {academy_name, academy_email } = req.body;
        const existingUser = await Admin.findOne({ academy_email });
        if (existingUser) {
          return res.status(409).json({ error: 'Academy is already registered' });
        }
        const id = MusicAcademy._id
        const newUser = new Admin({ academy_name, academy_email , academy_id: id });
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
};

// Academy Login Controller
const academy_login = async (req, res) => {
    const {   academy_email, academy_password , academy_username} = req.body;
    const user = await Admin.findOne({ academy_email });

    if (user) {
        const validPassword = await bcrypt.compare(academy_password,user.academy_password);
        if (validPassword && (academy_username===user.academy_username) && (user.academy_access==="Accept")) {
            const accesstoken = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: '4h' });
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

const academybyname = async(req,res) => 
{
    const { academy_name } = req.body ; 
    const response = await Admin.find({ academy_name : academy_name}) ; 

    if(response) 
    {
        res.status(200).json(response) ; 
    }
    else
    {
        res.status(404).json({msg : 'No user found '})
    }

}

module.exports = {
   academy_login , 
   academy_signup ,
   academybyname
};