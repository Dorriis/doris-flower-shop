const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../models/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {
    getAllBlogs,
    createBlog,
    updateBlog,
    deleteBlog,
} = require('../controllers/blogController');


// Multer storage configuration for file upload
const blogStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Img-Blogs',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

// Multer middleware
const uploadBlog = multer({ blogStorage });
router.get('/', getAllBlogs);
router.post('/', uploadBlog.single('img'), createBlog);
router.put('/:id', uploadBlog.single('img'), updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;


