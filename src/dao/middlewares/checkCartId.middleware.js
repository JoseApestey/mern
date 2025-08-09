import { CartManager } from "../managers/cartManager.js";

const cartManager = new CartManager();

export const checkCartId = async (req, res, next) => {
  const { cid } = req.params;
  try {
    const carts = await cartManager.getCarts();
    const cart = carts.find((cart) => cart.id === cid);
    if (!cart) {
      const error = new Error();
      error.message = `No se encuentra el carrito con el id ${cid}`
      error.code = 404;
      throw error;} else { next();}
  } catch (error) {
    console.log(`ERROR ${error.code} (${error.message})`);
    res.status(error.code).send(error.message);
  }

};