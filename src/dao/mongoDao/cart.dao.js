import { cartModel } from "../models/cart.model.js"

class CartDao {
    async getAll() {
        return await cartModel.find()
    }

    async getById(id) {
        return await cartModel.findById(id).populate('products.product').exec()
    }

    async create(data) {
        return await cartModel.create(data)
    }

    async update(id, data) {
        return await cartModel.findByIdAndUpdate(id, data, { new: true }).populate('products.product').exec()
    }

    async deleteById(id) {
        return await cartModel.deleteById(id);
       }

    async deleteProductInCart(cid, pid) {
        const cart = await cartModel.findById(cid)
 
        const productFilter = cart.products.filter(product  => product.product.toString() !== pid)
        return await cartModel.findByIdAndUpdate(cid, { products: productFilter}, {new: true})
    }
}

export const cartDao = new CartDao()