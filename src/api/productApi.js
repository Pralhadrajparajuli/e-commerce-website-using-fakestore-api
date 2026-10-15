const API_URL = "https://dummyjson.com/products";

// Fetch products
export const getProducts = async () => {
  // Check for products saved by the admin
  const savedProducts = localStorage.getItem("products");

  if (savedProducts !== null) {
    try {
      return JSON.parse(savedProducts);
    } catch {
      localStorage.removeItem("products");
    }
  }

  // Fetch products from DummyJSON if no saved products exist
  const response = await fetch(`${API_URL}?limit=0`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data.products;
};