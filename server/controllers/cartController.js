import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  return cart;
}

// Synchronize saved cart items with current MongoDB products.
async function synchronizeCart(cart) {
  const synchronizedItems = [];

  for (const item of cart.items) {
    const product = await Product.findById(item.productId);

    // Remove products that no longer exist.
    if (!product) {
      continue;
    }

    // Remove products that are now out of stock.
    if (product.stock <= 0) {
      continue;
    }

    // Prevent saved quantity from exceeding current stock.
    const safeQuantity = Math.min(
      item.quantity,
      product.stock
    );

    synchronizedItems.push({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: safeQuantity,
    });
  }

  cart.items = synchronizedItems;

  await cart.save();

  return cart;
}

export const getCart = async (req, res) => {
  try {
    let cart = await getOrCreateCart(req.user._id);

    cart = await synchronizeCart(cart);

    res.json(cart);
  } catch (error) {
    console.error("Get cart error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const productId =
      req.body.productId || req.body._id;

    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        message: `${product.name} is out of stock`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() ===
        product._id.toString()
    );

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} available`,
        });
      }

      existingItem.quantity += 1;

      // Refresh stored product information.
      existingItem.name = product.name;
      existingItem.image = product.image;
      existingItem.price = product.price;
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
    console.error("Add to cart error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        message: `${product.name} is out of stock`,
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} available`,
      });
    }

    const cart = await getOrCreateCart(req.user._id);

    const cartItem = cart.items.find(
      (item) =>
        item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;
    cartItem.name = product.name;
    cartItem.image = product.image;
    cartItem.price = product.price;

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Update cart quantity error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Remove from cart error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    cart.items = [];

    await cart.save();

    res.json(cart);
  } catch (error) {
    console.error("Clear cart error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};