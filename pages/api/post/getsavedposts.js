import Post from '../../../models/Post'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let posts = await Post.find({ savedBy: { "$in": [req.body.username] } });
        res.status(200).json({ posts, success: true });
    }
    else {
        res.status(400).json({ error: 'error', success: false })
    }
}

export default connectDb(handler);

