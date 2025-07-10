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



// // Get all products
// router.get('/', async (req, res) => {
//     try {
//         const products = await Product.find();
//         res.json(products);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// //Get product by Id
// router.get('/:id', async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: 'Product not found' });
//         res.json(product);
//     } catch (err) {
//         console.error('Error retrieving product:', err);
//         res.status(500).json({ message: err.message });
//     }
// });

// // Post new product (either file upload or URL for image)
// router.post('/', upload.single('img'), async (req, res) => {
//     const { name, description, price, catalog, condition, color, slogan, oldPrice, img } = req.body;
//     if (!name || !catalog || !condition) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     let imagePath;

//     if (req.file) {
//         imagePath = req.file.path;
//     } else if (img) {
//         imagePath = img;
//     } else {
//         return res.status(400).json({ message: 'Please provide either an image file or a URL ' });
//     }
//     if (!catalog || !condition) {
//         return res.status(400).json({ message: 'Catalog and condition are required' });
//     }

//     const product = new Product({
//         name,
//         img: imagePath,
//         description,
//         price,
//         catalog,
//         condition,
//         color,
//         slogan,
//         oldPrice: oldPrice || null,
//     });

//     try {
//         const newProduct = await product.save();
//         res.status(201).json({ message: 'Product created successfully', product: newProduct });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // Patch (update) existing product
// router.put('/:id', upload.single('img'), async (req, res) => {
//     const { name, description, price, catalog, condition, color, slogan, oldPrice, imgURL } = req.body;

//     try {
//         const product = await Product.findById(req.params.id);
//         if (!product) return res.status(404).json({ message: 'Product not found' });

//         if (name) product.name = name;
//         if (description) product.description = description;
//         if (price) product.price = price;
//         if (catalog) product.catalog = catalog;
//         if (condition) product.condition = condition;
//         if (color) product.color = color;
//         if (slogan) product.slogan = slogan;
//         if (oldPrice !== undefined) product.oldPrice = oldPrice;

//         if (req.file) {
//             product.img = `uploads/${req.file.filename}`;
//         } else if (imgURL) {
//             product.img = imgURL;
//         }

//         const updatedProduct = await product.save();
//         res.json({ message: 'Product updated successfully', product: updatedProduct });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // Delete product
// router.delete('/:id', async (req, res) => {
//     try {

//         const result = await Product.deleteOne({ _id: req.params.id });

//         if (result.deletedCount === 0) {
//             return res.status(404).json({ message: 'Product not found' });
//         }

//         res.json({ message: 'Product deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;
