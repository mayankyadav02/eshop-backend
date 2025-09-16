// controllers/wishlistController.js
import User from "../models/user.js";
import Product from "../models/Product.js";

// @desc    Get logged-in user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist", "name price image rating");
    res.json(user.wishlist || []);
  } catch (err) {
    console.error("getWishlist error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Prevent duplicate
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    user.wishlist.push(productId);
    await user.save();

    res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("addToWishlist error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove product from wishlist
// @route   POST /api/wishlist/remove
// @access  Private
const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();

    res.json({ message: "Product removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    console.error("removeFromWishlist error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Clear wishlist
// @route   POST /api/wishlist/clear
// @access  Private
const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = [];
    await user.save();

    res.json({ message: "Wishlist cleared" });
  } catch (err) {
    console.error("clearWishlist error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
