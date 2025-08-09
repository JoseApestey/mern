import { ProductManager } from "../managers/productManager.js  "
const productManager = new ProductManager();

export const checkUpdateProductCode = async (req, res, next) => {
  const { pid } = req.params;
  const body = req.body;
  const { title, description, price, thumbnail, code, stock, category } = body;
  try {
    const products = await productManager.getProducts();
    const productsFiltered = products.filter((product) => product.id !== pid);

    console.log(productsFiltered);
    const productExist = productsFiltered.find((product) => product.code === code);
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