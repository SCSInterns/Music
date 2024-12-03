const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');
const Razorpay = require('razorpay');
const { Server } = require('socket.io');

dotenv.config();
const port = process.env.PORT || 5000;

const muser = encodeURIComponent(process.env.MONGO_USERNAME);
const mpass = encodeURIComponent(process.env.MONGO_PASSWORD);

const rid = encodeURIComponent(process.env.RAZORPAY_KEY_ID);
const rkey = encodeURIComponent(process.env.RAZORPAY_SECRET_KEY);


const path = `mongodb+srv://${muser}:${mpass}@musicacademy.o2ko5b4.mongodb.net/?retryWrites=true&w=majority&appName=MusicAcademy `


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
module.exports = { io };

const razorpayInstance = new Razorpay({
    key_id: rid,
    key_secret: rkey,
});

module.exports = { razorpayInstance }

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

mongoose.connect(path)
    .then(() => {
        console.log("Connected to MongoDB");
    }).catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

const superadminauth = require('./routes/SuperAdminr');
app.use('/api/superadmin', superadminauth);

const academyreg = require('./routes/Academydetailr');
app.use('/api/auth', academyreg);

const academysign = require('./routes/Academysignupr');
app.use('/api/auth', academysign);

const otpservice = require('./routes/Emailr')
app.use('/api/auth', otpservice)

const academyform = require('./routes/Formroute')
app.use('/api/auth', academyform)

const installment = require('./routes/Installmentroute')
app.use('/api/auth', installment)

const media = require('./routes/ImageRoute')
app.use('/api/auth', media)

const users = require('./routes/Userrouter')
app.use('/api/auth', users)

const userlogin = require('./routes/UserLoginr')
app.use('/api/auth', userlogin)

const userprofile = require('./routes/Profiler')
app.use('/api/auth', userprofile)

const batches = require('./routes/Batchesrouter')
app.use('/api/auth', batches)

const qrcode = require('./routes/Qrcoderoute')
app.use('/api/auth', qrcode)

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('Admin connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Admin disconnected:', socket.id);
    });
});



app.get('/', (req, res) => {
    res.send("Hello World");
});

server.listen(port, () => {
    console.log(`Server started on ${port}`);
});
