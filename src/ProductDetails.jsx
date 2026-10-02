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

  // Sale product IDs
  const saleProductIds = [1, 3, 5, 7, 9];

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First check localStorage
        const savedProducts = localStorage.getItem("products");

        if (savedProducts) {
          const products = JSON.parse(savedProducts);

          const foundProduct = products.find(
            (product) => String(product.id) === String(id)
          );

          if (foundProduct) {
            setProduct(foundProduct);
            return;
          }
        }

        // If product is not found in localStorage,
        // fetch from DummyJSON
        const response = await fetch(
          `https://dummyjson.com/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading
  if (!product) {
    return (
      <p className="py-20 text-center">
        Loading product...
      </p>
    );
  }

  // Check if product is on sale
  const isSale = saleProductIds.includes(product.id);

  // Original price
  const originalPrice = Number(product.price);

  // Sale price
  const salePrice = isSale
    ? Number((originalPrice * 0.8).toFixed(2))
    : originalPrice;

  const productInWishlist = isInWishlist(product.id);

  // Add product to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      <div className="grid grid-cols-2 gap-12">

        {/* LEFT - Product Image */}
        <div className="flex h-[600px] items-center justify-center rounded-2xl bg-gray-100 p-10">

          <img
            src={
              product.images?.[0] ||
              product.thumbnail ||
              product.image
            }
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
          {isSale ? (
            <div className="mt-5 flex items-center gap-3">

              {/* Sale Price */}
              <p className="text-2xl font-bold text-red-500">
                ${salePrice}
              </p>

              {/* Original Price */}
              <p className="text-lg text-gray-400 line-through">
                ${originalPrice}
              </p>

            </div>
          ) : (
            <p className="mt-5 text-2xl font-bold text-gray-900">
              ${originalPrice}
            </p>
          )}

          {/* Sale Badge */}
          {isSale && (
            <span className="mt-3 w-fit rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white">
              SALE
            </span>
          )}

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