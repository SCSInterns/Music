const Form = require('../models/Form')
const Token = require('../models/Token');
const youtubeUrl = require('youtube-url');
const Video = require('../models/Video')
const Logo = require('../models/Logo')
const Qrcode = require("../models/AcademyQr")
const { io } = require('../index');
const AcademyQr = require('../models/AcademyQr');

// form addition 
const handledynamicform = async (req, res) => {
  try {
    const { academyname, role, additionalFields, courses } = req.body;
    const academy = new Form({
      academy_name: academyname,
      role: role,
      additionalFields,
      courses
    });

    await academy.save();
    res.status(201).send(academy);

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}


// getting the form to be filled by the user 
const getform = async (req, res) => {
  try {
    const { academyname } = req.body;

    const form = await Form.find({ academy_name: academyname, role: 'Admin' })

    if (form) {
      res.status(200).json(form)
    }
    else {
      res.status(404).json({ message: 'Form Fetching Failed ' })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}


// filling the data of the user of academys 
const savedata = async (req, res) => {
  const { academyname, role, userdetails } = req.body;

  const newform = await new Form({
    academy_name: academyname,
    role: role,
    additionalFields: userdetails
  })

  const response = await newform.save();
  io.emit('newData', response);

  if (response) {
    res.status(200).json(response)
  }
  else {
    res.status(404).json({ message: " Error saving details " })
  }

}

// getting the form data filled by user for dashboard 

const handleapplicantdata = async (req, res) => {
  const { academyname, role } = req.body;

  if (role == "Admin") {
    const response = await Form.find({
      academy_name: academyname,
      role: 'User',
      status: { $in: ['Accept', 'To be updated', 'Reject'] }
    })


    if (response) {
      res.status(200).json(response)
    }
    else {
      res.status(304).json({ msg: "No data found" })
    }
  }

  else {
    res.status(404).json({ msg: 'Invalid request' })
  }
}


// getting the particular form data 

const finddatabyid = async (req, res) => {
  try {
    const { role } = req.body
    const user = await Form.findById(req.params.id)

    if (user) {

      if (role === "Admin") {
        res.status(200).json(user)
      } else {
        res.status(401).json({ msg: "Unauthorized" })
      }

    } else {
      res.status(404).json({ msg: "No user found with gien id " })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}

// setting up the status 

const handlestatus = async (req, res) => {

  try {
    const { status } = req.body
    const user = await Form.findById(req.params.id)

    const updateduser = {
      ...req.body,
      status: status
    };
    if (user) {
      const updatedinfo = await Form.findByIdAndUpdate(req.params.id, { $set: updateduser })

      res.status(200).json({ msg: "Status updated successfully ", updatedinfo })
    }
    else {
      res.status(404).json({ msg: "User not found" })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }

}


// changes for installment date starts here  

const handleinstallment = async (req, res) => {
  try {
    const { date } = req.body

    const user = await Form.findById(req.params.id)
    const updateduser = {
      ...req.body,
      installementDate: date
    };
    if (user && user.status === "Accept") {
      const updatedinfo = await Form.findByIdAndUpdate(req.params.id, { $set: updateduser })

      // create the default entry in installment with empty field for relieve error  
      res.status(200).json({ msg: "Installement updated successfully ", updatedinfo })
    }
    else {
      res.status(404).json({ msg: "User not found" })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}

// checking the youtube video link url 

const verifyyoutubelink = async (req, res) => {
  try {
    const { link, role, academyname } = req.body

    if (role === "Admin") {
      const response = await youtubeUrl.valid(link);

      if (response) {
        const data = new Video({
          academyname: academyname,
          link: link
        })
        await data.save()
        res.status(200).json(data)
      }
      else {
        res.status(404).json({ msg: "Inalid youtube link " })
      }
    }
    else {
      res.status(401).json({ msg: "Unauthorized Access" })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}

const handlelogo = async (req, res) => {
  try {
    const { link, role, academyname } = req.body

    if (role === "Admin") {

      const exisitingdata = await Logo.findOne({ academyname: academyname })

      if (exisitingdata) {
        exisitingdata.link = link
        await exisitingdata.save()
        res.status(200).json(exisitingdata)
      }
      else {
        const response = await Logo({
          academyname: academyname,
          link: link
        })

        const data = await response.save()

        if (data) {
          res.status(200).json(data)
        }
        else {
          res.status(404).json({ msg: "Error saving data" })
        }
      }
    }
    else {
      res.status(401).json({ msg: "Unauthorized Access" })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }

}

// inserting qr 
const handleqr = async (req, res) => {
  try {
    const { link, role, academyname } = req.body

    if (role === "Admin") {

      const exisitingdata = await AcademyQr.findOne({ academyname: academyname })

      if (exisitingdata) {
        exisitingdata.link = link
        await exisitingdata.save()
        res.status(200).json(exisitingdata)
      }
      else {
        const response = await AcademyQr({
          academyname: academyname,
          link: link
        })
        const data = await response.save()
        if (data) {
          res.status(200).json(data)
        }
        else {
          res.status(404).json({ msg: "Error saving data" })
        }
      }
    }
    else {
      res.status(401).json({ msg: "Unauthorized Access" })
    }

  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }

}

// fetching qr for payment 

const fetchqr = async (req, res) => {
  try {
    const { academyname } = req.body
    const response = await Qrcode.findOne({ academyname: academyname })

    if (response) {
      res.status(200).json(response.link)
    }
    else {
      res.status(404).json({ msg: 'No qr found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
  }
}


module.exports = { handledynamicform, getform, savedata, handleapplicantdata, finddatabyid, handlestatus, handleinstallment, verifyyoutubelink, handlelogo, handleqr, fetchqr }