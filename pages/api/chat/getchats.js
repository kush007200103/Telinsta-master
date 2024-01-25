import Chat from '../../../models/Chat'
import connectDb from "../../../middleware/mongoose"

const handler = async (req, res) => {
    if (req.method == 'POST') {
        let chats = await Chat.find({ users: { "$in" : [req.body.username]} });
        res.status(200).json(chats);
    }
    else {
        res.status(400).json({ error: 'error' })
    }
}

export default connectDb(handler);

