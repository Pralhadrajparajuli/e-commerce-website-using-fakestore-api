import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { Heart, ShoppingCart } from "lucide-react";

import useCartStore from "./store/cartStore";
import { useWishlist } from "./WishlistContext";
import { useToast } from "./ToastContext";

const Products = ({ saleOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { category } = useParams();
  const [searchParams] = useSearchParams();

  const searchText = searchParams.get("search") || "";

  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const { showToast } = useToast();

  const productsPerPage = 9;

  const saleProductIds = [1, 3, 5, 7, 9];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
          return;
        }

        const response = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        setProducts(data.products);

        localStorage.setItem(
          "products",
          JSON.stringify(data.products)
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.category.toLowerCase() ===
        category.toLowerCase()
    );
  }

  if (searchText) {
    filteredProducts = filteredProducts.filter((product) =>
      product.title
        .toLowerCase()
        .includes(searchText.toLowerCase())
    );
  }

  if (saleOnly) {
    filteredProducts = filteredProducts.filter((product) =>
      saleProductIds.includes(product.id)
    );
  }

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / productsPerPage
  );

  const startIndex =
    (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handleAddToCart = (product) => {
    addToCart(product);
    showToast("Added to cart");
  };

  const handleWishlist = (product) => {
    const alreadyInWishlist = isInWishlist(product.id);

    toggleWishlist(product);

    if (alreadyInWishlist) {
      showToast("Removed from wishlist", "error");
    } else {
      showToast("Added to wishlist");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        {category
          ? category.charAt(0).toUpperCase() +
            category.slice(1)
          : saleOnly
          ? "Sale"
          : "All Products"}
      </h1>

      {/* Products */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {currentProducts.map((product) => {
          const isSale = saleProductIds.includes(product.id);

          const salePrice = isSale
            ? product.price * 0.8
            : product.price;

          return (
            <div
              key={product.id}
              className="group"
            >
              {/* Image */}
              <div className="relative">
                <Link to={`/product/${product.id}`}>
                  <div className="h-80 overflow-hidden rounded-2xl bg-gray-100 p-6">
                    <img
                      src={
                        product.thumbnail ||
                        product.images?.[0]
                      }
                      alt={product.title}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Wishlist */}
                <button
                  onClick={() =>
                    handleWishlist(product)
                  }
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-gray-100"
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

                {/* Add to Cart */}
                <button
                  onClick={() =>
                    handleAddToCart(product)
                  }
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-800"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>
              </div>

              {/* Product Information */}
              <Link to={`/product/${product.id}`}>
                <h3 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-blue-600">
                  {product.title}
                </h3>

                <div className="mt-2">
                  {isSale ? (
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-600">
                        ${salePrice.toFixed(2)}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ${product.price}
                      </span>
                    </div>
                  ) : (
                    <p className="text-lg font-bold text-gray-900">
                      ${product.price}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from(
            { length: totalPages },
            (_, index) => index + 1
          ).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`rounded-lg px-4 py-2 ${
                currentPage === page
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Products;