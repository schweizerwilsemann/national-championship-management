import { timeStamp } from "console";
import mongoose from "mongoose";


const postChema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    } ,
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://bs-uploads.toptal.io/blackfish-uploads/components/blog_post_page/8969409/cover_image/optimized/unnamed-76880e314ca9bcaa0e0e19be57d2e75d.png'
    },
    category: {
        type: String,
        default: 'uncategorized',
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps:true});

const Post = mongoose.model('Post', postChema);
export default Post;