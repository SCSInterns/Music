const MusicAcademy = require('../models/MusicAcademy');


// find academy near pincodes  

function findAcademyNearby(userPincode, academies, rangeLimit = 5, max = 10) {
    let foundAcademies = [];

    // ±5 range
    const range5Lower = Number(userPincode) - Number(rangeLimit);
    const range5Upper = Number(userPincode) + Number(rangeLimit);
    for (let academy of academies) {
        if (academy.academy_pincode >= range5Lower && academy.academy_pincode <= range5Upper) {
            foundAcademies.push(academy);
        }
    }
    // ±10 range
    if (foundAcademies.length === 0) {
        const range10Lower = Number(userPincode) - Number(max);
        const range10Upper = Number(userPincode) + Number(max);
        for (let academy of academies) {
            if (academy.academy_pincode >= range10Lower && academy.academy_pincode <= range10Upper) {
                foundAcademies.push(academy);
            }
        }
    }


    return foundAcademies.length > 0 ? foundAcademies : "No academies found in the given range.";
}



// find by pincode  

const PincodeFinderC = async (req, res) => {

    try {

        const { pincode } = req.body

        const academy = await MusicAcademy.find({})

        // const musicacademylist = await MusicAcademy.find({ academy_pincode: pincode }) 
        const musicacademylist = await findAcademyNearby(pincode, academy, 5, 10)

        if (musicacademylist.length > 0) {

            return res.status(200).json(musicacademylist)

        } else {
            return res.status(404).json({ message: 'No Music Academy found with this pincode' })
        }

    } catch (error) {
        return { message: 'Server not supported', error: error.message }
    }

}

// find by city 

const CityFinderC = async (req, res) => {

    try {

        const { city } = req.body

        const academy = await MusicAcademy.find({ academy_city: city })

        if (academy.length > 0) {
            return res.status(200).json(academy)
        }
        else {
            return res.status(404).json({ message: 'No Music Academy found with this city' })
        }

    } catch (error) {
        return { message: 'Server not supported', error: error.message }

    }

}


module.exports = { PincodeFinderC, CityFinderC };    