import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Cart
  const { addToCart } = useCart();

  // Wishlist
  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `https://fakestoreapi.com/products/${id}`
      );

      const data = await response.json();

      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <p className="py-20 text-center">
        Loading product...
      </p>
    );
  }

  const productInWishlist = isInWishlist(product.id);

  // Add product to cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      <div className="grid grid-cols-2 gap-12">

        {/* LEFT - Product Image */}
        <div className="flex h-[600px] items-center justify-center rounded-2xl bg-gray-100 p-10">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>

        {/* RIGHT - Product Information */}
        <div className="flex flex-col justify-center">

          {/* Product Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {product.title}
          </h1>

          {/* Price */}
          <p className="mt-5 text-2xl font-bold text-gray-900">
            ${product.price}
          </p>

          {/* Size */}
          <div className="mt-8">
            <h3 className="mb-3 font-semibold text-gray-900">
              Size
            </h3>

            <div className="flex gap-3">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-lg border px-5 py-2 ${
                    selectedSize === size
                      ? "border-black bg-black text-white"
                      : "border-gray-300 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + Add to Cart + Favorite */}
          <div className="mt-8 flex gap-3">

            {/* Quantity */}
            <div className="flex items-center rounded-lg border border-gray-300">

              <button
                onClick={() =>
                  setQuantity((quantity) =>
                    Math.max(1, quantity - 1)
                  )
                }
                className="px-4 py-3 text-xl hover:bg-gray-100"
              >
                −
              </button>

              <span className="min-w-12 px-4 text-center font-medium">
                {quantity}
              </span>

              <button
                onClick={() =>
                  setQuantity((quantity) => quantity + 1)
                }
                className="px-4 py-3 text-xl hover:bg-gray-100"
              >
                +
              </button>

            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
            >
              <ShoppingCart size={20} />
              Add to Cart
            </button>

            {/* Wishlist */}
            <button
              onClick={() => toggleWishlist(product)}
              className="flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 hover:bg-gray-100"
            >
              <Heart
                size={22}
                className={
                  productInWishlist
                    ? "fill-red-500 text-red-500"
                    : "text-gray-700"
                }
              />
            </button>

          </div>

          {/* Description */}
          <div className="mt-10 border-t pt-6">

            <h2 className="font-semibold text-gray-900">
              Product Description
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {product.description}
            </p>

          </div>

        </div>

      </div>

    </section>
  );
};

export default ProductDetails;