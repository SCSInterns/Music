const Cred = require("../models/RazorPayCred")
const crypto = require('crypto');

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


module.exports = { storecred, retrivecred }