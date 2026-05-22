// routes/adminCouponRoutes.js
const express = require('express');
const couponController = require('../controllers/couponController');
const userAuthMiddleware = require('../middlewares/userAuthMiddleware');
const router = express.Router();

// Route to apply or remove coupon (requires authenticated user)
router.post('/apply', userAuthMiddleware, couponController.applyCoupon);

// Admin routes
router.post('/admin/create', couponController.createCoupon);
router.delete('/admin/delete/:id', couponController.deleteCoupon);
router.get('/admin/all', couponController.getAllCoupons);

module.exports = router;
