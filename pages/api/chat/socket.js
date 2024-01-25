import { Server } from 'socket.io'
import Chat from '../../../models/Chat'

const SocketHandler = (req, res) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
    } else {
        console.log('Socket is initializing')
        const io = new Server(res.socket.server,{ cors: { origin: '*' } })
        res.socket.server.io = io

        io.on('connection', socket => {
            socket.on('join_room', (room) => {
                socket.join(room);
            })

            socket.on('send_message', async ({ data, room }) => {
                socket.to(room).emit('receive_message', { data, room });
                let chat = await Chat.findById(room);
                let newMsg = chat.messages;
                newMsg.push(data);
                await Chat.findByIdAndUpdate(room, { messages: newMsg });
            })
        })
    }
    res.end()
}

export default SocketHandler