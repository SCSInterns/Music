const Batch = require("../models/BatchN")

const BatchAddition = async (req, res) => {

    try {

        const { academyname, batchname, maximumstudents, course, specificDetails, classtype, schedule, role, conflict } = req.body;

        if (role !== "Admin") {
            return res.status(401).json({ message: 'Unauthorized access' });
        }

        const existingBatches = await Batch.find({ academyname: academyname })

        if (!existingBatches) {
            const newBatch = new Batch({
                academyname: academyname,
                batchname: batchname,
                maximumstudents: maximumstudents,
                course: course,
                specificDetails: specificDetails,
                classtype: classtype,
                schedule: schedule,
            })

            await newBatch.save();

            return res.status(200).json({ message: 'Batch added successfully' })
        }

        // check conflict with existing batches

        for (const ebatch of existingBatches) {
            const ebatchschedule = ebatch.schedule

            for (const day of ebatchschedule) {

            }
        }





    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }


}

module.exports = { BatchAddition }