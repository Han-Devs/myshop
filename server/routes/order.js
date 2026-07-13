import express from "express";

const router = express.Router();

import {
  getOrders,
  createOrder,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

router.get("/", protect, getOrders);

router.post("/", protect, createOrder);

export default router;