const Razorpay = require('razorpay');
const RazorPayM = require('./models/RazorPayCred');
const RazorPayAcademyCred = require("./controllers/RazorPayAcademyCred")


const getRazorpayInstance = async (academyname) => {
    try {
        if (!academyname) {
            throw new Error('Academy name is required');
        }

        const credentials = await RazorPayAcademyCred.retrivecred(academyname)

        if (!credentials) {
            throw new Error(`Razorpay credentials not found for academy: ${academyname}`);
        }

        const razorpayInstance = new Razorpay({
            key_id: credentials.id,
            key_secret: credentials.key,
        });

        return razorpayInstance;
    } catch (error) {
        console.error('Error fetching Razorpay credentials:', error);
        throw error;
    }
};

module.exports = { getRazorpayInstance };
