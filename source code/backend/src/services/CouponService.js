const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const CartService = require('./CartService');
const mongoose = require('mongoose');
const CouponNotValidException = require('../exceptions/CouponNotValidException');

const couponService = {
  /**
   * Apply a coupon to the user's cart
   * @param {String} code - Coupon code
   * @param {Object} user - User object (mongoose document)
   * @throws {CouponNotValidException} - Throws an exception if coupon is not valid
   */
  async applyCoupon(code, user) {
    try {
      // Find coupon by code
      const coupon = await Coupon.findOne({ code });

      if (!coupon) {
        throw new CouponNotValidException('Coupon not found');
      }

      if (!user) {
        throw new CouponNotValidException('User not found');
      }

      const cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        throw new CouponNotValidException('Cart not found');
      }

      const items = await CartItem.find({ cart: cart._id });
      const currentCartTotal = items.reduce(
        (sum, it) => sum + (it.sellingPrice || 0) * (it.quantity || 1),
        0
      );

      console.log('Coupon apply debug:', { cartTotal: currentCartTotal, discountPercent: coupon.discountPercentage });

      // Check if coupon already used by this user (support both schemas)
      if ((coupon.usedByUsers && coupon.usedByUsers.includes(user._id)) ||
          (user.usedCoupons && user.usedCoupons.includes(coupon._id))) {
        throw new CouponNotValidException('Coupon already used');
      }

      if (currentCartTotal < coupon.minimumOrderValue) {
        throw new CouponNotValidException(
          `Valid for minimum order value ₹${coupon.minimumOrderValue}`
        );
      }

      const currentDate = new Date();

      if (
        coupon.isActive &&
        currentDate >= coupon.validityStartDate &&
        currentDate <= coupon.validityEndDate
      ) {
        // Mark coupon used for both coupon and user for consistency
        if (!coupon.usedByUsers) coupon.usedByUsers = [];
        coupon.usedByUsers.push(user._id);
        await coupon.save();

        if (!user.usedCoupons) user.usedCoupons = [];
        user.usedCoupons.push(coupon._id);
        await user.save();

        // Calculate discounted price and update cart
        const discount = Math.round((currentCartTotal * coupon.discountPercentage) / 100);
        console.log('CouponService: before apply', { totalSellingPrice: currentCartTotal, discount, couponCode: code });
        cart.couponCode = code;
        cart.couponPrice = discount;
        await cart.save();

        // Return fresh cart computed from cart items and couponPrice
        const refreshedCart = await CartService.findUserCart(user);
        console.log('CouponService: after apply', { totalSellingPrice: refreshedCart.totalSellingPrice, couponPrice: refreshedCart.couponPrice, couponCode: refreshedCart.couponCode });
        return refreshedCart;
      }

      throw new CouponNotValidException('Coupon is not active or not within validity period');
    } catch (error) {
      throw new Error(error.message);
    }
  },

 
  async removeCoupon(code, user) {
    try {
      const coupon = await Coupon.findOne({ code });

      if (!coupon) {
        throw new Error('Coupon not found');
      }

      const cart = await Cart.findOne({ user: user._id });

      if (!cart) {
        throw new Error('Cart not found');
      }

      // Remove usage record
      if (coupon.usedByUsers) {
        coupon.usedByUsers = coupon.usedByUsers.filter((userId) => !userId.equals(user._id));
        await coupon.save();
      }

      if (user.usedCoupons) {
        user.usedCoupons = user.usedCoupons.filter((usedCoupon) => !usedCoupon.equals(coupon._id));
        await user.save();
      }

      console.log('CouponService: before remove', { totalSellingPrice: cart.totalSellingPrice, couponPrice: cart.couponPrice });
      cart.couponCode = null;
      cart.couponPrice = 0;
      await cart.save();

      const refreshedCart = await CartService.findUserCart(user);
      console.log('CouponService: after remove', { totalSellingPrice: refreshedCart.totalSellingPrice, couponPrice: refreshedCart.couponPrice });
      return refreshedCart;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Create a new coupon (admin only)
   * @param {Object} couponData - Coupon data (mongoose document)
   * @returns {Object} - Newly created coupon
   */
  async createCoupon(couponData) {
    try {
      const newCoupon = new Coupon(couponData);
      return await newCoupon.save();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Delete a coupon by ID (admin only)
   * @param {String} couponId - Coupon ID
   */
  async deleteCoupon(couponId) {
    try {
      await Coupon.findByIdAndDelete(couponId);
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Get all coupons (admin only)
   * @returns {Array} - List of all coupons
   */
  async getAllCoupons() {
    try {
      return await Coupon.find();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  /**
   * Get a coupon by ID
   * @param {String} couponId - Coupon ID
   * @returns {Object|null} - Coupon object or null if not found
   */
  async getCouponById(couponId) {
    try {
      return await Coupon.findById(couponId);
    } catch (error) {
      throw new Error('Coupon not found');
    }
  }
};

module.exports = couponService;
