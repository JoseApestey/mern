// import { ProductManager } from "../managers/productManager.js  "
// const productManager = new ProductManager();

export const checkProductUndefined = async (req, res, next) => {
  const body = req.body;
  const { title, description, price, thumbnail, code, stock, category } = body;

  const newProduct = {
    id: 1,
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    status: true,
    category,
  };

  try {
    const validateProperties = Object.values(newProduct);
    if (validateProperties.includes(undefined)) {
        const error = new Error();
        error.message = `"Todos los campos son obligatorios"`;
        error.code = 406;
        throw error;} else { next();}
  } catch (error) {
    console.log(`ERROR ${error.code} (${error.message})`);
    res.status(error.code).send(error.message);

  } 
};