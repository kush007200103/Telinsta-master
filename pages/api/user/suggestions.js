import connectDb from "../../../middleware/mongoose"
import User from '../../../models/User';

const handler = async (req, res) => {
    const suggestions = await User.find({ $and: [{ followers: { "$not": { "$in": [{ username: req.body.username, name: req.body.name }] } } }, { username: { "$ne": req.body.username } }] }).select(["-email", "-phone", "-password"]).limit(5);
    res.status(200).json({ suggestions })
}

export default connectDb(handler);
