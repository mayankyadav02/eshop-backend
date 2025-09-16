import Cart from "../models/cart.js";
import Product from "../models/Product.js";

// Get user cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    console.error("getCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    console.error("addToCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error("removeFromCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared" });
  } catch (err) {
    console.error("clearCart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export { getCart, addToCart, removeFromCart, clearCart };
