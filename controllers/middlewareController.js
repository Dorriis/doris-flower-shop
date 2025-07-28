const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(" ")[1];
    const refreshToken = req.cookies.refreshToken;

    if (!token || !refreshToken) {
        return res.status(401).json("You're not authenticated");
    }

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET_ACCESS, (err, user) => {
            if (err) {
                console.log("Access token expired. Checking refresh token...");
                if (!refreshToken) return res.status(403).json("Access token is not valid and no refresh token provided.");
                jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (err, user) => {
                    if (err) return res.status(403).json("Refresh token is not valid!");
                    req.user = user;
                    next();
                });
            } else {
                req.user = user;
                next();
            }
        });
    } else if (refreshToken) {
        jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN, (err, user) => {
            if (err) return res.status(403).json("Refresh token is not valid!");
            req.user = user;
            next();
        });
    }
};

const verifyTokenAndAdminAuth = (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(403).json("You're not allowed to do that!");
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAdminAuth
};