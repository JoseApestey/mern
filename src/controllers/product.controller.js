
import { productService } from "../services/productService.js";
import { isAdmin } from "../dao/middlewares/authorization.middleware.js";

export class ProductController {
  static async getAll(req, res) {
    try {
      const { limit = 10, page = 1, sort, query } = req.query;
      const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort ? { price: sort === 'asc' ? 1 : -1 } : null,
        lean: true
      };
      
      const filter = query ? { category: query } : {};
      const products = await productService.getAllProducts(filter, options);
      res.json({ status: 'success', payload: products });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const product = await productService.getProductById(req.params.pid);
      res.json({ status: 'success', payload: product });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newProduct = await productService.createProduct(req.body);
      res.status(201).json({ status: 'success', payload: newProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const updatedProduct = await productService.updateProduct(req.params.pid, req.body);
      res.json({ status: 'success', payload: updatedProduct });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      await productService.deleteProduct(req.params.pid);
      res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}