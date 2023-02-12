const { Router } = require("express");
const userController = require("../controllers/userController");
const { isAuthenticated } = require("../middlewares/isUserAuthenticated");

const router = new Router();

//! Route "/users/register"
//! Method "Post"
router.post("/register", userController.registerUser);

//! Route "/users/login"
//! Method "Post"
router.post("/login", userController.loginUser, userController.rememberUser);

//! Route "/users/uploadvideo"
//! Method "Post"
router.post("/uploadvideo", isAuthenticated, userController.uploadVideo);

module.exports = router;
