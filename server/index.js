const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");


dotenv.config();
const port = process.env.PORT || 5000;

const muser = encodeURIComponent(process.env.MONGO_USERNAME);
const mpass = encodeURIComponent(process.env.MONGO_PASSWORD);

const path = `mongodb+srv://${muser}:${mpass}@musicacademy.o2ko5b4.mongodb.net/?retryWrites=true&w=majority&appName=MusicAcademy `


const app = express();

app.use(express.json());
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

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
