// controllers/orderController.js
import Order from "../models/Order.js";
import Cart from "../models/cart.js";
import Product from "../models/Product.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create new order
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price || item.product.discounted_price || 0,
    }));

    const totalPrice = items.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // stock check & update
    for (const it of items) {
      const product = await Product.findById(it.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${it.product}` });
      if (product.stock < it.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name || product.product_name}. Available: ${product.stock}`,
        });
      }
      product.stock -= it.quantity;
      product.countInStock = product.stock;
      await product.save();
    }

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      totalPrice,
      orderStatus: "Processing",
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("items.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    // if not admin ensure owner
    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = req.body.orderStatus;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deliver order (Admin)
const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      order.orderStatus = "Delivered";
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User cancels order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus === "Delivered")
      return res.status(400).json({ message: "Cannot cancel delivered order" });

    order.orderStatus = "Cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// User requests return
export const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });

    if (order.orderStatus !== "Delivered")
      return res.status(400).json({ message: "Only delivered orders can be returned" });

    order.returnRequested = true;
    order.returnReason = reason;
    await order.save();

    res.status(200).json({ message: "Return requested", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin approves return & issues refund via Stripe (if paymentIntentId present)
export const approveReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.returnRequested) return res.status(400).json({ message: "No return requested for this order" });

    // Refund via Stripe if payment intent exists
    if (order.paymentIntentId) {
      try {
        await stripe.refunds.create({ payment_intent: order.paymentIntentId });
      } catch (stripeErr) {
        console.error("Stripe refund error:", stripeErr);
        // continue to mark returned even if refund fails — or you may prefer to abort
      }
    }

    order.orderStatus = "Returned";
    order.returnApproved = true;
    await order.save();

    res.status(200).json({ message: "Return approved & refund issued (if applicable)", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export { createOrder, getUserOrders, getOrderById, updateOrderStatus, deliverOrder };
