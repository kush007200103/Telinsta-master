import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let value = req.body.search;
        const users = await User.find({ $or: [ { username: { "$regex":value, "$options": "i" } } ,{ name: { "$regex": value, "$options": "i" } }] }).select(["-email", "-phone", "-password"]).limit(6)
        res.status(200).json({ success: true, users })
        
    }
    else {
        res.status(400).json({ error: 'error', success:false })
    }
}

export default connectDb(handler);

