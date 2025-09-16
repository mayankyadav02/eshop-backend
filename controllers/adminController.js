// controllers/adminController.js
import User from "../models/user.js";
import Order from "../models/Order.js";

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("getAllUsers:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("getUserById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Block / Unblock user
const blockUnblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully` });
  } catch (err) {
    console.error("blockUnblockUser:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (err) {
    console.error("getAllOrders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    console.error("getOrderById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("updateOrderStatus:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Dashboard analytics (consistent with other analytics controllers)
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // totalRevenue uses totalPrice
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ["Pending", "Processing"] } });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  } catch (err) {
    console.error("getDashboardAnalytics:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getStats = getDashboardAnalytics;
const getDashboardSummary = getDashboardAnalytics;

export {
  getAllUsers,
  getUserById,
  blockUnblockUser,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getDashboardAnalytics,
  getStats,
  getDashboardSummary,
};
