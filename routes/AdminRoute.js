const express = require('express');
const adminController = require('../controllers/AdminController');
const { verifyJWTToken, isAdmin } = require('../middlewares/JWTAuth'); // Ensure the user is authenticated and an admin
const router = express.Router();

// Route to add a new plan (only for admins)
router.post('/add-plan', verifyJWTToken, isAdmin, adminController.addPlan);
router.get('/', adminController.getPlans);

// Route to assign a plan to a user (can be accessed by any authorized user)


module.exports = router;
