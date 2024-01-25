import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let user = await User.findOne({ username: req.body.username }).select(["-password", "-email", "-phone"]);
        if (user) {
            const { name, username, bio, profilepic } = user;
            res.status(200).json({ profilepic, name, username, bio, success: true })
        }
        else {
            res.status(200).json({ success: false, error: 'User Not Found!' })
        }
    }
    else {
        res.status(400).json({ error: 'error' })
    }
}

export default connectDb(handler);

