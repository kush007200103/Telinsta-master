const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    profilepic: { type: String, default: 'https://res.cloudinary.com/dbfbhe5e1/image/upload/v1653933010/telinsta.jpg' },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    bio: { type: String, default: '' },
    followers: { type: Array, default: [] },
    following: { type: Array, defautl: [] }
}, { timestamps: true });


export default mongoose.models.User || mongoose.model('User', UserSchema);
