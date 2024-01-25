const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    users: { type: Array, required: true},
    messages: { type: Array, default: [] }
}, { timestamps: true });


export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
