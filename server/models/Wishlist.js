import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        name: String,
        image: String,
        price: Number,
        category: String,
        stock: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Wishlist", wishlistSchema);