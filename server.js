// server.js
import path, { dirname } from "path";
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminReportsRoutes from "./routes/adminReportsRoutes.js";
import csvRoutes from "./routes/csvRoutes.js"; // CSV Preview
import Category from "./models/category.js";
import multer from "multer";
import { fileURLToPath } from "url";

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://eshop-frontend-public-s4m1-q3ta9yodx-mayankyadav02s-projects.vercel.app", // ✅ your Vercel frontend
];


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: "http://localhost:3000",
//   credentials: true
// }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // agar cookies ya auth tokens use karte ho
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.get("/api", (req, res) => {
  res.send("API is running...");
});
// app.get("/api/test-categories", async (req, res) => {
//   const cats = await Category.find();
//   console.log("DB categories:", cats.length);
//   res.json(cats);
// });

// ✅ Health check endpoint
app.get("/healthz", (req, res) => res.send("OK"));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", analyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/reports", adminReportsRoutes);
app.use("/api/admin/categories", categoryRoutes);

app.use("/api/csv", csvRoutes); // CSV preview (admin restricted)

// uploads folder ko static access dena
// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// ✅ Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Serve uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Multer error handling (important!)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  } else if (err) {
    return res.status(500).json({ message: err.message });
  }
  next();
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


app.get("/healthz", (req, res) => res.send("OK"));
