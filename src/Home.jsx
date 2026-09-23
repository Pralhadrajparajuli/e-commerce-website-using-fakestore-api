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
        const response = await fetch("https://fakestoreapi.com/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <p className="py-10 text-center">Loading...</p>;
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