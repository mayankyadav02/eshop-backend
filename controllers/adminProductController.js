// controllers/adminProductController.js
import Product from "../models/Product.js";
import Category from "../models/category.js";
import path from "path";


// // Create product (admin)
// const createProductAdmin = async (req, res) => {
//   try {
//     const data = req.body;
//     // expected body: { product_name, brand, retail_price, discounted_price, description, images, category (id), stock }
//     const product = new Product(data);
//     await product.save();
//     res.status(201).json(product);
//   } catch (err) {
//     console.error("createProductAdmin:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Update product (admin)
// const updateProductAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const product = await Product.findByIdAndUpdate(id, updates, { new: true });
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (err) {
//     console.error("updateProductAdmin:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Create product (admin)
// const createProductAdmin = async (req, res) => {
//   try {
//     const {
//       name,
//       brand,
//       retail_price,
//       discounted_price,
//       description,
//       stock,
//       categoryId,
//     } = req.body;

//     if (!name || !retail_price || !stock) {
//       return res.status(400).json({ message: "Name, price and stock required" });
//     }

//     let category = null;
//     if (categoryId) {
//       category = await Category.findById(categoryId);
//       if (!category) return res.status(400).json({ message: "Category not found" });
//     }

//     const product = new Product({
//       name,
//       brand,
//       retail_price,
//       discounted_price,
//       description,
//       stock,
//       category: category?._id || null,
//       // imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
//       images: imagePath ? [imagePath] : [], // store here
//     });

//     await product.save();
//     res.status(201).json({ message: "Product created", product });
//   } catch (err) {
//     console.error("createProductAdmin:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// controllers/adminProductController.js

const createProductAdmin = async (req, res) => {
  try {
    const {
      name,
      brand,
      retail_price,
      discounted_price,
      description,
      stock,
      categoryId,
    } = req.body;

    // Basic validations
    if (!name || !retail_price || !stock) {
      return res
        .status(400)
        .json({ message: "Name, retail price, and stock are required." });
    }

    // Check category if provided
    let category = null;
    if (categoryId) {
      category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Category not found." });
      }
    }

    // ✅ Handle uploaded image (if exists)
    let imageUrl = null;
    if (req.file) {
      // Convert to server accessible path (like: /uploads/abc.jpg)
      images = `/uploads/${req.file.filename}`;
    }

    // ✅ Create product
    const product = new Product({
      name,
      brand,
      retail_price,
      discounted_price,
      description,
      stock,
      category: category ? category._id : null,
      images, // properly handled now
    });

    await product.save();

    res.status(201).json({
      message: "✅ Product created successfully!",
      product,
    });
  } catch (err) {
    console.error("❌ createProductAdmin Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};




// // Update product (admin)
// const updateProductAdmin = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;

//     if (req.file) {
//       updates.imageUrl = `/uploads/${req.file.filename}`;
//     }

//     const product = await Product.findByIdAndUpdate(id, updates, { new: true }).populate("category", "name");

//     if (!product) return res.status(404).json({ message: "Product not found" });

//     res.json({ message: "Product updated", product });
//   } catch (err) {
//     console.error("updateProductAdmin:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ if new image uploaded, push to images array
    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      product.images = product.images || [];
      product.images.push(imagePath);
    }

    // update rest fields
    Object.assign(product, updates);
    await product.save();

    const updatedProduct = await Product.findById(id).populate("category", "name");
    res.json({ message: "Product updated", product: updatedProduct });
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    const [products, total] = await Promise.all([
      Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments()
    ]);

    res.json({ products, total });
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
