const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productsController");

router.get("/", getProducts);

router.post("/", upload.single("image"), createProduct);

router.put("/:id", updateProduct);

router.delete("/:id", deleteProduct);

module.exports = router;