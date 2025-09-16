// scripts/migrateProductCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Category from "../models/category.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const products = await Product.find({ product_category_tree: { $exists: true, $ne: [] } });

for (const p of products) {
  const first = p.product_category_tree[0];
  if (!first) continue;
  // find or create category by name
  let cat = await Category.findOne({ name: first });
  if (!cat) {
    cat = await Category.create({ name: first, slug: first.toLowerCase().replace(/\s+/g, "-") });
  }
  p.category = cat._id;
  await p.save();
  console.log(`Mapped product ${p._id} -> category ${cat.name}`);
}

await mongoose.disconnect();
console.log("Done");
