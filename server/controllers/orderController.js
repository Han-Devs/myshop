import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, customer } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one item",
      });
    }

    if (
      !customer?.name ||
      !customer?.email ||
      !customer?.phone ||
      !customer?.address ||
      !customer?.payment
    ) {
      return res.status(400).json({
        message: "Complete customer information is required",
      });
    }

    session.startTransaction();

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const productId =
        item.productId || item._id || item.id;

      const quantity = Number(item.quantity);

      if (!productId) {
        const error = new Error("Product ID is required");
        error.statusCode = 400;
        throw error;
      }

      if (!Number.isInteger(quantity) || quantity < 1) {
        const error = new Error("Invalid product quantity");
        error.statusCode = 400;
        throw error;
      }

      const updatedProduct =
        await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: {
              $gte: quantity,
            },
          },
          {
            $inc: {
              stock: -quantity,
            },
          },
          {
            new: true,
            session,
          }
        );

      if (!updatedProduct) {
        const existingProduct = await Product.findById(
          productId
        ).session(session);

        if (!existingProduct) {
          const error = new Error("Product not found");
          error.statusCode = 404;
          throw error;
        }

        const error = new Error(
          `Only ${existingProduct.stock} ${existingProduct.name} remaining`
        );

        error.statusCode = 400;
        throw error;
      }

      orderItems.push({
        productId: updatedProduct._id,
        name: updatedProduct.name,
        image: updatedProduct.image || "",
        price: updatedProduct.price,
        quantity,
      });

      totalPrice +=
        updatedProduct.price * quantity;
    }

    const createdOrders = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim().toLowerCase(),
            phone: customer.phone.trim(),
            address: customer.address.trim(),
            payment: customer.payment,
          },
          totalPrice,
          status: "Pending",
        },
      ],
      {
        session,
      }
    );

    await session.commitTransaction();

    res.status(201).json(createdOrders[0]);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create order error:", error);

    res.status(error.statusCode || 500).json({
      message: error.message || "Server error",
    });
  } finally {
    await session.endSession();
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    res.json(order);
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};