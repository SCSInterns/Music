const Instrument = require('../models/Instrument');

const handleInstrument = async (req, res) => {
    try {
        const { academyname, label, url } = req.body;


        if (!academyname || !label || !url) {
            return res.status(400).json({ message: 'Academy name, label, and URL are required.' });
        }
        let instrumentDoc = await Instrument.findOne({ academyname });

        if (instrumentDoc) {
            instrumentDoc.instruments.set(label, url);
        } else {
            instrumentDoc = new Instrument({
                academyname,
                instruments: { [label]: url },
            });
        }
        await instrumentDoc.save();
        res.status(201).json({ message: 'Instrument saved successfully!', data: instrumentDoc });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { handleInstrument }
