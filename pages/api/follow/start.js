import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const reqBy = await User.findOne({ username: req.body.reqBy });
        const reqTo = await User.findOne({ username: req.body.reqTo });

        let updateFollowing = reqBy.following;
        let requestedTo = reqTo.username;
        let updateFollower = reqTo.followers;
        let requestedBy = reqBy.username;

        if (!updateFollowing.includes(requestedTo) && !updateFollower.includes(requestedBy)) {
            updateFollowing.push(requestedTo);
            await User.findOneAndUpdate({ username: req.body.reqBy }, { following: updateFollowing });
            
            updateFollower.push(requestedBy);
            await User.findOneAndUpdate({ username: req.body.reqTo }, { followers: updateFollower })
        }

        res.status(200).json({ success: true })
    }
    else {
        res.status(400).json({ success: false, error: 'Some error occurred!' })
    }
}

export default connectDb(handler);

