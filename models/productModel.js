const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    img: {
        type: String,
        required: true,
    },
    slogan: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative'],
    },
    oldPrice: {
        type: Number,
        default: null,
        min: [0, 'Price cannot be negative'],
    },
    catalog: {
        type: String,
        required: true,
        trim: true,
    },
    condition: {
        type: String,
        enum: ['New', 'Sale', 'Best Sale', 'Coming Soon', 'Unknown'],
        default: 'Unknown',
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Products', productSchema);
