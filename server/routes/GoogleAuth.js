const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const MusicAcademy = require("../models/MusicAcademy");
const Admin = require("../models/Admin")
const { OAuth2Client } = require("google-auth-library");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.get(
    "/google",
    passport.authenticate("google-signup", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google-signup", { failureRedirect: "http://localhost:3000/business" }),
    (req, res) => {
        res.redirect(`http://localhost:3000/academyregform`);
    }
);


router.post("/google-login", async (req, res) => {

    try {
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name } = ticket.getPayload();
        const existingUser = await Admin.findOne({ academy_email: email });
        if (!existingUser) {
            return res.status(401).json({ message: "Email not registered" });
        }
        const accesstoken = jwt.sign(existingUser.toJSON(), process.env.SECRET_KEY, { expiresIn: "16h" });
        const refreshtoken = jwt.sign(existingUser.toJSON(), process.env.REFRESH_KEY);
        const academyDetails = await MusicAcademy.findById(existingUser.academy_id);
        const academycity = academyDetails?.academy_city || "Unknown";
        const academyid = existingUser.academy_id;

        return res.status(200).json({
            accesstoken,
            refreshtoken,
            academyname: existingUser.academy_name,
            status: existingUser.academy_access,
            academyid,
            city: academycity
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
)

module.exports = router;