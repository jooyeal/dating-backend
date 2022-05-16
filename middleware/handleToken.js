const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const bearerToken = req.headers.token;
        !bearerToken && res.status(403).json("token is not exist");

        const token = bearerToken.split(" ")[1];
        jwt.verify(token,process.env.JWT_KEY, (err, user) => {
            err && res.status(403).json("token is not valid");
            req.valid = user;
            next();
        })
    } catch(err) {
        res.status(500).json(err);
    }
}

module.exports = {verifyToken};