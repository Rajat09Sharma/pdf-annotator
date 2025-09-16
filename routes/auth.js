const express = require("express");
const { loginHandler, signupHandler, logoutHandler, refreshTokenHandler } = require("../controllers/auth");
const router = express.Router();

router.post("/login", loginHandler);
router.post("/signup", signupHandler);
router.post("/logout", logoutHandler);
router.get("/refresh", refreshTokenHandler);

module.exports = router;