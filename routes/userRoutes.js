const router = require("express").Router();
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController')
const { verifyToken } = require('../controllers/middlewareController')


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);


//Refresh
router.post('/refresh', authController.requestRefreshToken);
router.get('/profile', authController.getProfile);

//Log out
router.post("/logout", verifyToken, authController.logOut);
router.get('/test', (req, res) => {
    res.json({ message: 'User route working!' });
});

module.exports = router;