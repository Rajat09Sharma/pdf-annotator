require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const UserRouter = require("./routes/user");

const app = express();
const PORT = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "https://pdf-anno.netlify.app",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
}));

app.use(express.static('public'));
app.use("/user", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://pdf-anno.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
}, express.static(path.join(__dirname, "public/uploads")));

app.use("/auth", authRouter);
app.use("/user", UserRouter);

app.listen(PORT, () => {
    console.log(`Server started successfully on ${PORT}.`);
})