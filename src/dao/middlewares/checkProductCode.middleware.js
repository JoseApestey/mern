import { ProductManager } from "../managers/productManager.js  "
const productManager = new ProductManager();

export const checkProductCode = async (req, res, next) => {
  const body = req.body;
  const { title, description, price, thumbnail, code, stock, category } = body;
  try {
    const products = await productManager.getProducts();
    const productExist = products.find((product) => product.code === code);
    if (productExist) {
      const error = new Error();
      error.message = `Ya existe un producto con el código ${code}`;
      error.code = 403;
      throw error;
    } else { 
      next();}
  } catch (error) {
    console.log(`ERROR ${error.code} (${error.message})`);
    res.status(error.code).send(error.message);

  }

};