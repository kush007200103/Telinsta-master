import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        await User.findOneAndUpdate({ username: req.body.username }, { name: req.body.name, bio: req.body.bio })
        const user = await User.findOne({username:req.body.username});
        res.status(200).json({success:true, user})
    }
    else {
        res.status(400).json({ success:false ,error:'Some error occurred!'})
    }
}

export default connectDb(handler);

