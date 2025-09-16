// routes/csvRoutes.js
import express from "express";
import fs from "fs";
import csv from "csv-parser";
import path from "path";
import { fileURLToPath } from "url";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvFilePath = path.join(__dirname, "../data/flipkart_com-ecommerce_sample.csv");

// Preview products from CSV (admin-only)
router.get("/preview", protect, admin, (req, res) => {
  const results = [];
  let count = 0;

  if (!fs.existsSync(csvFilePath)) {
    return res.status(404).json({ message: "CSV file not found" });
  }

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
      res.json(results);
    });
});

export default router;
