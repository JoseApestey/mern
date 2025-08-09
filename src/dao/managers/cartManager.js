import fs from "fs";
import { v4 as uuid } from "uuid";

export class CartManager {
  constructor() {
    this.carts = [];
    this.path = "./src/managers/data/carts.json";
  }

  async getCarts(limit) {
    const file = await fs.promises.readFile(this.path, "utf-8");
    const fileParse = JSON.parse(file);

    this.carts = fileParse || [];

    if (!limit) return this.carts;

    return this.carts.slice(0, limit);
  }

  async addCart() {
    await this.getCarts();

    const newCart = {
      id: uuid(),
      products: []
    };

    this.carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    return newCart;
  }

  async getCartById(id) {

    await this.getCarts();
    const cart = this.carts.find((cart) => cart.id === id);
    return cart;
  }

  
  async updateCart(cid, pid) {
    await this.getCartById(cid);

    const index = this.carts.findIndex((cart) => cart.id === cid);
    const productFound = this.carts[index].products.find((product) => product.id === pid);
    if (!productFound) {
      const newProduct = {
        id: pid,
        quantity: 1
      }
      this.carts[index].products.push(newProduct);  
    } else {
      const pIndex = this.carts[index].products.findIndex((product) => product.id === pid);
      this.carts[index].products[pIndex].quantity += 1;  
    }

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
    console.log(productFound);

    return this.carts[index];
  }

  async deleteCart(id) {
    await this.getCartById(id);

    this.carts = this.carts.filter((cart) => cart.id !== id);

    await fs.promises.writeFile(this.path, JSON.stringify(this.carts));

    return `Carrito con el id ${id} ha sido eliminado`;
  }
}