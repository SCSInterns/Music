const Batch = require("../models/BatchN")
const Form = require("../models/UserForm")

// add batch 
const BatchAddition = async (req, res) => {
    try {
        const { academyname, batchname, maximumstudents, course, specificDetails, classtype, schedule, role, conflict } = req.body;

        const existingBatches = await Batch.find({ academyname });

        if (existingBatches.length > 0) {
            for (const batch of existingBatches) {
                if (batch.batchname === batchname) {
                    return res.status(403).json({ message: 'Batch already exists . Please choose a different name 😊 ' });
                }
            }
        }


        if (role !== "Admin") {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        if (conflict === false) {
            const existingBatches = await Batch.find({ academyname });

            if (existingBatches.length > 0) {
                // Check for schedule conflicts
                for (const newSchedule of schedule) {
                    const { day, starttime, endtime } = newSchedule;

                    // Check each existing batch for schedule conflict
                    for (const batch of existingBatches) {
                        const conflictingSchedule = batch.schedule.find((existingSchedule) => {
                            // Check if the day matches
                            if (existingSchedule.day === day) {
                                // Check if the times overlap
                                const isConflict =
                                    (starttime >= existingSchedule.starttime && starttime < existingSchedule.endtime) ||
                                    (endtime > existingSchedule.starttime && endtime <= existingSchedule.endtime) ||
                                    (starttime <= existingSchedule.starttime && endtime >= existingSchedule.endtime);
                                return isConflict;
                            }
                            return false;
                        });

                        if (conflictingSchedule) {
                            return res.status(400).json({ message: `Conflict found for ${day} between ${starttime} and ${endtime}` });
                        }
                    }
                }
            }
        }

        const newBatch = new Batch({
            academyname,
            batchname,
            maximumstudents,
            course,
            specificDetails,
            classtype,
            schedule,
        });

        await newBatch.save();

        return res.status(200).json({ message: 'Batch added successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
};

// assign batch 

const BatchAssignment = async (req, res) => {
    try {
        const { batchid, studentid, conflict, instrumentName } = req.body;

        const user = await Form.findOne({ _id: studentid });

        const appliedintrument = user.additionalFields?.get("Courses")


        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }


        if (user.batchid && user.batchid !== 'None') {
            return res.status(403).json({ message: 'Batch already assigned' });
        }

        if (appliedintrument !== instrumentName && instrumentName !== "None") {
            return res.status(403).json({
                message: "User applied for diff instrument"
            })
        }


        const batch = await Batch.findOne({ _id: batchid });

        if (!batch) {
            return res.status(404).json({ message: 'Batch not found' });
        }

        if (!batch.specificDetails.instruments.includes(instrumentName) && instrumentName !== "None") {
            return res
                .status(400)
                .json({ message: `The instrument "${instrumentName}" is not available in this batch.` });
        }

        if (conflict === false) {
            const currentCount = batch.currentstudentcount;

            if (currentCount >= batch.maximumstudents) {
                return res.status(403).json({ message: 'Batch is full' });
            }
        }


        user.batchid = batch._id;
        user.batchname = batch.batchname
        await user.save();


        batch.currentstudentcount = batch.currentstudentcount + 1;
        await batch.save();

        return res.status(200).json({ message: 'Batch assigned successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Server not supported', error });
    }
};


// get all details of particular batches  

const getallbatches = async (req, res) => {
    try {
        const { academyname, role } = req.body

        if (role === "Admin") {
            const details = await Batch.find({ academyname: academyname })

            if (details) {
                res.status(200).json(details)
            }
            else {
                res.status(404).json({ msg: "Details Not Found " })
            }
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// get students list for batch showing  

const getbatchstudents = async (req, res) => {

    try {

        const { role, academyname } = req.body

        if (role === "Admin") {
            const students = await Form.find({ academy_name: academyname })

            if (students.length > 0) {

                return res.status(200).json(students)

            } else {
                return res.status(404).json({ message: "No Students Found" })
            }
        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }

}

module.exports = { BatchAddition, BatchAssignment, getallbatches, getbatchstudents }