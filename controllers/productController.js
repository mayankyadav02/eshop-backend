// controllers/productController.js
import Product from "../models/Product.js";

// Get all products (search, filter, sort, pagination)
// const getProducts = async (req, res) => {
//   try {
//     const pageSize = Number(req.query.pageSize) || 15;
//     const page = Number(req.query.pageNumber) || 1;

//     // ✅ Search (product_name + name)
//     const keyword = req.query.keyword
//       ? {
//           $or: [
//             { product_name: { $regex: req.query.keyword, $options: "i" } },
//             { name: { $regex: req.query.keyword, $options: "i" } },
//           ],
//         }
//       : {};

//     // ✅ Category filter
//     const category = req.query.category ? { category: req.query.category } : {};

// const getProducts = async (req, res) => {
//   try {
//     const isTop = req.query.top === "true";

//     if (isTop) {
//       const products = await Product.find({})
//         .sort({ total_reviews: -1, overall_rating: -1 })
//         .limit(12)
//         .select("product_name name category price overall_rating total_reviews images createdAt");
//       return res.json({ products });
//     }

//     const pageSize = Number(req.query.pageSize) || 15;
//     const page = Number(req.query.pageNumber) || 1;

//     // Search Keyword (product_name OR name)
//     let keyword = {};
//     if (req.query.keyword) {
//       keyword = {
//         $or: [
//           { product_name: { $regex: req.query.keyword, $options: "i" } },
//           { name: { $regex: req.query.keyword, $options: "i" } }
//         ]
//       }
//     }
//     const category = req.query.category ? { category: req.query.category } : {};

//     // // ✅ Price filter
//     // const priceFilter = {};
//     // if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
//     // if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
//     // const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

// // priceRange param example: "0-500", "501-1000" etc.

// let price = {};
// if (req.query.priceRange) {
//   const [minStr, maxStr] = req.query.priceRange.split("-");
//   const min = Number(minStr);
//   const max = Number(maxStr);

//   if (!isNaN(min) && !isNaN(max)) {
//     price = { price: { $gte: min, $lte: max } };
//   }
// } else {
//   const priceFilter = {};
//   if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
//   if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
//   if (Object.keys(priceFilter).length) price = { price: priceFilter };
// }


//     // ✅ Rating filter
//     const rating = req.query.rating
//       ? { overall_rating: { $gte: Number(req.query.rating) } }
//       : {};

//     // ✅ Final filter
//     const filter = { ...keyword, ...category, ...price, ...rating };

//     // ✅ Sorting
//     let sort = {};
//     switch (req.query.sortBy) {
//       case "lowest":
//         sort = { price: 1 };
//         break;
//       case "highest":
//         sort = { price: -1 };
//         break;
//       case "newest":
//         sort = { createdAt: -1 };
//         break;
//       case "popular":
//         sort = { overall_rating: -1 };
//         break;
//       case "reviews": // Most Reviewed
//         sort = { total_reviews: -1 };
//         break;
//       default:
//         sort = { createdAt: -1 }; // default latest products
//     }

//     // ✅ Total count
//     const count = await Product.countDocuments(filter);

//     // ✅ Products fetch
//     const products = await Product.find(filter)
//       .sort(sort)
//       .limit(pageSize)
//       .skip(pageSize * (page - 1))
//       .select("product_name name category price overall_rating total_reviews images createdAt"); // fixed fields so equal size

//     // ✅ Response
//     res.json({
//       products,
//       page,
//       pages: Math.ceil(count / pageSize),
//       total: count,
//       pageSize,
//     });
//   } catch (err) {
//     console.error("getProducts error:", err);
//     res.status(500).json({ message: "Server Error" });
//   }
//     };
//     if (req.query.keyword || req.query.category) {
//       const products = await Product.find(filter)
//         .sort({ createdAt: -1 })
//         .limit(60)
//         .select("product_name name category price overall_rating total_reviews images createdAt");
//       return res.json({ products, page: 1, pages: 1 });
//     }

//     const count = await Product.countDocuments(filter);
//     const sort = { createdAt: -1 };
//     const products = await Product.find(filter)
//       .sort(sort)
//       .limit(pageSize)
//       .skip(pageSize * (page - 1))
//       .select("product_name name category price overall_rating images createdAt");

//     res.json({ products, page, pages: Math.ceil(count / pageSize), total: count, pageSize });
//   } catch (err) {
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const getProducts = async (req, res) => {
  try {
    const isTop = req.query.top === "true";

    if (isTop) {
      const products = await Product.find({})
        .sort({ total_reviews: -1, overall_rating: -1 })
        .limit(15)
        .select("product_name name category price overall_rating total_reviews images createdAt");
      return res.json({ products });
    }

    const pageSize = Number(req.query.pageSize) || 15;
    const page = Number(req.query.pageNumber) || 1;

    // ✅ Search
    let keyword = {};
    if (req.query.keyword) {
      keyword = {
        $or: [
          { product_name: { $regex: req.query.keyword, $options: "i" } },
          { name: { $regex: req.query.keyword, $options: "i" } }
        ]
      };
    }

    // ✅ Category
    const category = req.query.category ? { category: req.query.category } : {};

    // ✅ Price
    let price = {};
    if (req.query.priceRange) {
      const [minStr, maxStr] = req.query.priceRange.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);
      if (!isNaN(min) && !isNaN(max)) {
        price = { price: { $gte: min, $lte: max } };
      }
    } else {
      const priceFilter = {};
      if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
      if (Object.keys(priceFilter).length) price = { price: priceFilter };
    }

    // ✅ Rating
    const rating = req.query.rating
      ? { overall_rating: { $gte: Number(req.query.rating) } }
      : {};

    // ✅ Final filter
    const filter = { ...keyword, ...category, ...price, ...rating };

    // // ✅ If only search or category (special quick result)
    // if (req.query.keyword || req.query.category) {
    //   const products = await Product.find(filter)
    //     .sort({ createdAt: -1 })
    //     .limit(60)
    //     .select("product_name name category price overall_rating total_reviews images createdAt");
    //   return res.json({ products, page: 1, pages: 1 });
    // }

    // ✅ Sorting
    let sort = {};
    switch (req.query.sortBy) {
      case "lowest":
        sort = { price: 1 };
        break;
      case "highest":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { overall_rating: -1 };
        break;
      case "rating": // 👈 Add this for Top Rated
    sort = { overall_rating: -1 };
    break;
      case "reviews":
        sort = { total_reviews: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // ✅ Count & Fetch
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .select("product_name name category price overall_rating total_reviews images createdAt");

    // ✅ Response
    res.json({
      success: true,
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      pageSize,
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
