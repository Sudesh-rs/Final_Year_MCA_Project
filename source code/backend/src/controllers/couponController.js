const couponService = require("../services/CouponService");

class couponController {
  async applyCoupon(req, res) {
    try {
      const { apply, code } = req.query;

      const user = req.user; // populated by userAuthMiddleware
      console.log('Apply coupon called:', { apply, code, userId: user ? user._id : null });
      let cart;

      if (apply === "true") {
        cart = await couponService.applyCoupon(code, user);
      } else {
        cart = await couponService.removeCoupon(code, user);
      }

      return res.status(200).json(cart);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  // Create a coupon (admin)
  async createCoupon(req, res) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      return res.status(200).json(coupon);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  // Delete a coupon (admin)
  async deleteCoupon(req, res) {
    try {
      await couponService.deleteCoupon(req.params.id);
      return res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }

  // Get all coupons (admin)
  async getAllCoupons(req, res) {
    try {
      const coupons = await couponService.getAllCoupons();
      return res.status(200).json(coupons);
    } catch (error) {
      const status = error.statusCode || 500;
      return res.status(status).json({ error: error.message });
    }
  }
}


module.exports = new couponController();
