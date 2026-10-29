require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Validate product fields
const isValidProduct = (product) =>
  product &&
  typeof product.title === "string" &&
  product.title.trim().length > 0 &&
  typeof product.price === "number" &&
  Number.isFinite(product.price) &&
  product.price > 0 &&
  typeof product.category === "string" &&
  product.category.trim().length > 0;

// Find the next available numeric product ID
const getNextProductId = async () => {
  const products = await Product.find({}, { id: 1 }).lean();

  const highestId = products.reduce((maxId, product) => {
    return Number.isInteger(product.id) && product.id > 0
      ? Math.max(maxId, product.id)
      : maxId;
  }, 0);

  return highestId + 1;
};

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to my E-commerce Backend!");
});

// POST: Migrate older products to numeric IDs
app.post("/api/products/migrate-ids", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ _id: 1 });

    // Find the highest existing valid numeric ID
    const highestId = products.reduce((maxId, product) => {
      return Number.isInteger(product.id) && product.id > 0
        ? Math.max(maxId, product.id)
        : maxId;
    }, 0);

    let nextId = highestId + 1;
    let updatedCount = 0;

    // Give missing or invalid IDs to older products
    for (const product of products) {
      if (!Number.isInteger(product.id) || product.id < 1) {
        product.id = nextId;

        await product.save();

        nextId++;
        updatedCount++;
      }
    }

    res.status(200).json({
      message: "Product ID migration completed successfully!",
      updatedCount,
    });
  } catch (error) {
    next(error);
  }
});

// GET: Fetch all products
app.get("/api/products", async (req, res, next) => {
  try {
    const products = await Product.find().sort({ id: 1 });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// GET: Fetch one product by numeric ID
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Product ID must be a positive number.",
      });
    }

    const product = await Product.findOne({ id });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// POST: Add one or multiple products
app.post("/api/products", async (req, res, next) => {
  try {
    const data = req.body;
    const newProducts = Array.isArray(data) ? data : [data];

    if (newProducts.length === 0 || !newProducts.every(isValidProduct)) {
      return res.status(400).json({
        message:
          "Provide products with a valid title, positive numeric price, and category.",
      });
    }

    // Generate numeric IDs automatically
    let nextId = await getNextProductId();

    const productsToSave = newProducts.map((product) => ({
      id: nextId++,
      title: product.title.trim(),
      price: product.price,
      category: product.category.trim(),
      description: product.description || "",
      image: product.image || product.thumbnail || "",
    }));

    const addedProducts = await Product.insertMany(productsToSave);

    res.status(201).json({
      message: "Product(s) added successfully!",
      products: addedProducts,
    });
  } catch (error) {
    next(error);
  }
});

// PUT: Update a product by numeric ID
app.put("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Product ID must be a positive number.",
      });
    }

    if (!isValidProduct(req.body)) {
      return res.status(400).json({
        message:
          "Valid title, positive numeric price, and category are required.",
      });
    }

    const { title, price, category, description, image, thumbnail } = req.body;

    const updatedProduct = await Product.findOneAndUpdate(
      { id },
      {
        title: title.trim(),
        price,
        category: category.trim(),
        description: description || "",
        image: image || thumbnail || "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedProduct) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    res.status(200).json({
      message: "Product updated successfully!",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
});

// Delete a product from MongoDB
app.delete("/api/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await Product.findOneAndDelete({ id });

    if (!deletedProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found.",
  });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON in request body.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      message: "A product with this ID already exists.",
    });
  }

  res.status(500).json({
    message: "Something went wrong on the server.",
  });
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
