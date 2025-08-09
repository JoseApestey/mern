import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"
const productsSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Debe ingresar el nombre del producto'] },
    description: { type: String, required: [true, 'Debe ingresar la descripción del producto'] },
    price: { type: Number, required: [true, 'Debe ingresar el precio del producto'] },
    thumbnail: { type: String, required: [true, 'Debe ingresar la dirección de la imagen del producto'] },
    code: { type: String, required: [true, 'Debe ingresar el código del producto'] },
    stock: { type: Number, required: [true, 'Debe ingresar el Stock del producto'] },
    status: {
        type: Boolean,
        default: true
    },
    category: { type: String, required: [true, 'Debe ingresar la categoría del producto'] }
})
 
productsSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productsCollection, productsSchema)