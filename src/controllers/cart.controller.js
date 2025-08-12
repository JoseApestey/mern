import { cartService } from "../services/cartService.js";

export class CartController {
  static async getAll(req, res) {
    try {
      const carts = await cartService.getAllCarts();
      res.json({ status: 'success', payload: carts });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const cart = await cartService.getCartById(req.params.cid);
      res.json({ status: 'success', payload: cart });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const newCart = await cartService.createCart();
      res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async addProduct(req, res) {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity || 1;
      const updatedCart = await cartService.addProductToCart(cid, pid, quantity);
      res.json({ status: 'success', payload: updatedCart });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  static async purchase(req, res) {
    try {
      const result = await cartService.purchaseCart(req.params.cid, req.user);
      res.json({ status: 'success', payload: result });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}