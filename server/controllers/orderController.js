import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      customer,
      totalPrice,
    } = req.body;

    const order = await Order.create({
      user: req.user.id,
      items,
      customer,
      totalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};