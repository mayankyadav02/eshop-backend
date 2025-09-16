// ./models/loadProducts.js
import fs from "fs";
import csv from "csv-parser";
import Product from "./Product.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV ka sahi path
const csvFilePath = path.join(__dirname, "../data/flipkart_com-ecommerce_sample.csv");

// MongoDB me data import karne wala function
export const importProductsFromCSV = async () => {
  const results = [];

  if (!fs.existsSync(csvFilePath)) {
    console.error(" CSV file not found at:", csvFilePath);
    return;
  }

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      results.push({
        uniq_id: row.uniq_id,
        product_name: row.product_name,
        category: row.product_category_tree?.split(">")?.[0] || "Uncategorized",
        retail_price: parseFloat(row.retail_price) || 0,
        discounted_price: parseFloat(row.discounted_price) || 0,
        brand: row.brand || "",
        stock: parseInt(row.stock) || 0,
      });
    })
    .on("end", async () => {
      try {
        await Product.deleteMany();
        await Product.insertMany(results);
        console.log(`Imported ${results.length} products into MongoDB`);
      } catch (err) {
        console.error("Error importing products:", err);
      }
    });
};

// Sirf preview ke liye (console me 10 records dikhane wala)
export const previewProductsFromCSV = () => {
  if (!fs.existsSync(csvFilePath)) {
    console.error("❌ CSV file not found at:", csvFilePath);
    return;
  }

  const results = [];
  let count = 0;

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      if (count < 10) {
        results.push({
          uniq_id: row.uniq_id,
          product_name: row.product_name,
          brand: row.brand,
          retail_price: row.retail_price,
          discounted_price: row.discounted_price,
        });
        count++;
      }
    })
    .on("end", () => {
    //   console.log(" Preview of first 10 products from Kaggle dataset:");
    //   console.table(results); // table format me console
    });
};

