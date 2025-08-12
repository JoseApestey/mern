import { Router } from "express";
import passport from "passport";
import { AuthController } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.register);

authRouter.get(
  "/current",
  passport.authenticate("current", { 
    session: false,
    failWithError: true 
  }),
  AuthController.current,
  (err, req, res, next) => {
    return res.status(401).json({ 
      status: "error", 
      message: "No autorizado: Token inválido o expirado" 
    });
  }
);