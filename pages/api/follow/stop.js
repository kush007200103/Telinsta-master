import User from '../../../models/User'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        const user = await User.findOne({ username: req.body.username });
        const following = await User.findOne({ username: req.body.following });

        let updateFollowing = user.following;
        let requestedBy = user.username;
        let updateFollower = following.followers;
        let requestedFor = following.username;

        if (updateFollowing.includes(requestedFor)) {
            updateFollowing = updateFollowing.filter(obj => obj !== requestedFor);
            await User.findOneAndUpdate({ username: user.username }, { following: updateFollowing });
        }

        if (updateFollower.includes(requestedBy)) {
            updateFollower = updateFollower.filter(obj => obj !== requestedBy);
            await User.findOneAndUpdate({ username: following.username }, { followers: updateFollower })
        }

        res.status(200).json({ success: true })


    }
    else {
        res.status(400).json({ success: false, error: 'Some error occurred!' })
    }
}

export default connectDb(handler);

