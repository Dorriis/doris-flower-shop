const Blogs = require('../models/blogModel');

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.find();
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const createBlog = async (req, res) => {
    const { img, title, text } = req.body;

    let imagePath;

    if (req.file) {
        imagePath = req.file.path;
    } else if (img) {
        imagePath = img;
    } else {
        return res.status(400).json({ message: 'Please provide either an image file or a URL' });
    }

    const newBlog = new Blogs({
        title,
        img: imagePath,
        text,
    });

    try {
        const savedBlog = await newBlog.save();
        res.status(201).json({ message: 'Blog created successfully', blog: savedBlog });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const updateBlog = async (req, res) => {
    const { title, imgURL, text } = req.body;

    try {
        const blog = await Blogs.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });

        if (title) blog.title = title;
        if (text) blog.text = text;

        if (req.file) {
            blog.img = req.file.path;
        } else if (imgURL) {
            blog.img = imgURL;
        }

        const updatedBlog = await blog.save();
        res.json({ message: 'Blog updated successfully', blog: updatedBlog });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const result = await Blogs.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
};
