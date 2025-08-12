
import { Router } from "express";
import passport from "passport";
import { ProductController } from "../controllers/product.controller.js";
import { isAdmin } from './../dao/middlewares/authorization.middleware.js'

const router = Router();

router.get("/", ProductController.getAll);
router.get("/:pid", ProductController.getById);
router.post("/", 
  passport.authenticate("current", { session: false }),
  isAdmin,
  ProductController.create
);
router.put("/:pid", 
  passport.authenticate("current", { session: false }),
  isAdmin,
  ProductController.update
);
router.delete("/:pid", 
  passport.authenticate("current", { session: false }),
  isAdmin,
  ProductController.delete
);

export default router;