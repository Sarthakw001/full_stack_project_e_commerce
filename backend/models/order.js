import mongoose from "mongoose";
import orderStatus from "../utils/orderStatus";
import paymentMode from "../utils/paymentMode";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          count: Number,
          price: Number,
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.ORDERED,
    },
    paymentMode: {
      type: String,
      required: true,
      enum: Object.values(paymentMode),
    },
    coupon: String,
    transactionId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
