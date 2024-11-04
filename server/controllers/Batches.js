const Batch = require("../models/Batch");
const Batches = require("../models/Batch");
const SpecificBatch = require("../models/SpecificBatch");


// Function to calculate time difference
function calculateTimeDifference(startTime, endTime) {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0);

    let timeDiff = endDate - startDate;
    if (timeDiff < 0) {
        endDate.setDate(endDate.getDate() + 1);
        timeDiff = endDate - startDate;
    }

    return timeDiff / (1000 * 60 * 60);
}

const addBatchesCount = async (req, res) => {
    try {
        const {
            academyname,
            role,
            batchescount,
            studentscount,
            classescount,
            instrumentperclass,
            typeofins,
            duration,
            startime,
            endtime
        } = req.body;

        if (role !== "Admin") {
            return res.status(401).json({ msg: "Unauthorized Access" });
        }

        const timeDiff = calculateTimeDifference(startime, endtime);
        const maximumNoOfBatches = Math.floor(timeDiff / duration);

        if (batchescount > maximumNoOfBatches) {
            return res.status(404).json({
                msg: `The maximum number of batches that can be allocated is ${maximumNoOfBatches} according to your academy timing`
            });
        }
        const existingBatch = await Batches.findOne({ academyname });

        const maximumCount = batchescount * classescount * studentscount;

        if (existingBatch) {
            existingBatch.no_of_batches_per_day = batchescount;
            existingBatch.max_no_of_students_per_batch = studentscount;
            existingBatch.no_of_classes = classescount;
            existingBatch.duration = duration;
            existingBatch.no_of_instruments_per_class = instrumentperclass;
            existingBatch.instrument_types = typeofins;
            existingBatch.academy_start_time = startime;
            existingBatch.academy_end_time = endtime;
            existingBatch.max_no_of_students_per_day = maximumCount;

            const updatedBatch = await existingBatch.save();

            await updateBatchSpecs(updatedBatch, batchescount);

            return res.status(200).json({ msg: "Batches details updated successfully", data: updatedBatch });
        } else {
            const newBatch = new Batches({
                academyname,
                no_of_batches_per_day: batchescount,
                max_no_of_students_per_batch: studentscount,
                no_of_classes: classescount,
                duration,
                no_of_instruments_per_class: instrumentperclass,
                instrument_types: typeofins,
                max_no_of_students_per_day: maximumCount,
                academy_start_time: startime,
                academy_end_time: endtime
            });

            const savedBatch = await newBatch.save();
            await addBatchSpecs(savedBatch);

            return res.status(200).json({ msg: "Batches Info Inserted Successfully", data: savedBatch });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}


// Helper function to create batch specs based on the main batch details  

const addBatchSpecs = async (mainBatch) => {
    const { academyname, no_of_batches_per_day, no_of_classes, instrument_types } = mainBatch;

    for (let i = 1; i <= no_of_batches_per_day; i++) {
        for (let j = 1; j <= no_of_classes; j++) {
            const batchSpec = new SpecificBatch({
                academyname,
                batchname: `${academyname}-Batch${i}-Class${j}`,
                starttime: mainBatch.academy_start_time,
                endtime: mainBatch.academy_end_time,
                days: ["Default"],
                batchtype: "Default",
                noofstudents: 0,
                instrument_types: instrument_types.map(ins => ({
                    type: ins.type,
                    quantity: ins.quantity,
                    currentstudentcount: 0
                }))
            });
            await batchSpec.save();
        }
    }
};


// Helper function to update batch specs based on the new batch count
const updateBatchSpecs = async (mainBatch, newBatchesCount) => {
    const { academyname, no_of_classes } = mainBatch;
    const existingSpecs = await SpecificBatch.find({ academyname });
    const neededSpecsCount = newBatchesCount * no_of_classes;

    if (existingSpecs.length > neededSpecsCount) {
        const specsToDelete = existingSpecs.slice(neededSpecsCount);
        await SpecificBatch.deleteMany({ _id: { $in: specsToDelete.map(spec => spec._id) } });
    }

    if (existingSpecs.length < neededSpecsCount) {
        const existingBatchNumbers = new Set(existingSpecs.map(spec => parseInt(spec.batchname.split('-Batch')[1].split('-Class')[0])));

        let batchCounter = 1;
        let classCounter = 1;

        while (existingSpecs.length < neededSpecsCount) {
            const batchName = `${academyname}-Batch${batchCounter}-Class${classCounter}`;
            const specExists = existingSpecs.some(spec => spec.batchname === batchName);

            if (!specExists) {
                const batchSpec = new SpecificBatch({
                    academyname,
                    batchname: batchName,
                    starttime: mainBatch.academy_start_time,
                    endtime: mainBatch.academy_end_time,
                    days: ["Monday", "Wednesday", "Friday"],
                    batchtype: "Default",
                    noofstudents: 0,
                    instrument_types: mainBatch.instrument_types.map(ins => ({
                        type: ins.type,
                        quantity: ins.quantity,
                        currentstudentcount: 0
                    }))
                });

                await batchSpec.save();
                existingSpecs.push(batchSpec);
            }

            classCounter++;
            if (classCounter > no_of_classes) {
                classCounter = 1;
                batchCounter++;
            }
        }
    }
};


// put api function to update the details    

const updatedetailsofbatch = async (req, res) => {
    try {
        const { role, days, startime, endtime, id, batchcoustomname, academynameinput } = req.body;

        if (role !== "Admin") {
            return res.status(401).json({ msg: "Unauthorized Access" });
        }

        const batchdetails = await SpecificBatch.findById(id);
        const mainbatchdata = await Batch.findOne({ academyname: academynameinput });
        const alldetails = await SpecificBatch.find({ academyname: academynameinput });

        if (!batchdetails || !mainbatchdata) {
            return res.status(404).json({ msg: "Batch or academy data not found" });
        }

        const maxClassesPerTimeSlot = mainbatchdata.no_of_classes;
        const academyStartTime = mainbatchdata.academy_start_time;
        const academyEndTime = mainbatchdata.academy_end_time;
        const customBatchName = `${academynameinput}-${batchcoustomname}`;
        const [academyStartHours, academyStartMinutes] = academyStartTime.split(':').map(Number);
        const [academyEndHours, academyEndMinutes] = academyEndTime.split(':').map(Number);
        const academyStartInMinutes = academyStartHours * 60 + academyStartMinutes;
        const academyEndInMinutes = academyEndHours * 60 + academyEndMinutes;

        const [inputStartHours, inputStartMinutes] = startime.split(':').map(Number);
        const [inputEndHours, inputEndMinutes] = endtime.split(':').map(Number);
        const batchStartInMinutes = inputStartHours * 60 + inputStartMinutes;
        const batchEndInMinutes = inputEndHours * 60 + inputEndMinutes;
        if (batchStartInMinutes < academyStartInMinutes || batchEndInMinutes > academyEndInMinutes) {
            return res.status(400).json({ msg: "Batch time must be within academy operating hours." });
        }

        const overlappingBatches = alldetails.filter(batch => {

            if (batch.starttime === mainbatchdata.academy_start_time || batch.endtime === mainbatchdata.academy_end_time) {
                return false;
            }
            return batch.days.some(day => days.includes(day));
        }
        );

        let sameTimeCount = 0;

        for (const batch of overlappingBatches) {
            const [batchStartHours, batchStartMinutes] = batch.starttime.split(':').map(Number);
            const [batchEndHours, batchEndMinutes] = batch.endtime.split(':').map(Number);
            const batchStart = batchStartHours * 60 + batchStartMinutes;
            const batchEnd = batchEndHours * 60 + batchEndMinutes;

            if (
                (batchStart < batchEndInMinutes && batchEnd > batchStartInMinutes) ||
                (batchStart === batchStartInMinutes && batchEnd === batchEndInMinutes)
            ) {
                sameTimeCount += 1;

                if (sameTimeCount >= maxClassesPerTimeSlot) {
                    return res.status(400).json({ msg: "Batch timing conflicts with existing batch(es)" });
                }
            }
        }

        batchdetails.starttime = startime;
        batchdetails.endtime = endtime;
        batchdetails.days = days;
        batchdetails.batchtype = customBatchName;

        const updatedDetails = await batchdetails.save();

        if (updatedDetails) {
            return res.status(200).json({ msg: "Batch details updated successfully", data: updatedDetails });
        } else {
            return res.status(500).json({ msg: "Failed to update batch details" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


// get all details of particular ba{tches  

const getallbatches = async (req, res) => {
    try {
        const { academyname, role } = req.body

        if (role === "Admin") {
            const details = await SpecificBatch.find({ academyname: academyname })

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



module.exports = { addBatchesCount, addBatchSpecs, updatedetailsofbatch , getallbatches};
