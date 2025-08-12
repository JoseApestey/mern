import { productDao } from '../dao/mongoDao/product.dao.js';
import { ProductDTO } from '../dto/product.dto.js';

class ProductService {
    constructor(productDao) {
        this.productDao = productDao;
    }

    async getAllProducts(query = {}, options = {}) {
        try {
            const products = await this.productDao.getAll(query, options);
            return {
                ...products,
                docs: products.docs.map(product => new ProductDTO(product))
            };
        } catch (error) {
            throw new Error('ERROR_GETTING_PRODUCTS');
        }
    }

    async getProductById(id) {
        try {
            const product = await this.productDao.getById(id);
            if (!product) throw new Error('PRODUCT_NOT_FOUND');
            return new ProductDTO(product);
        } catch (error) {
            throw error;
        }
    }

    async createProduct(productData) {
    try {
        // Validar si el código ya existe
        const existingProduct = await this.productDao.getByCode(productData.code);
        if (existingProduct) {
            throw new Error('PRODUCT_CODE_EXISTS');
        }
        
        return await this.productDao.create(productData);
    } catch (error) {
        throw new Error(`CREATE_PRODUCT_ERROR: ${error.message}`);
    }
}

    async updateProduct(id, data) {
        try {
            // Si se actualiza el código, verificar que no exista
            if (data.code) {
                const existingProduct = await this.productDao.getByCode(data.code);
                if (existingProduct && existingProduct._id.toString() !== id) {
                    throw new Error('PRODUCT_CODE_EXISTS');
                }
            }

            const updatedProduct = await this.productDao.update(id, data);
            if (!updatedProduct) throw new Error('PRODUCT_NOT_FOUND');
            return new ProductDTO(updatedProduct);
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const result = await this.productDao.delete(id);
            if (!result) throw new Error('PRODUCT_NOT_FOUND');
            return true;
        } catch (error) {
            throw error;
        }
    }

    async updateProductStock(productId, quantity) {
        try {
            const product = await this.productDao.getById(productId);
            if (!product) throw new Error('PRODUCT_NOT_FOUND');
            
            const newStock = product.stock + quantity;
            if (newStock < 0) throw new Error('INSUFFICIENT_STOCK');
            
            return await this.productDao.update(productId, { stock: newStock });
        } catch (error) {
            throw error;
        }
    }
}

export const productService = new ProductService(productDao);