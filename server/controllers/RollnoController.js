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
                const newacademy = await new Rollno(
                    {
                        academyname: academyname,
                        currentrollno: 1
                    }
                )

                await newacademy.save()
                return newacademy.currentrollno
            }

        } else {
            throw new Error("Unauthorized Access")
        }
    } catch (error) {
        return { message: 'Server not supported', error: error.message }
    }
}

module.exports = { updaterollno }
