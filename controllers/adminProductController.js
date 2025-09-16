// controllers/adminProductController.js
import Product from "../models/Product.js";
import Category from "../models/category.js";

// Create product (admin)
const createProductAdmin = async (req, res) => {
  try {
    const data = req.body;
    // expected body: { product_name, brand, retail_price, discounted_price, description, images, category (id), stock }
    const product = new Product(data);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("createProductAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update product (admin)
const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("updateProductAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete product (admin)
const deleteProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne(); // safe
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("deleteProductAdmin:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update stock (admin)
const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body; // expected integer
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    product.stock = Number(stock);
    await product.save();
    res.json(product);
  } catch (err) {
    console.error("updateStock:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Assign/Change category (admin)
const assignCategory = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { categoryId } = req.body;
    // validate category exists
    if (categoryId) {
      const cat = await Category.findById(categoryId);
      if (!cat) return res.status(400).json({ message: "Category not found" });
    }
    const product = await Product.findByIdAndUpdate(id, { category: categoryId || null }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("assignCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all products for Admin
const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name");
    res.json(products);
  } catch (error) {
    console.error("getAdminProducts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
  updateStock,
    assignCategory,
  getAdminProducts,
};
