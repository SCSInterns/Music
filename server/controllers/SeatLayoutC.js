const { SeatLayout } = require("../models/Seat")
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
    check("noofseatsperrows")
        .isInt({ min: 1 })
        .withMessage("Number of seats per row must be a positive integer"),
    check("planname").notEmpty().withMessage("Plan name is required"),
    check("priceperseat").notEmpty().withMessage("Price per seat is required"),
];


const createlayout = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { academyid, eventid, noofrows, noofseatsperrows, planname, priceperseat } = req.body

    try {

        const total = noofrows * noofseatsperrows
        const seatbooked = 0

        const newSeat = new SeatLayout({
            academyid: academyid,
            planname: planname,
            eventid: eventid,
            noofrows: noofrows,
            noofseatsperrow: noofseatsperrows,
            totalnoofseats: total,
            seatbooked: seatbooked,
            priceperseat: priceperseat
        })
        await newSeat.save()


        return res.status(201).json({ message: "Seat layout created successfully" })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

const getseatlayout = async (req, res) => {

    try {

        const { eventid } = req.body

        const seatlayout = await SeatLayout.find({ eventid: eventid })
        if (!seatlayout) return res.status(404).json({ message: "Seat layout not found" })
        return res.status(200).json({ seatlayout })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


module.exports = { createlayout, validateCreateLayout, getseatlayout }