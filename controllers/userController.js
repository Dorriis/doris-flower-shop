
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userCotroller = {

    //Get all user
    getAllUsers: async (req, res) => {
        try {
            const user = await User.find()
            return res.status(200).json(user)

        } catch (error) {
            return res.status(500).json(error)
        }
    },

    findUserById: async (req, res, next) => {
        const userId = req.params.userId;
        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error('Error finding user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Edit User

    EditUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { email, username, password, avatar } = req.body;

            if (email) {
                const existingUser = await User.findOne({ email });
                if (existingUser && existingUser._id.toString() !== id) {
                    return res.status(400).json({ msg: 'Email already in use' });
                }
            }

            let updateUser = { username, email, avatar };

            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateUser.password = await bcrypt.hash(password, salt);
            }

            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            if (req.body.productId && req.body.action) {
                const { productId, action } = req.body;
                if (action === 'add') {
                    if (!user.cart.includes(productId)) {
                        user.cart.push(productId);
                    }
                } else if (action === 'remove') {
                    user.cart = user.cart.filter(item => item.toString() !== productId);
                }
            }

            const updatedUser = await User.findByIdAndUpdate(id, updateUser, { new: true });
            updatedUser.cart = user.cart;

            await user.save();

            res.status(200).json(updatedUser);

        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ msg: 'Internal Server Error', error: error.message });
        }
    },

    // Add to cart 
    addToCart: async (req, res) => {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'ProductId is required' });
        }

        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!user.cart) {
                user.cart = [];
            }

            const existingItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

            if (existingItemIndex > -1) {
                user.cart[existingItemIndex].quantity += quantity;
            } else {
                user.cart.push({ productId, quantity });
            }

            await user.save();
            res.status(200).json({ message: 'Product added to cart', cart: user.cart });
        } catch (error) {
            console.error('Error adding product to cart', error);
            res.status(500).json({ error: 'Error adding product to cart' });
        }
    },


    //Get information products

    getUserCart: async (req, res) => {
        console.log("Fetching cart for:", req.params.userId);
        try {
            const userId = req.params.userId;

            const user = await User.findById(userId).populate('cart.productId');

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const cartItems = user.cart || [];
            const products = cartItems.map(item => {
                if (item && item.productId) {
                    return {
                        id: item.productId._id,
                        name: item.productId.name,
                        price: item.productId.price,
                        img: item.productId.img,
                        quantity: item.quantity,
                    };
                } else {
                    console.warn('Cart item is undefined or missing productId:', item);
                    return null;
                }
            }).filter(Boolean);

            return res.status(200).json(products);
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: "Error fetching cart" });
        }
    },


    // Save product in cart 
    updateCart: async (req, res) => {
        const { userId, productId } = req.params;
        const { newQuantity } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }


        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const product = user.cart.find(item => item.productId.toString() === productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found in cart' });
            }

            product.quantity = newQuantity;
            await user.save();
            res.json({ message: 'Product quantity updated successfully' });
        } catch (error) {
            console.error('Error updating product quantity:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    removeCartItem: async (req, res) => {
        const userId = req.params.userId;
        const productId = req.params.productId;


        if (!userId || !productId) {
            return res.status(400).send('User ID or Product ID is missing');
        }

        try {

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }

            const cartItemIndex = user.cart.findIndex(item => item.productId.toString() === productId);

            if (cartItemIndex === -1) {
                return res.status(404).send('Product not found in cart');
            }

            user.cart.splice(cartItemIndex, 1);

            await user.save();

            return res.status(200).send('Product removed from cart successfully');
        } catch (error) {
            console.error('Error removing product from cart:', error);
            return res.status(500).send('Server error');
        }
    },

    //Get billingDetails

    getUserBillingDetails: async (req, res) => {
        const userId = req.params.userId;

        try {
            const user = await User.findById(userId).populate('billingDetails');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const billingDetails = user.billingDetails || {};
            res.status(200).json({ billingDetails });
        } catch (error) {
            console.error('Error fetching billing details:', error);
            res.status(500).json({ message: 'Error fetching billing details', error });
        }
    },

    postUserBillingDetails: async (req, res) => {
        const user = req.user;
        const { firstName, lastName, streetAddress, province, phone, email, deliveryDate, time, additionalInfo } = req.body;

        user.billingDetails = {
            firstName,
            lastName,
            streetAddress,
            province,
            phone,
            email,
            deliveryDate,
            time,
            additionalInfo
        };

        try {
            await user.save();
            res.status(200).json({ message: 'Billing details saved successfully', billingDetails: user.billingDetails });
        } catch (error) {
            console.error('Error saving billing details:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //Edit information BillingDetails

    editBillingDetails: async (req, res) => {
        const userId = req.params.userId;

        try {

            const { firstName, lastName, streetAddress, province, phone, email } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }


            if (firstName) user.billingDetails.firstName = firstName;
            if (lastName) user.billingDetails.lastName = lastName;
            if (streetAddress) user.billingDetails.streetAddress = streetAddress;
            if (province) user.billingDetails.province = province;
            if (phone) user.billingDetails.phone = phone;
            if (email) user.billingDetails.email = email;

            await user.save();

            res.status(200).json({ message: 'Billing details updated successfully', billingDetails: user.billingDetails });
        } catch (error) {
            console.error('Error updating billing details:', error);
            res.status(500).json({ message: 'Error updating billing details', error });
        }
    },

    //Get informations payment

    getPayments: async (req, res) => {
        const userId = req.params.userId;
        const cardId = req.query.cardId;

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (cardId) {

                const card = user.paymentInfo.find(card => card._id.toString() === cardId);
                if (!card) {
                    return res.status(404).json({ message: 'Card not found' });
                }
                return res.status(200).json({ card });
            } else {
                res.status(200).json({ paymentInfo: user.paymentInfo });
            }
        } catch (error) {
            console.error('Error fetching payment information:', error);
            res.status(500).json({ message: 'Error fetching payment information', error });
        }
    },


    savePayments: async (req, res) => {
        const user = req.user;
        const { cardNumber, nameOnCard, expirationDate, cvv } = req.body;
        const formattedExpirationDate = `${expirationDate.month} ${expirationDate.year}`;

        const newCard = {
            cardNumber,
            nameOnCard,
            expirationDate: formattedExpirationDate,
            cvv
        };

        user.paymentInfo.push(newCard);

        try {
            await user.save();
            res.status(200).json({ message: 'Payment info saved successfully', paymentInfo: user.paymentInfo });
        } catch (error) {
            console.error('Error saving payment info:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },



    //Edit information payments

    editPayment: async (req, res) => {
        const userId = req.params.userId;
        const cardId = req.params.cardId;

        try {
            const { nameOnCard, cardNumber, cvv, expirationDate } = req.body;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const cardIndex = user.paymentInfo.findIndex(card => card._id.toString() === cardId);

            if (cardIndex === -1) {
                return res.status(404).json({ message: 'Card not found' });
            }


            if (nameOnCard !== undefined) user.paymentInfo[cardIndex].nameOnCard = nameOnCard;
            if (cardNumber !== undefined) user.paymentInfo[cardIndex].cardNumber = cardNumber;
            if (cvv !== undefined) user.paymentInfo[cardIndex].cvv = cvv;
            if (expirationDate !== undefined) user.paymentInfo[cardIndex].expirationDate = expirationDate;

            await user.save();

            res.status(200).json({ message: 'Payment information updated successfully', paymentInfo: user.paymentInfo[cardIndex] });
        } catch (error) {
            console.error('Error updating payment information:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    deletePayment: async (req, res) => {
        const userId = req.params.userId;
        const cardId = req.params.cardId;

        if (!cardId) {
            return res.status(400).json({ message: 'Card ID is required' });
        }

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const cardIndex = user.paymentInfo.findIndex(card => card._id.toString() === cardId);

            if (cardIndex === -1) {
                return res.status(404).json({ message: 'Card not found' });
            }

            user.paymentInfo.splice(cardIndex, 1);
            await user.save();

            res.status(200).json({ message: 'Card deleted successfully' });
        } catch (error) {
            console.error('Error deleting payment information:', error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
};



module.exports = userCotroller;