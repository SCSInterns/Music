const Batches = require("../models/Batch")
const SpecificBatch = require("../models/SpecificBatch")

// starting - no of batches count addition 

const addbtachescount = async (req, res) => {
    try {
        const { academyname, role, batchescount, studentscount } = req.body

        if (role === "Admin") {

            const existing = await Batches.findOne({ academyname: academyname })

            if (existing) {
                existing.no_of_batches = batchescount
                existing.max_no_of_students_per_batch = studentscount

                const data = await existing.save()

                if (data) {
                    res.status(200).json({ msg: "Batches details updated success", data })
                }
                else {
                    res.status(404).json("Error saving Details")
                }
            }
            else {

                const response = await new Batches({
                    academyname: academyname,
                    no_of_batches: batchescount,
                    max_no_of_students_per_batch: studentscount
                })

                if (response) {

                    const data = await response.save()
                    res.status(200).json({ msg: "Batched Info Inserted Success", data })
                }
                else {
                    res.status(404).json({ msg: "Batched Info Insertion Failed" })
                }
            }
        } else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

const addbatchesspecs = async (req, res) => {

    try {

        const { academyname, role, noofstudents, batchname, starttime, endtime, days } = req.body

        if (role === "Admin") {
            const available = await Batches.findOne({ academyname: academyname }
            )

            const existingbatch = await SpecificBatch.findOne({
                batchname: batchname
            })

            if (existingbatch) {
                return res.status(404).json({ msg: "Btach name already exist " })
            }

            if (available) {
                const availablecount = available.no_of_batches - available.currentbatchcount

                if (availablecount === 0) {
                    res.status(404).json({ msg: " No batches are available . Please increase your batches" })
                }
                else {

                    if (available.max_no_of_students_per_batch < noofstudents) {
                        return res.status(404).json({ msg: "No of students are more than allowed " })
                    }

                    const newbatch = await new SpecificBatch({
                        academyname: academyname,
                        noofstudents: noofstudents,
                        batchname: batchname,
                        starttime: starttime,
                        endtime: endtime,
                        days: days
                    })

                    const data = await newbatch.save()

                    if (data) {

                        available.currentbatchcount =
                            available.currentbatchcount + 1

                        await available.save()

                        res.status(200).json({ msg: "New Batch Created Successfuly ", data })

                    }
                }
            }
            else {
                res.status(404).json({ msg: "Please add main info first " })
            }
        }
        else {
            res.status(401).json({ msg: "Unauthorized Access" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}






module.exports = { addbtachescount, addbatchesspecs }