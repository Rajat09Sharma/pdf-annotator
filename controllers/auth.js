
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Token = require("../models/refreshToken");

const accessTokenSecret = process.env.JWT_ACCESS_SECRET_KEY;
const refreshTokenSecret = process.env.JWT_REFRESH_SECRET_KEY;

const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email address." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid password." });
        }


        const accessToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            accessTokenSecret,
            { expiresIn: "15m" }
        );


        const refreshToken = jwt.sign(
            { id: user._id, email: user.email, name: user.name },
            refreshTokenSecret,
            { expiresIn: "30m" }
        );


        await Token.create({ userId: user._id, token: refreshToken });


        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
          
        });

        return res.status(200).json({
            message: "User login successful.",
            token: accessToken,
            username: user.name,
        });

    } catch (error) {
        console.error("login handler error:", error.message);
        return res.status(500).json({ message: "Server error. Failed to login the user." });
    }
};


const signupHandler = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).json({ message: "Email address already exist." });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await User.create({ name, email, password: hashPassword });

        res.status(201).json({ message: "User signup successfully." });

    } catch (error) {
        console.log("signup handler error,", error.message);
        res.status(500).json({ message: "Server error. Failed to create the user, please try again later." })
    }
}

const logoutHandler = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await Token.deleteOne({ token: token });
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",

        });

        return res.status(200).json({ message: "User logout successfully." });
    } catch (error) {
        console.error("Logout error:", error.message);
        return res.status(500).json({ message: "Server error. Failed to logout." });
    }
};


const refreshTokenHandler = async (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No token provided." });
    }

    const storedToken = await Token.findOne({ token: token });
    if (!storedToken) {
        return res.status(401).json({ message: "Invalid token." });
    }
    try {
        const payload = jwt.verify(token, refreshTokenSecret);

        const newAccessToken = jwt.sign({
            id: payload.id,
            email: payload.email,
            name: payload.name
        }, accessTokenSecret, { expiresIn: "1m" });

        return res.status(200).json({ message: "Token refreshed successfully.", token: newAccessToken, username: payload.name });

    } catch (error) {
        console.log("refresh token error", error);
        return res.status(403).json({ message: "Token expired or invalid" });
    }
}

module.exports = {
    loginHandler,
    signupHandler,
    logoutHandler,
    refreshTokenHandler
}