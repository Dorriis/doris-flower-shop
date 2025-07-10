
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    cart: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ],

    billingDetails: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        streetAddress: {
            type: String,
            required: true,
        },
        province: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        additionalInfo: {
            type: String,
            default: '',
        },
        deliveryDate: {
            type: Date,
            required: false,
        },
        time: {
            type: String,
            required: false,
        }

    },

    paymentInfo: [
        {
            nameOnCard: {
                type: String,
                required: false,
            },
            cardNumber: {
                type: String,
                required: false,
                set: (value) => {
                    return value ? `${value.slice(0, 4)}${'*'.repeat(value.length - 8)}${value.slice(-4)}` : '';
                },
            },
            cvv: {
                type: String,
                required: false,
                set: (value) => '***'
            },
            expirationDate: {
                month: { type: Number, required: false },
                year: { type: Number, required: false },
            }
        }
    ]
}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);



