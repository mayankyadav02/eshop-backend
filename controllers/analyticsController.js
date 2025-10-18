import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

// Dashboard Summary (enhanced)
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Total revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Pending & delivered orders
    const pendingOrders = await Order.countDocuments({
      orderStatus: "Processing",
    });
    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered",
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sales per Category (fixed for string categories)
const getSalesByCategory = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category", // direct string (no categories collection)
          totalSales: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { revenue: -1 } },
    ]);

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Monthly Revenue (formatted months)
const getMonthlyRevenue = async (req, res) => {
  try {
    const monthly = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          revenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: {
            $dateToString: { format: "%B %Y", date: { $toDate: "$_id" } },
          },
          totalOrders: 1,
          revenue: 1,
        },
      },
    ]);

    res.json(monthly);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDashboardStats, getSalesByCategory, getMonthlyRevenue };
