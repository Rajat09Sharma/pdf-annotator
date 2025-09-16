const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const bearerToken = req.headers["authorization"];

    if (!bearerToken) {
        return res.status(401).json({ message: "No token provided." });
    }

    const accessToken = bearerToken.split(" ")[1];
    const accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;

    try {
        const data = jwt.verify(accessToken, accessTokenSecret);
        req.user = {
            id: data.id,
            email: data.email,
            name: data.name
        }
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
