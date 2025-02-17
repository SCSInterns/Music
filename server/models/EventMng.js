const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
    planName: { type: String },
    pricePerSeat: { type: Number },
    maxSeats: { type: Number },
    ticketbooked: { type: Number, default: 0 }
});

const CouponSchema = new mongoose.Schema({
    name: { type: String },
    discount: { type: Number },
    tickets: { type: Number },
    expirydate: { type: String }
})


const GroupSchema = new mongoose.Schema({
    couponName: { type: String },
    Discount: { type: Number },
    MinimumTickets: { type: Number },
})

const ExtraDetailsSChema = new mongoose.Schema({
    termsandconditions: { type: String },
    contatinformation: { type: String },
})

const EventMngSchema = new mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },
    live:
    {
        type: Boolean,
        default: false
    },
    academyname: {
        type: String,
        required: true
    },
    banner: {
        type: String,
    },
    eventcategory: {
        type: String,
        required: true
    },
    occurancetype: {
        type: String,
        required: true
    },
    eventdescription: {
        type: String,
        required: true
    },
    seatlayoutid: {
        type: [String],
    },
    seatlayouturl:
    {
        type: String,
    },
    ticketid: {
        type: String
    },
    venuetype:
    {
        type: String,
    },
    totalSeats:
    {
        type: Number,
    },
    agefreetickets: {
        type: Number
    },
    sponserstickets:
    {
        type: Number
    },
    ExtraDetailsSChema: [ExtraDetailsSChema],
    groupdiscount: [GroupSchema],
    coupon: [CouponSchema],
    paymentcreds: {
        razorpayId: { type: String },
        razorpayKey: { type: String },
        qrcode: { type: String },
        type: { type: String },
    },
    plans: [PlanSchema],
    eventSchedule: [
        {
            date: {
                type: String,
                required: true
            },
            startTime: {
                type: String,
                required: true
            },
            endTime: {
                type: String,
                required: true
            },
            venueid: {
                type: String,
                required: true
            }
        }
    ]
});

const EventMng = mongoose.model('EventMng', EventMngSchema);

module.exports = EventMng;
