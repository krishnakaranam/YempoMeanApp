const express = require("express");
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

router.get("/profile/:userId", checkAuth, UserController.user_profile);

//router.post("/connect/twitter", checkAuth, UserController.user_connect_twitter);

module.exports = router;
