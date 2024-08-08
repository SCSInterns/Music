const Form = require('../models/Form')
const Token = require('../models/Token');

// form addition 


const handledynamicform = async (req, res) => {
  try {
    const { academyname, additionalFields } = req.body;
    const academy = new Form({
      academy_name: academyname, 
      additionalFields
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

    const form = await Form.find({ academy_name: academyname })

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
  const { academyname, userdetails } = req.body;

  const newform = await new Form({ academy_name: academyname, additionalFields: userdetails })

  const response = await newform.save();

  if (response) {
    res.status(200).json(response)
  }
  else {
    res.status(404).json({ message: " Error saving details " })
  }

}

module.exports = { handledynamicform, getform , savedata }