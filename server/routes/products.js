import express from "express";
import upload from "../config/multer.js";

import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productsController.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", upload.single("image"), createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

export default router;