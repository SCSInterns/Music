const MusicAcademy = require('../models/MusicAcademy');
const Admin = require('../models/Admin');

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


const flattenAcademyData = (data) => {
    return data.map(item => ({
        ...item._doc,
        academy_url: item.academy_url,
    }));
};


// find by pincode  
const PincodeFinderC = async (req, res) => {
    try {
        const { pincode } = req.body;

        // Fetch all academies
        const academies = await MusicAcademy.find({});

        // Fetch accepted access academies with academy name in academies list
        const acceptedAccessAcademies = await Admin.find({
            academy_access: "Accept",
            academy_name: { $in: academies.map(a => a.academy_name) },
        });

        // Create a map of academy names to their URLs for efficient lookup
        const academyUrlMap = new Map();
        acceptedAccessAcademies.forEach(a => {
            academyUrlMap.set(a.academy_name, a.academy_url);
        });

        // Filter academies based on accepted names
        const filteredAcademies = academies.filter(a => academyUrlMap.has(a.academy_name));

        // Find nearby academies
        const musicacademylist = await findAcademyNearby(pincode, filteredAcademies, 5, 10);

        if (musicacademylist === "No academies found in the given range.") {
            return res.status(404).json({ message: 'No Music Academy found with this pincode' });
        }

        // Append academy URL from Admin database
        const responseList = musicacademylist.map(academy => ({
            ...academy,
            academy_url: academyUrlMap.get(academy.academy_name),
        }));

        const flattenedResponse = flattenAcademyData(responseList);

        if (flattenedResponse.length > 0) {
            return res.status(200).json(flattenedResponse);
        } else {
            return res.status(404).json({ message: 'No Music Academy found with this pincode' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server not supported', error: error.message });
    }
};


// find by city 
const CityFinderC = async (req, res) => {
    try {
        const { city } = req.body;

        // Fetch academies based on the city
        const academies = await MusicAcademy.find({ academy_city: city });
        if (academies.length === 0) {
            return res.status(404).json({ message: 'No Music Academy found with this city' });
        }

        // Fetch accepted access academies with academy names in the academies list
        const acceptedAccessAcademies = await Admin.find({
            academy_access: "Accept",
            academy_name: { $in: academies.map(a => a.academy_name) },
        });

        // Filter academies to include only those with accepted status
        const acceptedAcademyNames = new Set(
            acceptedAccessAcademies.map(admin => admin.academy_name)
        );

        const filteredAcademies = academies.filter(academy =>
            acceptedAcademyNames.has(academy.academy_name)
        );

        if (filteredAcademies.length === 0) {
            return res.status(404).json({ message: 'No accepted academies found in this city' });
        }

        // Create a map of academy names to their URLs
        const academyUrlMap = new Map();
        acceptedAccessAcademies.forEach(a => {
            academyUrlMap.set(a.academy_name, a.academy_url);
        });

        // Append the academy URL from Admin model to the filtered academies
        const responseList = filteredAcademies.map(academy => ({
            ...academy._doc,
            academy_url: academyUrlMap.get(academy.academy_name) || null, // Default to null if URL is not found
        }));

        return res.status(200).json(responseList);
    } catch (error) {
        return res.status(500).json({ message: 'Server not supported', error: error.message });
    }
};




module.exports = { PincodeFinderC, CityFinderC };    