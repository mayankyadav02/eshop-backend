// controllers/productController.js
import Product from "../models/Product.js";

// Get all products (search, filter, sort, pagination)
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // search both name and product_name fields
    const keyword = req.query.keyword
      ? {
          $or: [
            { product_name: { $regex: req.query.keyword, $options: "i" } },
            { name: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const priceFilter = {};
    if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
    const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

    const rating = req.query.rating ? { overall_rating: { $gte: Number(req.query.rating) } } : {};

    const filter = { ...keyword, ...category, ...price, ...rating };

    let sort = {};
    if (req.query.sortBy) {
      if (req.query.sortBy === "lowest") sort = { price: 1 };
      else if (req.query.sortBy === "highest") sort = { price: -1 };
      else if (req.query.sortBy === "newest") sort = { createdAt: -1 };
      else if (req.query.sortBy === "popular") sort = { overall_rating: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter).sort(sort).limit(pageSize).skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create product (Admin)
const createProduct = async (req, res) => {
  try {
    const { name, product_name, price, retail_price, discounted_price, description, category, stock, images } = req.body;

    const product = new Product({
      name,
      product_name,
      price,
      retail_price,
      discounted_price,
      description,
      category,
      stock,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update & Delete similar to before (ensure fields consistent)
const updateProduct = async (req, res) => {
  try {
    const { name, product_name, price, retail_price, discounted_price, description, category, stock, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.product_name = product_name || product.product_name;
      product.price = price !== undefined ? price : product.price;
      product.retail_price = retail_price !== undefined ? retail_price : product.retail_price;
      product.discounted_price = discounted_price !== undefined ? discounted_price : product.discounted_price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
      product.images = images || product.images;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
