import { useQuery } from "@tanstack/react-query";

import PromoGrid from "../components/PromoGrid";
import CategorySection from "../components/CategorySection";
import TrendingNow from "../components/TrendingNow";

import { getProducts } from "../api/productApi";

const Home = () => {
  // Fetch products using TanStack Query
  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // Loading state
  if (isLoading) {
    return (
      <p className="py-10 text-center">
        Loading...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="py-10 text-center text-red-500">
        {error.message || "Failed to fetch products."}
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