import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the product name"],
      trim: true,
      maxLength: [50, "Product name cannot be more than 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the product price"],
      trim: true,
      maxLength: [5, "Product price name cannot be more than 5 digit"],
    },
    description: {
      type: String,
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true,
        },
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
