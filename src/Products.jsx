import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 9;

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        "https://fakestoreapi.com/products"
      );

      const data = await response.json();

      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Calculate products for current page
  const lastProductIndex = currentPage * productsPerPage;
  const firstProductIndex = lastProductIndex - productsPerPage;

  const currentProducts = products.slice(
    firstProductIndex,
    lastProductIndex
  );

  // Calculate total pages
  const totalPages = Math.ceil(
    products.length / productsPerPage
  );

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Previous page
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          All Products
        </h1>

        <p className="mt-2 text-gray-500">
          Explore our complete collection of products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">

        {currentProducts.map((product) => (
          <div key={product.id}>

            {/* Image box */}
            <div className="group relative h-80 overflow-hidden rounded-2xl bg-gray-100 p-6">

              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Heart - Top Right */}
              <button
                onClick={() => toggleWishlist(product)}
                className="absolute right-4 top-4 rounded-full bg-white p-2 text-gray-700 shadow-sm transition hover:text-red-500"
              >
                <Heart
                  size={20}
                  className={
                    isInWishlist(product.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-700"
                  }
                />
              </button>

              {/* Add to Cart - Bottom Center */}
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>

            </div>

            {/* Product Name */}
            <Link to={`/product/${product.id}`}>
              <h2 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600">
                {product.title}
              </h2>

              {/* Price */}
              <p className="mt-2 text-lg font-bold text-gray-900">
                ${product.price}
              </p>
            </Link>

          </div>
        ))}

      </div>

      {/* Pagination */}
      <div className="mt-12 flex items-center justify-center gap-6">

        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className="rounded-lg border px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Previous
        </button>

        <span className="font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="rounded-lg border px-5 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next →
        </button>

      </div>

    </section>
  );
};

export default Products;