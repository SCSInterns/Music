const Event = require("../models/EventMng")
const cron = require("node-cron")
const { redis } = require("../RedisInitalitation")

const getEventDetailsAcademy = async (req, res) => {
    const { role, academyname } = req.body;
    try {
        if (role !== 'Admin') {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        const eventdetails = await Event.find({ academyname: academyname });
        if (!eventdetails) {
            return res.status(404).json({ message: "No event details found" });
        }
        return res.status(200).json(eventdetails)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" });
    }
}


cron.schedule("0 0 * * *", async () => {
    console.log("Running a task every midnight for event details updation ");
    const eventdetails = await redis.hgetall("events")
    for (const [id, event] of Object.entries(eventdetails)) {
        try {
            const eventdetail = JSON.parse(event).eventdetails;
            const newinfo = await updateDetails(id, eventdetail)
        } catch (error) {
            console.log(error)
        }
    }
})


const updateDetails = async (id, details) => {
    try {
        let updatedEvent = await Event.findOneAndUpdate(
            { _id: id },
            { $set: details },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return ` Event "${details.eventname}" not found`;
        }

        return ` Details updated successfully for event "${updatedEvent.eventname}"`;
    } catch (error) {
        console.error("Error updating event details:", error);
        return error.message;
    }
};



module.exports = { getEventDetailsAcademy }