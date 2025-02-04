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
    check("noofpartition")
        .isInt({ min: 1 })
        .withMessage("Number of partition must be a positive integer"),
    check("planname").notEmpty().withMessage("Plan name is required"),
    check("priceperseat").notEmpty().withMessage("Price per seat is required"),
];


const createlayout = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { academyid, eventid, noofrows, planname, priceperseat, seatsPerPartition, maxSeatsPerPartition, noofpartition, seatingorientation, venueid } = req.body

    try {

        var count = 0

        for (const i in seatsPerPartition) {
            for (const j in seatsPerPartition[i]) {
                count = count + Math.floor(seatsPerPartition[i][j])
            }
        }

        const seatbooked = 0

        const newSeat = new SeatLayout({
            academyid: academyid,
            noofrows: noofrows,
            noofpartition: noofpartition,
            seatsPerPartition: seatsPerPartition,
            maxSeatsPerPartition: maxSeatsPerPartition,
            seatingorientation: seatingorientation,
            eventid: eventid,
            planname: planname,
            priceperseat: priceperseat,
            totalnoofseats: count,
            seatbooked: seatbooked,
            venueid: venueid,
        })
        const confirmed = await newSeat.save()

        if (confirmed) {
            return res.status(201).json({ message: "Seat layout created successfully" })
        } else {
            return res.status(404).json({
                message: "Seat layout creation failed"
            })
        }


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