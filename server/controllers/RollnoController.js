const Rollno = require("../models/Rollno")

const updaterollno = async (role, academyname) => {
    try {
        if (role === "Admin") {
            const currentrollno = await Rollno.findOne({ academyname: academyname })

            if (currentrollno) {
                const c_rollno = currentrollno.currentrollno
                const n_rollno = c_rollno + 1

                currentrollno.currentrollno = n_rollno

                await currentrollno.save()

                return n_rollno
            } else {
                throw new Error("Error Occurred")
            }

        } else {
            throw new Error("Unauthorized Access")
        }
    } catch (error) {
        return { message: 'Server not supported', error: error.message }
    }
}

module.exports = { updaterollno }
