const router = require('express').Router();
const userCotroller = require('../controllers/userController');
// const { verifyToken, verifyTokenAndAdminAuth, } = require('../controllers/middlewareController')

//Edit user
router.put('/:id', userCotroller.EditUser);

// Get cart items for a specific user
router.get('/:userId/cart', userCotroller.getUserCart);

// Add a product to cart
router.post('/:userId/cart/add', userCotroller.addToCart);

// Update cart items
router.put('/:userId/cart/update/:productId', userCotroller.updateCart);
//Delete cart items
router.delete('/:userId/cart/remove/:productId', userCotroller.removeCartItem);

//Uploads billingDetails
router.post('/:userId/billing-details', userCotroller.findUserById, userCotroller.postUserBillingDetails);
router.get('/:userId/billing-details', userCotroller.getUserBillingDetails);
router.put('/:userId/billing-details/edit', userCotroller.findUserById, userCotroller.editBillingDetails);

//Uploads payments
router.post('/:userId/payment', userCotroller.findUserById, userCotroller.savePayments);
router.get('/:userId/payment', userCotroller.getPayments);
router.put('/:userId/payment/:cardId', userCotroller.findUserById, userCotroller.editPayment);
router.delete('/:userId/payment/delete/:cardId', userCotroller.findUserById, userCotroller.deletePayment);
// router.get('/:userId/cards', userCotroller.findUserById, userCotroller.getCards);
//Get all user
router.get('/', userCotroller.getAllUsers);



module.exports = router;