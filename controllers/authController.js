
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

let refreshTokens = [];

const authController = {

    //Register

    // registerUser: async (req, res) => {
    //     try {
    //         console.log("Register body:", req.body);
    //         const salt = await bcrypt.genSalt(10);
    //         const hashed = await bcrypt.hash(req.body.password, salt);

    //         //Create new user
    //         const newUser = await new User({
    //             username: req.body.username,
    //             email: req.body.email,
    //             password: hashed,
    //         });

    //         //Save user to DB
    //         const user = await newUser.save();
    //         res.status(200).json(user);
    //     } catch (err) {
    //         res.status(500).json(err);
    //     }
    // },
    registerUser: async (req, res) => {
        try {
            console.log("Register body:", req.body);
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            return res.status(200).json(user);
        } catch (err) {
            console.error("Register Error Stack:", err.stack);
            return res.status(500).json({ message: "Register failed", error: err.message });
        }
    },


    //Genarate accsess token
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_ACCESS,
            { expiresIn: "40s" }
        );
    },

    //Genarate refresh token
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "365d" }
        );
    },

    //Login

    loginUser: async (req, res) => {
        try {
            console.log("🔥 Login route hit with email:", req.body.email);
            const user = await User.findOne({ email: req.body.email });
            // console.log("User found:", User);
            console.log("User.find().pretty()", User.find());
            if (!user) {
                return res.status(404).json("Incorrect email");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!validPassword) {
                return res.status(404).json("Incorrect password");
            }
            if (user && validPassword) {
                //Generate access token
                const accessToken = authController.generateAccessToken(user);
                //Generate refresh token
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                //STORE REFRESH TOKEN IN COOKIE
                // res.cookie("refreshToken", refreshToken, {
                //     httpOnly: true,
                //     secure: false,
                //     path: "/",
                //     sameSite: "strict",
                // });
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    path: "/",
                });

                console.log("NODE_ENV is:", process.env.NODE_ENV);

                const { password, ...others } = user._doc;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            console.log("Login Error Stack:", err

            );
            return res.status(500).json(err);
        }

    },


    //Redux

    requestRefreshToken: async (req, res) => {
        //Take refresh token from user
        const refreshToken = req.cookies.refreshToken;
        //Send error if token is not valid
        if (!refreshToken) return res.status(401).json("requestRefreshToken: You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (err, user) => {
            if (err) {
                console.log('requestRefreshToken error', err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            //create new access token, refresh token and send to user
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            console.log('newRefreshToken newRefreshToken newRefreshToken', newRefreshToken)
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            return res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },


    getProfile: async (req, res) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ message: 'Authentication required' });
            }

            jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, async (err, user) => {
                if (err) {
                    return res.status(403).json({ message: 'Invalid refresh token' });
                }

                const newAccessToken = authController.generateAccessToken(user);

                const currentUser = await User.findById(user.id);
                if (!currentUser) {
                    return res.status(404).json({ message: 'User not found' });
                }

                return res.json({
                    username: currentUser.username,
                    email: currentUser.email,
                    avatar: currentUser.avatar,
                    accessToken: newAccessToken,
                });
            });
        } catch (error) {
            console.error('Error retrieving user profile:', error);
            res.status(500).json({ message: 'Error retrieving profile' });
        }
    },


    // Log out

    logOut: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) return res.status(401).json("You're not authenticated");

        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
        res.clearCookie("refreshToken", { path: "/" });
        return res.status(200).json("Logged out successfully!");
    }


};

module.exports = authController;


