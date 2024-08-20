const MusicAcademy = require('../models/MusicAcademy');
const Admin = require('../models/Admin')
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// academy details fillup 

const academy_details = async (req, res) => {
    try {
        const newacademy = await new MusicAcademy(req.body)
        const response = await newacademy.save();
        if (response) {
            res.status(200).json(response)
        }
        else {
            res.status(404).json({ msg: " error saving details " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


// put api for academy details - personal details upadtion 

const personaldetailsupdation = async (req, res) => {
    try {
        const { name, address, contactno } = req.body;

        const response = await MusicAcademy.findById(req.params.id);

        if (response) {

            const updatedApplication = await MusicAcademy.findByIdAndUpdate(
                req.params.id,
                { $set: { name: name, address: address, contactno: contactno } },
                { new: true }
            )

            console.log(" Updated Application ", updatedApplication)


            if (!updatedApplication) {
                return res.status(404).json({ msg: 'Application not found' });
            }

            return res.status(200).json({ msg: "Application updated successfully", updatedApplication });
        }


    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


// academy details by id  

const preview = async (req, res) => {
    try {
        const response = await MusicAcademy.findById(req.params.id)
        if (response) {
            res.status(200).json(response)
        } else {
            res.status(404).json({ msg: "Academy not found " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });

    }
}

// check the academy access 
const handleurl = async (req, res) => {
    const { requestedurl } = req.body
    try {
        const response = await Admin.find({ academy_url: requestedurl });
        if (response.length > 0 && response[0].academy_access === "Accept") {
            res.status(200).json(response);
        } else {
            res.status(404).json({ msg: 'Academy does not have access' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
}


// check the url for admin verification 

const verifyurl = async (req, res) => {
    const { role } = req.body

    if (role === "Admin") {
        res.status(200).json({ msg: "Authorized" })
    }
    else {
        res.status(404).json({ msg: "UnAuthorized" })
    }
}


module.exports = {
    academy_details,
    preview,
    personaldetailsupdation,
    handleurl , 
    verifyurl
};