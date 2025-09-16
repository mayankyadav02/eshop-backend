// models/Product.js
import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    // optional friendly name (used by some controllers/frontend)
    name: { type: String },

    // Kaggle original name
    product_name: { type: String },

    product_url: { type: String },
    product_category_tree: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },

    pid: { type: String },

    // retail (MRP)
    retail_price: { type: Number, default: 0 },

    // discounted price from dataset
    discounted_price: { type: Number, default: 0 },

    // canonical price used across app (prefer discounted_price if present)
    price: { type: Number, default: 0 },

    // images array
    images: [String],

    is_FK_Advantage_product: { type: Boolean, default: false },

    description: { type: String, default: "" },

    // numeric rating fields (store as Number for aggregations)
    product_rating: { type: Number, default: 0 },
    overall_rating: { type: Number, default: 0 },

    brand: { type: String, default: "" },

    product_specifications: { type: mongoose.Schema.Types.Mixed, default: {} },

    // stock / count
    stock: { type: Number, default: 0 },
    countInStock: { type: Number }, // kept for compatibility

  },
  { timestamps: true }
);

// Keep countInStock in sync with stock
productSchema.pre("save", function (next) {
  // if countInStock not set, derive from stock
  if (this.countInStock === undefined || this.countInStock === null) {
    this.countInStock = this.stock;
  }

  // Ensure canonical price is set (prefer discounted_price)
  if (!this.price || this.price === 0) {
    if (this.discounted_price && this.discounted_price > 0) this.price = this.discounted_price;
    else if (this.retail_price && this.retail_price > 0) this.price = this.retail_price;
  }

  // if name empty but product_name exists, copy it (friendly)
  if (!this.name && this.product_name) {
    this.name = this.product_name;
  }

  next();
});

// Indexes
productSchema.index({ stock: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model("Product", productSchema);
export default Product;
