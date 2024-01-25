// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDb from "../../../middleware/mongoose"
import User from '../../../models/User'
var CryptoJS = require("crypto-js");
var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { name, email, username, phone } = req.body;
            let user = await User.findOne({ username });
            if (user) {
                return res.status(400).json({ success: false, error: "User with this username already exists!" })
            }

            user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ success: false, error: "User with this email already exists!" })
            }

            user = await User.findOne({ phone });
            if (user) {
                return res.status(400).json({ success: false, error: "User with this phone number already exists!" })
            }

            // Encrypt
            let password = CryptoJS.AES.encrypt(req.body.password, process.env.AES_SECRET).toString();

            let u = new User({ name, email, password, username, phone })
            await u.save();
            let token = jwt.sign({ email, name, username }, process.env.JWT_SECRET);
            res.status(200).json({ success: true, token })
        }
        else {
            res.status(400).json({ success: false, error: "This method is not allowed!" })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: "Some error occurred!" })
    }
}

export default connectDb(handler);
