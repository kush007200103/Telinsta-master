import connectDb from "../../../middleware/mongoose"
import Post from '../../../models/Post';

// const compare = (obj1, obj2)=>{
//     return obj1.updatedAt-obj2.updatedAt
// }

const handler = async (req, res) => {
    const posts = await Post.find();
    // posts.sort(compare);
    // console.log(posts);
    res.status(200).json({posts})
}

export default connectDb(handler);
