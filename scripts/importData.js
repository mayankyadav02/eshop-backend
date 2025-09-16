import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import User from "../models/user.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/category.js";
import Review from "../models/Review.js";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import slugify from "slugify";

dotenv.config();
import connectDB from "../config/db.js";

connectDB();

const importData = async () => {
  try {
    // Purana data clear
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();

    // Admin User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "123456",
      role: "admin",
    });
    console.log("✅ Default Admin User Created".green.bold);

    // CSV import
    const csvFilePath = path.resolve("data/flipkart_com-ecommerce_sample.csv");
    if (!fs.existsSync(csvFilePath)) {
      console.log("⚠️ CSV file not found, skipping import".yellow);
      process.exit();
    }

    const rawProducts = [];
    const categories = [];
    const uniqueCategories = new Set();

    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row) => {
          rawProducts.push(row);

          // Category collect (flat)
          if (row.product_category_tree) {
            const cleanName = row.product_category_tree
              .replace(/[\[\]']+/g, "")
              .split(">>")[0]
              .trim();

            if (cleanName && !uniqueCategories.has(cleanName)) {
              uniqueCategories.add(cleanName);
              categories.push({ name: cleanName, slug: slugify(cleanName, { lower: true }) });
            }
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Categories insert
    let categoryDocs = [];
    if (categories.length > 0) {
      categoryDocs = await Category.insertMany(categories, { ordered: false });
      console.log(`✅ ${categories.length} Categories Imported`.green.bold);
    }

    // Products + Reviews
    const productDocs = [];
    const reviewDocs = [];

    for (let row of rawProducts) {
      let categoryId = null;
      if (row.product_category_tree) {
        const cleanName = row.product_category_tree.replace(/[\[\]']+/g, "").split(">>")[0].trim();
        const categoryDoc = categoryDocs.find((c) => c.name === cleanName);
        if (categoryDoc) categoryId = categoryDoc._id;
      }

      const product = new Product({
        name: row.product_name || "Sample Product",
        brand: row.brand || "Unknown",
        description: row.description || "No description",
        price: Number(row.retail_price) || 0,
        discountedPrice: Number(row.discounted_price) || 0,
        stock: Math.floor(Math.random() * 100),
        images: [row.image || "https://via.placeholder.com/150"],
        category: categoryId,
        createdBy: adminUser._id,
      });
      productDocs.push(product);

      // Reviews
      if (row.product_rating && !isNaN(Number(row.product_rating))) {
        reviewDocs.push({
          product: product._id,
          user: adminUser._id,
          name: "Kaggle User",
          rating: Number(row.product_rating),
          comment: `User rated this product ${row.product_rating} stars.`,
        });
      }

      if (row.overall_rating && !isNaN(Number(row.overall_rating))) {
        reviewDocs.push({
          product: product._id,
          user: adminUser._id,
          name: "Overall Rating",
          rating: Number(row.overall_rating),
          comment: `Average rating of this product is ${row.overall_rating}.`,
        });
      }
    }

    await Product.insertMany(productDocs);
    await Review.insertMany(reviewDocs);

    console.log(`${productDocs.length} Products Imported`.green.bold);
    console.log(`${reviewDocs.length} Reviews Imported`.green.bold);

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Review.deleteMany();
    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "--import") importData();
else if (process.argv[2] === "--destroy") destroyData();
