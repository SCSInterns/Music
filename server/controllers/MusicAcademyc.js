const MusicAcademy = require('../models/MusicAcademy');
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


// put api for academy details - franchise upadtion 

const franchiseupdation = async (req, res) => {
    try {
        const { Franchise, Franchise_Name, Franchise_Address } = req.body;

        const response = await MusicAcademy.findById(req.params.id);

        if (response) {

            const updatedApplication = await MusicAcademy.findByIdAndUpdate(
                req.params.id,
                { $set: { Franchise: Franchise, Franchise_Name: Franchise_Name, Franchise_Address: Franchise_Address } },
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

// put api for academy details - personal details upadtion 

const personaldetailsupdation = async(req,res) => 
    {
        try {
            const {name , address , contactno } = req.body ; 
    
            const response = await MusicAcademy.findById(req.params.id) ; 
             
            if(response) 
            {
                 
            const updatedApplication = await MusicAcademy.findByIdAndUpdate(
                req.params.id,
                { $set: { name: name, address: address , contactno:contactno  } },
                { new: true }
            )
    
            console.log(" Updated Application " , updatedApplication)
    
            
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
            res.status(404).json({ msg: " Please Login Again to get info " })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });

    }
}


module.exports = {
    academy_details,
    preview , 
    personaldetailsupdation , 
    franchiseupdation
};