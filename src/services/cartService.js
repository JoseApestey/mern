import { cartDao } from '../dao/mongoDao/cart.dao.js';
import { productDao } from '../dao/mongoDao/product.dao.js';
import { ticketService } from './ticketService.js';
import mongoose from 'mongoose';

class CartService {
    constructor() {
        this.cartDao = cartDao;
        this.productDao = productDao;
        this.ticketService = ticketService;
    }

    async createCart() {
        try {
            return await this.cartDao.create({ products: [] }); // Carrito vacío
        } catch (error) {
            throw new Error('ERROR_CREATING_CART');
        }
    }

    async getCartById(id) {
        try {
            const cart = await this.cartDao.getCartById(id);
            if (!cart) throw new Error('CART_NOT_FOUND');
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.cartDao.getById(cartId);
            const product = await this.productDao.getById(productId);

            if (!cart || !product) throw new Error('CART_OR_PRODUCT_NOT_FOUND');

            const existingProduct = cart.products.find(
                item => item.product._id.toString() === productId
            );

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            return await this.cartDao.update(cartId, cart);
        } catch (error) {
            throw error;
        }
    }

    async completePurchase(cartId, purchaserEmail) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const cart = await this.cartDao.getCartById(cartId, { session });
            if (!cart) throw new Error('CART_NOT_FOUND');

            const productsToPurchase = [];
            const productsNotPurchased = [];
            let totalAmount = 0;

            for (const item of cart.products) {
                const product = await this.productDao.getById(item.product._id, { session });
                
                if (!product || product.stock < item.quantity) {
                    productsNotPurchased.push(item);
                } else {
                    productsToPurchase.push({
                        productId: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                    totalAmount += product.price * item.quantity;
                }
            }

            for (const item of productsToPurchase) {
                await this.productDao.update(
                    item.productId,
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }

            let ticket = null;
            if (productsToPurchase.length > 0) {
                ticket = await this.ticketService.createTicket({
                    amount: totalAmount,
                    purchaser: purchaserEmail,
                    products: productsToPurchase
                }, { session });
            }

            await this.cartDao.updateCartProducts(
                cartId,
                productsNotPurchased,
                { session }
            );

            await session.commitTransaction();

            return {
                ticket,
                productsNotPurchased,
                message: this._generatePurchaseMessage(productsToPurchase, productsNotPurchased)
            };

        } catch (error) {
            await session.abortTransaction();
            console.error('Transaction aborted:', error);
            throw new Error('PURCHASE_FAILED: ' + error.message);
        } finally {
            session.endSession();
        }
    }

    _generatePurchaseMessage(purchased, notPurchased) {
        if (purchased.length === 0) return 'No se pudo comprar ningún producto por falta de stock.';
        if (notPurchased.length === 0) return 'Compra completada exitosamente.';
        return 'Compra completada parcialmente. Algunos productos no tenían stock suficiente.';
    }
}

export const cartService = new CartService();