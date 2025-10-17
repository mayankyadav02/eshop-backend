import Category from "../models/category.js";
import Product from "../models/Product.js";
import slugify from "slugify";

// Create Category (Admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const slug = slugify(name, { lower: true });

    const category = await Category.create({
      name,
      description,
      slug,
      parent: parent || null,
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("createCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Categories (flat)
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories); // flat array, sab categories dikhenge
  } catch (err) {
    console.error("getCategories:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Category By ID or Slug
const getCategoryById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(idOrSlug);
    } else {
      category = await Category.findOne({ slug: idOrSlug });
    }

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

     // ✅ us category ke products bhi fetch karo
    const products = await Product.find({ category: category._id });

    res.json({
      ...category.toObject(),
      products, // add products array in response
    });
    // res.json(category);
  } catch (err) {
    console.error("getCategoryById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update Category (Admin)
const updateCategory = async (req, res) => {
  try {
    const { name, description, parent } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: "Category not found" });

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true });
    }
    category.description = description || category.description;
    category.parent = parent || category.parent;

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    console.error("updateCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Category (safe delete)
const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) return res.status(404).json({ message: "Category not found" });

    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${productCount} product(s) are assigned to this category`,
      });
    }

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("deleteCategory:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
