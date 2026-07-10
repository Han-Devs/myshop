import Cart from "../models/Cart.js";

export const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export const addToCart = async (req, res) => {
    try {
        const product = req.body;

        let cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        }

        const existingItem = cart.items.find(
            (item) =>
                item.productId.toString() === product._id
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId: product._id,
                name: product.name,
                image: product.image,
                price: product.price,
                quantity: 1,
            });
        }

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.productId.toString() !== productId
        );

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export const updateCartQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1",
            });
        }

        const cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found",
            });
        }

        const cartItem = cart.items.find(
            (item) =>
                item.productId &&
                item.productId.toString() === productId
        );

        if (!cartItem) {
            return res.status(404).json({
                message: "Product not found in cart",
            });
        }

        cartItem.quantity = quantity;

        await cart.save();

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
export const clearCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({
            user: req.user._id,
        });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [],
            });
        } else {
            cart.items = [];
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};