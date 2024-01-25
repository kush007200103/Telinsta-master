const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    username: { type: String, required: true },
    imgLinks: { type: Array, required: true, unique: true },
    desc: { type: String, default: '' },
    likes: { type: Array, default: [] },
    savedBy: { type: Array, default: [] }
}, { timestamps: true });


export default mongoose.models.Post || mongoose.model('Post', PostSchema);
