import cloudinary from 'cloudinary'
import connectDb from "../../../middleware/mongoose"
import User from '../../../models/User';

const handler = async (req, res) => {
    if (req.method === 'PUT') {
        let result, error = null;
        await cloudinary.v2.uploader.upload(req.body.file['data_url'],
            {
                public_id: 'telinsta/profile-pictures/' + req.body.name.split('.')[0] + Date.now(),
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME
            },
            function (err, resu) {
                error = err;
                result = resu;
            }
        );

        let user = await User.findOneAndUpdate({ username: req.body.username }, { profilepic: result.secure_url })
        res.status(200).json({ result, error, user, success: true })
    } else {
        res.status(500).json({ error: 'Internal Server Error', success: false })
    }

}

export default connectDb(handler);
