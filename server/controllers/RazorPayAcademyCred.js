const Cred = require("../models/RazorPayCred")
const crypto = require('crypto');
const MCred = require("../models/GoogleAppCred")
const Admin = require("../models/Admin")

const aes_key = process.env.AES_KEY
const hmac_key = process.env.HMAC_KEY

const storecred = async (req, res) => {
    try {

        const { academyname, role, id, key, email } = req.body

        if (role === "Admin") {


            const correctemail = await Admin.findOne({ academy_name: academyname })

            if (correctemail.academy_email !== email) {
                return res.status(401).json({ msg: "Only Admin Can Update Creds" })
            }

            const existing = await Cred.findOne({ academyname: academyname })

            const encrpytid = encrypt(id)
            const encryptkey = encrypt(key)

            if (existing) {

                existing.razorpay_id = encrpytid
                existing.razorpay_key = encryptkey

                const response = await existing.save()

                if (response) {
                    return res.status(200).json({ msg: "Creds Updated Successfully" })

                } else {
                    return res.status(404).json({ msg: "Error Updating Creds to db" })
                }

            } else {
                const newcreds = new Cred({
                    academyname: academyname,
                    razorpay_id: encrpytid,
                    razorpay_key: encryptkey
                })

                const response = await newcreds.save()

                if (response) {
                    return res.status(200).json({ msg: "Creds Saved Successfully" })

                } else {
                    return res.status(404).json({ msg: "Error Saving Creds to db" })
                }
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized Acccess" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}


const storemailcred = async (req, res) => {
    try {

        const { academyname, role, mail, password } = req.body

        if (role === "Admin") {

            const admin = await Admin.findOne({ academy_name: academyname })
            if (admin.academy_email !== mail) {
                return res.status(401).json({ msg: "Only Admin Can Add Creds" })
            }

            const existing = await MCred.findOne({ academyname: academyname })

            const encrpytmail = encrypt(mail)
            const encryptpwd = encrypt(password)

            if (existing) {

                existing.mail = encrpytmail
                existing.app_password = encryptpwd

                const response = await existing.save()

                if (response) {
                    return res.status(200).json({ msg: "Creds Updated Successfully" })

                } else {
                    return res.status(404).json({ msg: "Error Updating Creds to db" })
                }

            } else {
                const newcreds = new MCred({
                    academyname: academyname,
                    mail: encrpytmail,
                    app_password: encryptpwd
                })

                const response = await newcreds.save()

                if (response) {
                    return res.status(200).json({ msg: "Creds Saved Successfully" })

                } else {
                    return res.status(404).json({ msg: "Error Saving Creds to db" })
                }
            }

        } else {
            return res.status(401).json({ msg: "Unauthorized Acccess" })
        }

    } catch (error) {
        res.status(500).json({ message: 'Server not supported', error });
    }
}

const retrivemailcred = async (academyname) => {
    try {
        const creds = await MCred.findOne({ academyname: academyname })

        if (creds) {
            const mail = decrypt(creds.mail)
            const pwd = decrypt(creds.app_password)
            return { mail, pwd }
        }
    } catch (error) {
        console.log(error)
    }
}


const retrivecred = async (academyname) => {
    try {
        const creds = await Cred.findOne({ academyname: academyname })

        if (creds) {
            const id = decrypt(creds.razorpay_id)
            const key = decrypt(creds.razorpay_key)
            return { id, key }
        }
    } catch (error) {
        console.log(error)
    }
}



const retriveid = async (req, res) => {
    try {
        const { academyname } = req.body
        const creds = await Cred.findOne({ academyname: academyname })

        if (creds) {
            const id = creds.razorpay_id
            return res.status(200).json(id)
        } else {
            return res.status(404).json({ msg: "Credentials Not Found " })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}

const retriveacademycred = async (req, res) => {
    try {

        const { academyname } = req.body
        const creds = await Cred.findOne({ academyname: academyname })

        if (creds) {
            const id = creds.razorpay_id
            const key = creds.razorpay_key
            const arr = {
                key: key,
                id: id
            }
            return res.status(200).json(arr)
        } else {
            return res.status(404).json({ msg: "Credentials Not Found " })
        }

    } catch (error) {
        return res.status(500).json({ msg: "Internal Server Error" })
    }
}


const retrivemail = async (req, res) => {
    try {
        const { academyname } = req.body
        const creds = await MCred.findOne({ academyname: academyname })

        if (creds) {
            const id = decrypt(creds.mail)
            return res.status(200).json(id)
        } else {
            return res.status(404).json({ msg: "Credentials Not Found " })
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Internal Server Error" })
    }
}


const ENCRYPTION_KEY = aes_key;
const IV_LENGTH = 16;
const HMAC_KEY = hmac_key;

if (Buffer.from(ENCRYPTION_KEY, 'hex').length !== 32) {
    throw new Error("Invalid ENCRYPTION_KEY length. Must be 32 bytes (64 hex characters).");
}
if (Buffer.from(HMAC_KEY, 'hex').length < 32) {
    throw new Error("Invalid HMAC_KEY length. Must be at least 32 bytes.");
}


function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    const tag = cipher.getAuthTag();
    const hmac = crypto.createHmac('sha256', Buffer.from(HMAC_KEY, 'hex'))
        .update(Buffer.concat([iv, encrypted, tag]))
        .digest('hex');
    return iv.toString('hex') + ':' + encrypted.toString('hex') + ':' + tag.toString('hex') + ':' + hmac;
}

function decrypt(text) {
    const parts = text.split(':');
    if (parts.length !== 4 || parts.some(p => p.length === 0)) {
        throw new Error("Invalid encrypted format. Data may be corrupted.");
    }

    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const tag = Buffer.from(parts[2], 'hex');
    const hmacReceived = parts[3];
    const hmac = crypto.createHmac('sha256', Buffer.from(HMAC_KEY, 'hex'))
        .update(Buffer.concat([iv, encryptedText, tag]))
        .digest('hex');

    if (hmac !== hmacReceived) {
        throw new Error("HMAC verification failed! Data might be tampered.");
    }

    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
}



module.exports = { storecred, retrivecred, retriveid, storemailcred, retrivemailcred, retrivemail, retriveacademycred, encrypt, decrypt }