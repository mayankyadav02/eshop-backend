// controllers/adminReportsController.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Category from "../models/category.js";

// Sales per Category
const salesByCategory = async (req, res) => {
  try {
    const agg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          totalSales: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          totalQty: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          categoryId: "$_id",
          categoryName: { $arrayElemAt: ["$category.name", 0] },
          totalSales: 1,
          totalQty: 1,
          _id: 0,
        },
      },
      { $sort: { totalSales: -1 } },
    ]);

    res.json(agg);
  } catch (err) {
    console.error("salesByCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Order Status Counts (Pending/Delivered/etc.)
const orderStatusCounts = async (req, res) => {
  try {
    const counts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          status: {
            // ✅ "Processing" ko frontend ke liye "Pending" rename kar diya
            $cond: [{ $eq: ["$_id", "Processing"] }, "Pending", "$_id"],
          },
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json(counts);
  } catch (err) {
    console.error("orderStatusCounts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Top Products by Quantity & Revenue
const topProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;

    const agg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalQty: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          productId: "$product._id",
          name: { $ifNull: ["$product.product_name", "$product.name"] },
          brand: "$product.brand",
          totalQty: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json(agg);
  } catch (err) {
    console.error("topProducts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/adminReportsController.js

const getRecentOrders = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("user", "name email");
    res.json({ orders });
  } catch (err) {
    console.error("getRecentOrders:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export { salesByCategory, orderStatusCounts, topProducts, getRecentOrders };
