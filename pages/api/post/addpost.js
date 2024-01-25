import cloudinary from 'cloudinary'
import connectDb from "../../../middleware/mongoose"
import Post from '../../../models/Post';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        let results = [], error = null;
        for (let i = 0; i < req.body.files.length; i++) {
            await cloudinary.v2.uploader.upload(req.body.files[i]['data_url'],
                {
                    public_id: 'telinsta/' + req.body.names[i].split('.')[0] + Date.now(),
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME
                },
                function (err, result) {
                    error = err;
                    results.push(result);
                }
            );
        }

        let post = {};
        if (error === undefined) {
            let imgLinks = [];
            for (let img of results) {
                imgLinks.push(img.secure_url);
            }

            post = new Post({
                username:req.body.username,
                imgLinks,
                desc: req.body.desc
            })
            await post.save()
        }
        res.status(200).json({ results, error, post, success:true })
    } else {
        res.status(500).json({ error: 'Internal Server Error' , success:false})
    }

}

export default connectDb(handler);
