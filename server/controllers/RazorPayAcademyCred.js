const Cred = require("../models/RazorPayCred")
const crypto = require('crypto');
const MCred = require("../models/GoogleAppCred")

const aes_key = process.env.AES_KEY

// const ENCRYPTION_KEY1 = crypto.randomBytes(32).toString('hex');
// console.log('Generated Key:', ENCRYPTION_KEY1);

const storecred = async (req, res) => {
    try {

        const { academyname, role, id, key } = req.body

        if (role === "Admin") {

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
            console.log(
                decrypt(id),
                decrypt(key)
            )
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

function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


module.exports = { storecred, retrivecred, retriveid, storemailcred, retrivemailcred, retrivemail, retriveacademycred, encrypt, decrypt }