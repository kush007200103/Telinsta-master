import jsonwebtoken from "jsonwebtoken";
import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let token = req.body.token;
        let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        let dbuser = await User.findOne({ email: user.email }).select(["-password"]);
        const { name, email, username,profilepic, phone, bio, followers, following } = dbuser;
        res.status(200).json({profilepic, name, email, username, phone, bio, followers, following ,success:true})
    }
    else {
        res.status(400).json({ error: 'error',success:false })
    }
}

export default connectDb(handler);

