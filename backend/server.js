const express = require("express");

const app = express();
const PORT = 5001;
app.use(express.json());
const products = [
  {
    id: 1,
    title: "iPhone 17",
    price: 999,
    category: "smartphones",
  },
  {
    id: 2,
    title: "MacBook Air",
    price: 1299,
    category: "laptops",
  },
];
app.get("/", (req, res) => {
  res.send("Welcome to my E-commerce Backend!");
});
app.get("/api/products", (req, res) => {
  res.json(products);
});

// POST API: Add one or multiple products
app.post("/api/products", (req, res) => {
  const data = req.body;

  // Convert a single product into an array
  const newProducts = Array.isArray(data) ? data : [data];

  // Validate all products
  const invalidProduct = newProducts.some(
    (product) =>
      !product.title ||
      typeof product.price !== "number" ||
      product.price <= 0 ||
      !product.category
  );

  if (invalidProduct) {
    return res.status(400).json({
      message: "Please provide a valid title, price, and category for every product.",
    });
  }
  const addedProducts = newProducts.map((product) => {
    const newProduct = {
      id: products.length + 1,
      title: product.title,
      price: product.price,
      category: product.category,
    };

    products.push(newProduct);

    return newProduct;
  });
  
  res.status(201).json({
    message: "Product(s) added successfully!",
    products: addedProducts,
  });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});