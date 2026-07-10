import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,
        image: String,
        price: Number,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Cart", cartSchema);