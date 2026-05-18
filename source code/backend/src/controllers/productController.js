const Product = require("../models/Product");
const Seller = require("../models/Seller");
const ProductService = require("../services/ProductService");
const { createProductSchema } = require("../validators/productValidators");
const Yup = require("yup");

class SellerProductController {
  async getProductBySellerId(req, res) {
    try {
      const seller = await req.seller;

      const products = await ProductService.getProductBySellerId(seller._id);
      res.status(200).json( products );
    } catch (error) {
      // console.log("------ ");
      res.status(400).json({ error: error.message });
    }
  }

  // Create a product
  async createProduct(req, res) {
    try {
      await createProductSchema.validate(req.body, { abortEarly: false });

      const seller = await req.seller;

      const product = await ProductService.createProduct(req.body, seller);
      return res.status(201).json(product);
    } catch (error) {
      // console.log("------------- ",error.message)
     
      if (error instanceof Yup.ValidationError) {
        return res.status(400).json({
          error: "Validation error",
          errors: error.errors,
          count: error.errors.length,
        });
      }
      res.status(400).json({ error: error.message });
     
    }
  }

  // Delete a product
  async deleteProduct(req, res) {
    try {
      await ProductService.deleteProduct(req.params.productId);
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update a product
  async updateProduct(req, res) {
    try {
      const product = await ProductService.updateProduct(
        req.params.productId,
        req.body
      );

      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Get product by ID
  async getProductById(req, res) {
    try {
      const product = await ProductService.findProductById(
        req.params.productId
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Search for products by query
  async searchProduct(req, res) {
    try {
      const query = req.query.q;
      const products = await ProductService.searchProduct(query);
      return res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllProducts(req, res) {
    try {
      const products = await ProductService.getAllProducts(req.query);
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new SellerProductController();
