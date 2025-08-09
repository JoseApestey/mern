import { Router } from "express";


import { cartModel } from "../dao/models/cart.model.js";
import { productModel } from "../dao/models/product.model.js";
import { productDao } from "../dao/mongoDao/product.dao.js";
import { cartDao } from "../dao/mongoDao/cart.dao.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const cart = await cartModel.create({});

    res.json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartModel.findById(cid).populate('products.product').exec();
    if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });

    res.json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
 
    try {
      const findProduct = await productModel.findById(pid);
      if (!findProduct) return res.json({ status: "error", message: `Product id ${pid} not found` });
  
      const findCart = await cartModel.findById(cid);
      if (!findCart) return res.json({ status: "error", message: `Cart id ${cid} not found` });
  
      const product = findCart.products.find((productCart) => productCart.product.toString() === pid.toString());
      if (!product) {
        findCart.products.push({ product: pid, quantity: 1 });
      } else {
        product.quantity++;
      }


    const cart = await cartModel.findByIdAndUpdate(cid, { products: findCart.products }, { new: true }).populate('products.product').exec();

    res.json({ status: "ok", payload: cart });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  const {cid, pid} = req.params;
  try {
    const product = await productDao.getById(pid);
    if (!product) return res.json({ status: "error", message: `Product id ${pid} not found` });

    const cart = await cartModel.findById(cid);
    if (!cart) return res.json({ status: "error", message: `Cart id ${cid} not found` });

    const productInCart = cart.products.find((productCart) => productCart.product.toString() === pid.toString());
    if (!productInCart) return res.json({ status: "error", message: `Product id ${pid} not found in Cart id ${cid} not found` });

    await cartDao.deleteProductInCart(cid, pid);
    const cartUpdated = await cartModel.findById(cid).populate('products.product');

    
    res.json({ status: "ok", payload: cartUpdated });

  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
})

export default router;