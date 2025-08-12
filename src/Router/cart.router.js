// src/Router/cart.router.js
import { Router } from "express";
import passport from "passport";
import { CartController } from "../controllers/cart.controller.js";

const router = Router();

router.get("/", CartController.getAll);
router.get("/:cid", CartController.getById);
router.post("/", CartController.create);
router.post("/:cid/products/:pid", 
  passport.authenticate("current", { session: false }),
  CartController.addProduct
);
router.post("/:cid/purchase",
  passport.authenticate("current", { session: false }),
  CartController.purchase
);

export default router;