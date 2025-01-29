const Seat = require("../models/Seat")
const { check, validationResult } = require("express-validator");


// create seat layout   

// validation schema  

const validateCreateLayout = [
    check("role").equals("Admin").withMessage("Unauthorized access!"),
    check("academyid").notEmpty().withMessage("Academy ID is required"),
    check("eventid").notEmpty().withMessage("Event ID is required"),
    check("noofrows")
        .isInt({ min: 1 })
        .withMessage("Number of rows must be a positive integer"),
    check("noofcols")
        .isInt({ min: 1 })
        .withMessage("Number of columns must be a positive integer"),
    check("planname").notEmpty().withMessage("Plan name is required"),
];


const createlayout = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { role, academyid, eventid, noofrows, noofcols, planname } = req.body

    try {


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}