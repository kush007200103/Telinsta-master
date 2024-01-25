import connectDb from "../../../middleware/mongoose"
import Post from '../../../models/Post';

const handler = async (req, res) => {
    const posts = await Post.find({ username: req.body.username });
    res.status(200).json({ posts , success:true})
}

export default connectDb(handler);
