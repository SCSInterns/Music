const Advertise = require("../models/AdvertisePricing")

const newEntry = async (req, res) => {

    try {

        const { role, name, price, limit, section, features } = req.body

        if (role === "Superadmin") {

            const newEntry = new Advertise({
                name: name,
                price: price,
                limit: limit,
                section: section,
                features: features
            })

            const response = await newEntry.save()

            if (response) {
                return res.status(201).json({ message: "Advertise Pricing Created Successfully" })
            } else {
                return res.status(500).json({ message: "Internal Server Error" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }

}

const updateEntry = async (req, res) => {
    try {


        const { role, name, price, limit, features, id, section } = req.body

        if (role === "Superadmin") {

            const existing = await Advertise.findOne({ _id: id })

            if (existing) {
                existing.name = name
                existing.price = price
                existing.limit = limit
                existing.section = section
                existing.features = features

                const response = await existing.save()

                if (response) {
                    return res.status(200).json({ message: "Advertise Pricing Updated Successfully" })
                } else {
                    return res.status(500).json({ message: "Internal Server Error " })
                }

            } else {
                return res.status(404).json({ message: "Not Found" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

const deleteEntry = async (req, res) => {
    try {

        const { id, role } = req.body

        if (role === "Superadmin") {

            const entry = await Advertise.findOne({ _id: id })

            if (entry) {

                const response = await Advertise.deleteOne({ _id: id })

                if (response) {
                    return res.status(200).json({ message: "Advertise Pricing Deleted Successfully" })
                } else {
                    return res.status(500).json({ message: "Internal Server Error" })
                }

            } else {
                return res.status(404).json({ message: "Not Found" })
            }

        } else {
            return res.status(401).json({ message: "Unauthorized Access" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

const allentries = async (req, res) => {

    try {

        const entries = await Advertise.find({})

        if (entries) {
            return res.status(200).json(entries)
        } else {
            return res.status(404).json({ message: "Not Found" })
        }

    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })

    }
}

const allocateadvertise = async (req, res) => {
    try {

        const { role, id, academyname } = req.body


    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error })
    }
}

module.exports = { newEntry, updateEntry, deleteEntry, allentries }