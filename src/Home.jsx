import { useEffect, useState } from "react";
import PromoGrid from "./PromoGrid";
import CategorySection from "./CategorySection";
import TrendingNow from "./TrendingNow";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First check updated products from localStorage
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
          return;
        }

        // If localStorage is empty, get products from DummyJSON
        const response = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Save products for the rest of the website
        localStorage.setItem(
          "products",
          JSON.stringify(data.products)
        );

        setProducts(data.products);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="py-10 text-center">
        Loading...
      </p>
    );
  }

  if (error) {
    return (
      <p className="py-10 text-center text-red-500">
        {error}
      </p>
    );
  }

  return (
    <main>
      <PromoGrid products={products} />

      <CategorySection products={products} />

      <TrendingNow products={products} />
    </main>
  );
};

export default Home;