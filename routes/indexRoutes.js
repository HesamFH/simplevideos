const { Router } = require("express");
const indexController = require("../controllers/indexController");
const { isAuthenticated } = require("../middlewares/isUserAuthenticated");

const router = new Router();

//! Route "/"
//! HTTP Method "Get"
router.get("/", indexController.getIndex);

//! Route "/login"
//! HTTP Method "Get"
router.get("/login", indexController.getLogin);

//! Route "/register"
//! HTTP Method "Get"
router.get("/register", indexController.getRegister);

//! Route "/video"
//! HTTP Method "Get"
//! Param "Id" i required
router.get("/video/:id", indexController.getVideo);

//! Route "/playvideo"
//! HTTP Method "Get"
//! Param "Id" is required
router.get("/playvideo/:id", indexController.playVideo);

//! Route "/search"
//! HTTP Method "Get"
//! Param "Search is required"
router.get("/search/:search", indexController.getSearch);

//! Route "/dashboard"
//! HTTP Method "Get"
router.get("/dashboard", isAuthenticated, indexController.getDashboard);

//! Route "/dashboard/upload"
//! HTTP Method "Get"
router.get("/dashboard/upload", isAuthenticated, indexController.getUpload);

module.exports = router;
