// models/Order.js
import mongoose from "mongoose";

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // unified items array (used everywhere)
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true, default: 0 }, // price per unit at purchase time
      },
    ],

    shippingAddress: {
      fullName: String,
      addressLine: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
    },

    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },

    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },

    // canonical field used across app
    totalPrice: { type: Number, default: 0 },

    orderStatus: { type: String, default: "Processing" }, // Processing, Delivered, Cancelled, Returned
    returnRequested: { type: Boolean, default: false },
    returnReason: { type: String },
    returnApproved: { type: Boolean, default: false },

    paymentIntentId: { type: String }, // Stripe payment intent id (optional)
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
