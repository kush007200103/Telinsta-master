import Post from '../../../models/Post'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        let id = req.body.id;
        const post = await Post.findById(id);
        if (post) {
            let savedBy = post.savedBy;
            let requestedBy = req.body.reqBy;
            let found = savedBy.includes(requestedBy);
            if (!found) {
                savedBy.push(requestedBy);
                await Post.findByIdAndUpdate(id, { savedBy: savedBy});
            }
            else{
                savedBy = savedBy.filter(word => word !== req.body.reqBy);
                await Post.findByIdAndUpdate(id, { savedBy: savedBy });
            }
            res.status(200).json({ success: true, found })
        }
        else {
            res.status(200).json({ success: false })
        }
    }
    else {
        res.status(400).json({ success: false, error: 'Some error occurred!' })
    }
}

export default connectDb(handler);

