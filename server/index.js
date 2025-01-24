const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit")
const cors = require("cors");
const dotenv = require("dotenv");
const http = require('http');
const { socketIOFactory } = require("./socket-factory.js")
const { redis } = require("./RedisInitalitation.js")

// for cron job  

require("./controllers/SubscriptionReminder.js")

dotenv.config();
const port = process.env.PORT || 5000;

const muser = encodeURIComponent(process.env.MONGO_USERNAME);
const mpass = encodeURIComponent(process.env.MONGO_PASSWORD);

const path = `mongodb+srv://${muser}:${mpass}@musicacademy.o2ko5b4.mongodb.net/?retryWrites=true&w=majority&appName=MusicAcademy `


const app = express();

const server = http.createServer(app);

(async () => {
    try {
        const ioInstance = await socketIOFactory(server);
        ioInstance.on('connection', (socket) => {
            console.log('Admin connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Admin disconnected:', socket.id);
            });
        });
        server.listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    } catch (error) {
        console.error("Error initializing Socket.IO:", error);
    }
})();

// Connect to Redis
redis.on("connect", () => console.log("Redis connected"));
redis.on("error", (err) => console.error("Redis connection error:", err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());


// For limiting the too many request 

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers 
//     message: "Too many requests from this IP, please try again after 15 minutes"
// })

// app.use('/api', limiter)


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

const account = require("./routes/Accountroute.js")
app.use('/api/auth', account)

const advertise = require('./routes/Advertiser')
app.use('/api/auth', advertise)

const featuredAcademies = require('./routes/FeaturedAcademyr.js')
app.use('/api/auth', featuredAcademies)


app.get('/', (req, res) => {
    res.send("Hello World");
});
