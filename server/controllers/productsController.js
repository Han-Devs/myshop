import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const createProduct = async (req, res) => {
  const productData = {
    ...req.body,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
    featured: req.body.featured === "true" || req.body.featured === true,
  };

  if (req.file) {
    productData.image = `/uploads/${req.file.filename}`;
  }

  const product = await Product.create(productData);

  res.status(201).json({
    message: "Product added successfully!",
    product,
  });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json({
    message: "Product updated successfully!",
    product,
  });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json({
    message: "Product deleted successfully!",
    product,
  });
};