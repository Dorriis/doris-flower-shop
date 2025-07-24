const express = require('express');
const multer = require('multer');
const router = express.Router();
const cloudinary = require('../models/cloudinaryConfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');


// Multer storage configuration for file upload
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'Img-Products',
        allowed_formats: ['jpg', 'jpeg', 'png'],
    },
});

const upload = multer({ storage });

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', upload.single('img'), createProduct);
router.put('/:id', upload.single('img'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;



