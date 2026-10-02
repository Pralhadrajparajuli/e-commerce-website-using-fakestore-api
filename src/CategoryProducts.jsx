import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const CategoryProducts = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  // Sale product IDs
  const saleProductIds = [1, 3, 5, 7, 9];

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First check localStorage
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          setProducts(JSON.parse(savedProducts));
          return;
        }

        // If localStorage is empty, fetch from DummyJSON
        const response = await fetch(
          "https://dummyjson.com/products?limit=0"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Save products to localStorage
        localStorage.setItem(
          "products",
          JSON.stringify(data.products)
        );

        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Get products from selected category
  const categoryProducts = products.filter(
    (product) => product.category === category
  );

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
          const isSale = saleProductIds.includes(product.id);

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
                  onClick={() => toggleWishlist(product)}
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
                  onClick={() => addToCart(product)}
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