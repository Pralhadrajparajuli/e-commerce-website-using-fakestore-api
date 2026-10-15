import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingCart } from "lucide-react";

import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useToastStore from "../store/toastStore";
import useAuthStore from "../store/authStore";

import { getProducts } from "../api/productApi";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();

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

  // Zustand cart store
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // Zustand wishlist store
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const isInWishlist = useWishlistStore(
    (state) => state.isInWishlist
  );

  // Zustand toast store
  const showToast = useToastStore(
    (state) => state.showToast
  );

  // Zustand authentication store
  const user = useAuthStore(
    (state) => state.user
  );

  // Sale product IDs
  const saleProductIds = [1, 3, 5, 7, 9];

  // Get products from selected category
  const categoryProducts = products.filter(
    (product) =>
      product.category?.toLowerCase() ===
      category?.toLowerCase()
  );

  // Add product to cart
  const handleAddToCart = (product) => {
    // Guests must log in first
    if (!user) {
      showToast(
        "Please log in to add products to your cart.",
        "error"
      );

      navigate("/login");
      return;
    }

    addToCart(product);

    showToast("Product added to cart", "success");
  };

  // Add/remove product from wishlist
  const handleWishlist = (product) => {
    // Guests must log in first
    if (!user) {
      showToast(
        "Please log in to manage your wishlist.",
        "error"
      );

      navigate("/login");
      return;
    }

    // The Zustand wishlist store already displays a toast
    toggleWishlist(product);
  };

  // Loading state
  if (isLoading) {
    return (
      <p className="py-10 text-center">
        Loading products...
      </p>
    );
  }

  // Error state
  if (isError) {
    return (
      <p className="py-10 text-center text-red-500">
        {error?.message || "Failed to fetch products."}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold capitalize text-gray-900">
          {category}
        </h1>

        <p className="mt-2 text-gray-500">
          Explore products from this category
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">
        {categoryProducts.map((product) => {
          // Check if product is on sale
          const isSale = saleProductIds.includes(
            product.id
          );

          // Original price
          const originalPrice = Number(product.price);

          // Sale price
          const salePrice = isSale
            ? Number((originalPrice * 0.8).toFixed(2))
            : originalPrice;

          return (
            <div
              key={product.id}
              className="group"
            >
              {/* Image + Buttons */}
              <div className="relative">
                {/* Product Image */}
                <Link to={`/product/${product.id}`}>
                  <div className="h-80 overflow-hidden rounded-2xl bg-gray-100 p-6">
                    <img
                      src={
                        product.thumbnail ||
                        product.image ||
                        product.images?.[0]
                      }
                      alt={product.title}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Sale Badge */}
                {isSale && (
                  <span className="absolute left-4 top-4 rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    SALE
                  </span>
                )}

                {/* Heart Button */}
                <button
                  onClick={() => handleWishlist(product)}
                  aria-label="Toggle wishlist"
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
                  onClick={() => handleAddToCart(product)}
                  className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-800"
                >
                  <ShoppingCart size={17} />
                  Add to Cart
                </button>
              </div>

              {/* Title + Price */}
              <Link to={`/product/${product.id}`}>
                <h2 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-blue-600">
                  {product.title}
                </h2>

                {/* Price */}
                {isSale ? (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-lg font-bold text-red-500">
                      ${salePrice}
                    </p>

                    <p className="text-sm text-gray-400 line-through">
                      ${originalPrice}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    ${originalPrice}
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* No products */}
      {categoryProducts.length === 0 && (
        <p className="py-10 text-center text-gray-500">
          No products found in this category.
        </p>
      )}
    </section>
  );
};

export default CategoryProducts;