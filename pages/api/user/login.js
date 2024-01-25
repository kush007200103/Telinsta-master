// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDb from "../../../middleware/mongoose"
import User from '../../../models/User'
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            let user = await User.findOne({ username: req.body.username })
            if (user) {
                // Decrypt
                let bytes = CryptoJS.AES.decrypt(user.password, process.env.AES_SECRET)
                let password = bytes.toString(CryptoJS.enc.Utf8);
                if (req.body.username === user.username && password === req.body.password) {
                    let token = jwt.sign({ username: user.username, name: user.name, email: user.email }, process.env.JWT_SECRET);
                    res.status(200).json({ success: true, token })
                }
                else {
                    res.status(400).json({ success: false, error: "Invalid credentials!" })
                }
            }
            else {
                res.status(400).json({ success: false, error: "User not found!" })
            }
        }
        else {
            res.status(400).json({ success: false, error: "This method is not allowed!" })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: "Some error occurred!" })
    }
}

export default connectDb(handler);
