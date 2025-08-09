
import express from "express";

import morgan from "morgan";
import passport from "passport";
import { authRouter } from "./Router/auth.router.js";
import cookieParser from "cookie-parser";

import { initializePassport } from "./config/passport.config.js"
import productsRoutes from './router/products.router.js';
import cartRoutes from './router/cart.router.js';
import { connectMongoDB } from "./config/mongoDB.config.js";

connectMongoDB();

const app = express();
const PORT = 8080; 

//express config
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// passport
initializePassport();
app.use(passport.initialize());

app.use('/index', express.static("public"));
app.use((req, res, next) => {
    next(); 
});

app.use("/api/products", productsRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/sessions", authRouter)

app.get('/test', (req, res) => {
    res.send('¡La ruta de prueba está funcionando!');
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("error");
});


app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});