const { razorpayInstance } = require("../index");
const RazorPayOrder = require("../models/RazorPayOrder");


const createOrder = async (req, res) => {
    try {
        const { amount, studentid, academyname } = req.body;

        if (!amount || !studentid) {
            return res.status(400).json({
                success: false,
                error: 'Amount and student ID are required'
            });
        }

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        // saving order details in db 
        const newOrder = new RazorPayOrder({
            academyname: academyname,
            razorpayOrderId: order.id,
            studentId: studentid,
            amount: order.amount,
            status: 'created',
        });

        const data = await newOrder.save();

        res.status(201).json(data);

    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ success: false, error: 'Failed to create Razorpay order' });
    }
};

module.exports = { createOrder }