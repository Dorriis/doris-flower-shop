const mongoose = require('mongoose');

const BlogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    }

}, { timestamps: true });

module.exports = mongoose.model('Blogs', BlogsSchema);
