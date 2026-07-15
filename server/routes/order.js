import express from 'express'

import {
  getOrders,
  createOrder,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js'

import { protect } from '../middleware/authMiddleware.js'
import { adminProtect } from '../middleware/adminMiddleware.js'

const router = express.Router()

// Customer routes
router.get('/', protect, getOrders)
router.post('/', protect, createOrder)

// Admin routes
router.get('/admin', protect, adminProtect, getAllOrders)

router.put(
  '/:id/status',
  protect,
  adminProtect,
  updateOrderStatus
)

export default router