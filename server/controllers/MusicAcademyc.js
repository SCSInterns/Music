const MusicAcademy = require('../models/MusicAcademy');
const Token = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');  

// academy details fillup 

const academy_details = async (req,res) =>
{
     try {
        const newacademy = await new MusicAcademy(req.body)
        const response = await newacademy.save(); 
        if(response)  
        {
            res.status(200).json(response)
        }
        else{
            res.status(404).json({msg : " error saving details "})
        }
            
     } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
     }
}   


// academy details by id  

const preview = async (req,res) => 
{
    try {
        const response = await MusicAcademy.findById(req.params.id)
        if(response) 
        {
            res.status(200).json(response)
        }else{
            res.status(404).json({msg : " Please Login Again to get info "})
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });

    }
}


module.exports = {
    academy_details , 
    preview
};