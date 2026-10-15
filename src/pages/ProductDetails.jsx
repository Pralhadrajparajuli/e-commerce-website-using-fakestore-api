import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";
import useToastStore from "../store/toastStore";
import useAuthStore from "../store/authStore";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  // Zustand: Cart
  const addToCart = useCartStore(
    (state) => state.addToCart
  );

  // Zustand: Wishlist
  const toggleWishlist = useWishlistStore(
    (state) => state.toggleWishlist
  );

  const isInWishlist = useWishlistStore(
    (state) => state.isInWishlist
  );

  // Zustand: Toast
  const showToast = useToastStore(
    (state) => state.showToast
  );

  // Zustand: Authentication
  const user = useAuthStore(
    (state) => state.user
  );

  const saleProductIds = [1, 3, 5, 7, 9];

  // Fetch product
  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      setProduct(null);

      try {
        const savedProducts =
          localStorage.getItem("products");

        if (savedProducts) {
          const saved = JSON.parse(savedProducts);

          const foundProduct = saved.find(
            (item) => item.id === Number(id)
          );

          if (foundProduct) {
            if (!cancelled) {
              setProduct(foundProduct);
            }

            return;
          }
        }

        const response = await fetch(
          `https://dummyjson.com/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        if (!cancelled) {
          setProduct(data);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setProduct(null);
        }
      }
    };

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!product) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p>Loading product...</p>
      </div>
    );
  }

  const isSale = saleProductIds.includes(product.id);

  const salePrice = isSale
    ? product.price * 0.8
    : product.price;

  // Add to cart
  const handleAddToCart = () => {
    if (!user) {
      showToast(
        "Please login to add products to cart",
        "error"
      );

      navigate("/login");
      return;
    }

    addToCart(product, quantity);

    showToast("Added to cart", "success");
  };

  // Add or remove wishlist item
  const handleWishlist = () => {
    if (!user) {
      showToast(
        "Please login to add products to wishlist",
        "error"
      );

      navigate("/login");
      return;
    }

    // The wishlist store handles both the update
    // and the corresponding toast notification.
    toggleWishlist(product);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Product Image */}
        <div className="relative flex min-h-[500px] items-center justify-center rounded-2xl bg-gray-100 p-10">
          <img
            src={
              product.image ||
              product.thumbnail ||
              product.images?.[0]
            }
            alt={product.title}
            className="max-h-[450px] w-full object-contain"
          />

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={
              isInWishlist(product.id)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100"
          >
            <Heart
              size={24}
              className={
                isInWishlist(product.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-700"
              }
            />
          </button>
        </div>

        {/* Product Information */}
        <div className="flex flex-col justify-center">
          <p className="mb-3 text-sm capitalize text-gray-500">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold text-gray-900">
            {product.title}
          </h1>

          {/* Price */}
          <div className="mt-5">
            {isSale ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-red-600">
                  ${salePrice.toFixed(2)}
                </span>

                <span className="text-lg text-gray-400 line-through">
                  ${product.price}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-gray-900">
                ${product.price}
              </span>
            )}
          </div>

          <p className="mt-6 leading-7 text-gray-600">
            {product.description}
          </p>

          {/* Size */}
          <div className="mt-8">
            <h3 className="mb-3 font-semibold">
              Select Size
            </h3>

            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map(
                (size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`rounded-lg border px-5 py-2 ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <h3 className="mb-3 font-semibold">
              Quantity
            </h3>

            <div className="flex w-fit items-center rounded-lg border">
              <button
                onClick={() =>
                  setQuantity((q) =>
                    Math.max(1, q - 1)
                  )
                }
                className="px-4 py-2 text-lg"
              >
                −
              </button>

              <span className="px-4">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((q) => q + 1)
                }
                className="px-4 py-2 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-4 font-semibold text-white transition hover:bg-gray-800"
          >
            <ShoppingCart size={20} />
            Add to Cart
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;