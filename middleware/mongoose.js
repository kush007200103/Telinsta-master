import mongoose from 'mongoose'

const connectDb = handler => async (req, res) => {
    if (mongoose.connections[0].readyState) {
        // console.log('mongoose connected');
        return handler(req, res)
    }
    mongoose.connect(process.env.MONGO_URI)
    // console.log('mongoose connected successfully');
    return handler(req, res);
}

export default connectDb;