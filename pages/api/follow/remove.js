import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const user = await User.findOne({ username: req.body.username });
        const follower = await User.findOne({ username: req.body.follower });

        let updateFollower = user.followers;
        let requestedBy = user.username;
        let updateFollowing = follower.following;
        let requestedFor = follower.username;

        if (updateFollowing.includes(requestedBy)) {
            updateFollowing = updateFollowing.filter(obj => obj !== requestedBy);
            await User.findOneAndUpdate({ username: follower.username }, { following: updateFollowing });
        }

        if (updateFollower.includes(requestedFor)){
            updateFollower = updateFollower.filter(obj => obj !== requestedFor);
            await User.findOneAndUpdate({ username: user.username }, { followers: updateFollower })
        }

        res.status(200).json({ success: true })
    }
    else {
        res.status(400).json({ success: false, error: 'Some error occurred!' })
    }
}

export default connectDb(handler);

