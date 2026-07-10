import express from "express";
import {
    getCart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:productId", protect, updateCartQuantity);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;