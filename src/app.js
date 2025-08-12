import express from "express";
import morgan from "morgan";
import passport from "passport";
import { authRouter } from "./router/auth.router.js";
import cookieParser from "cookie-parser";
import { initializePassport } from "./config/passport.config.js";
import productsRoutes from './router/products.router.js';  
import cartRoutes from './router/cart.router.js';         
import { connectMongoDB } from "./config/mongoDB.config.js";

connectMongoDB();

const app = express();
const PORT = 8080; 

// Configuración de Express
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport();
app.use(passport.initialize());

// Rutas
app.use('/index', express.static("public"));
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/auth", authRouter); // Cambiado de /api/sessions a /api/auth

// Ruta de prueba
app.get('/test', (req, res) => {
    res.send('¡La ruta de prueba está funcionando!');
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("error");
});

app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});