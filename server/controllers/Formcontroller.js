const Form = require('../models/Form')
const Token = require('../models/Token');

// form addition 


const handledynamicform = async (req,res) => 
{
   try {
    const { academyname, additionalFields } = req.body;
    const academy = new Form({
        academy_name : academyname,
      additionalFields
    });

    await academy.save();
    res.status(201).send(academy);

   } catch (error) {
    res.status(500).json({ message: 'Server not supported', error });
   }
}


module.exports = {handledynamicform}