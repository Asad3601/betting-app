const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {verifyJWTToken,isAdmin,isUser}=require('../middlewares/JWTAuth')


// Routes for user operations
router.post("/signup", userController.signupUser);
router.post("/signin", userController.signinUser);
router.get("/profile",verifyJWTToken,isUser, userController.userProfile);
// router.get("/create-order", userController.createOrder);

router.post('/assign-plan', verifyJWTToken, userController.assignPlanToUser);



module.exports = router;
