import express from "express";

const router = express.Router();

import {
  getOrders,
  createOrder,
  getAllOrders,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminMiddleware.js";

// Customer orders
router.get("/", protect, getOrders);
router.post("/", protect, createOrder);

// Admin - get all orders
router.get(
  "/admin",
  protect,
  adminProtect,
  getAllOrders
);

export default router;