import connectDb from "../../../middleware/mongoose"
import Chat from '../../../models/Chat'

const handler = async (req, res) => {
    try {
        if (req.method === "POST") {
            const { users } = req.body;
            let room = await Chat.findOne({ users });
            if (room) {
                res.status(200).json({ success: true, room: room._id, messages: room.messages })
            }
            else {
                room = new Chat({ users })
                await room.save((err) => {
                    res.status(200).json({ success: false , error:err})
                });
                res.status(200).json({ success: true, room: room._id, messages: room.messages })
            }
        }
        else {
            res.status(400).json({ success: false, error: "This method is not allowed!" })
        }
    } catch (error) {
        res.status(400).json({ success: false, error: "Some error occurred!" })
    }
}

export default connectDb(handler);
