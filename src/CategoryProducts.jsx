import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

// Import cart and wishlist
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const CategoryProducts = () => {
  const { category } = useParams();

  const [products, setProducts] = useState([]);

  // Cart
  const { addToCart } = useCart();

  // Wishlist
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

        {categoryProducts.map((product) => (
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
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>

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

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-3 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-gray-800"
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>

            </div>

            {/* Title */}
            <Link to={`/product/${product.id}`}>
              <h2 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900 transition group-hover:text-blue-600">
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