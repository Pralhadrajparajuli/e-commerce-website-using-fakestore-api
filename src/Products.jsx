import { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router-dom";

import { Heart, ShoppingCart } from "lucide-react";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

const Products = ({ saleOnly = false }) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); 

  const productsPerPage = 9;

  const { category } = useParams();

  const [searchParams] = useSearchParams();
  const searchText = searchParams.get("search") || "";

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  // Load products from localStorage or DummyJSON
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

  const saleProductIds = [1, 3, 5, 7, 9];

  const productsWithSale = products.map((product) => {
    const isSale = saleProductIds.includes(product.id);

    return {
      ...product,
      isSale,
      originalPrice: product.price,
      salePrice: isSale
        ? Number((product.price * 0.8).toFixed(2))
        : product.price,
    };
  });

  let displayedProducts = productsWithSale;

  // Search filter
  if (searchText) {
    const search = searchText.toLowerCase();

    displayedProducts = displayedProducts.filter(
      (product) =>
        product.title?.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search)
    );
  }

  // Category filter
  if (category) {
    displayedProducts = displayedProducts.filter(
      (product) => product.category === category
    );
  }

  // Sale filter
  if (saleOnly) {
    displayedProducts = displayedProducts.filter(
      (product) => product.isSale
    );
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [category, saleOnly, searchText]);

  const lastProductIndex =
    currentPage * productsPerPage;

  const firstProductIndex =
    lastProductIndex - productsPerPage;

  const currentProducts = displayedProducts.slice(
    firstProductIndex,
    lastProductIndex
  );

  const totalPages = Math.ceil(
    displayedProducts.length / productsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getTitle = () => {
    if (searchText) {
      return `Search results for "${searchText}"`;
    }

    if (saleOnly) {
      return "Sale Products";
    }

    if (!category) {
      return "All Products";
    }

    return category;
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12">

      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold capitalize text-gray-900">
          {getTitle()}
        </h1>

        <p className="mt-2 text-gray-500">
          {searchText
            ? "Products matching your search"
            : saleOnly
            ? "Grab these products at special prices"
            : category
            ? `Explore our ${category} collection`
            : "Explore our complete collection of products"}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-10">

        {currentProducts.map((product) => (
          <div key={product.id}>

            {/* Image Box */}
            <div className="group relative h-80 overflow-hidden rounded-2xl bg-gray-100 p-6">

              <Link to={`/product/${product.id}`}>
                <img
                  src={
                    product.thumbnail ||
                    product.image ||
                    product.images?.[0]
                  }
                  alt={product.title}
                  className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                />
              </Link>

              {/* Sale Badge */}
              {product.isSale && (
                <span className="absolute left-4 top-4 rounded-md bg-red-500 px-3 py-1 text-xs font-bold text-white">
                  SALE
                </span>
              )}

              {/* Wishlist */}
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

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(product)}
                className="absolute bottom-4 left-1/2 flex -translate-x-1/2 translate-y-2 items-center gap-2 rounded-lg bg-black px-5 py-2 text-sm font-medium text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            {/* Product Information */}
            <Link to={`/product/${product.id}`}>

              <h2 className="mt-4 line-clamp-2 text-base font-semibold text-gray-900 hover:text-blue-600">
                {product.title}
              </h2>

              {product.isSale ? (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-lg font-bold text-red-500">
                    ${product.salePrice}
                  </p>

                  <p className="text-sm text-gray-400 line-through">
                    ${product.originalPrice}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-lg font-bold text-gray-900">
                  ${product.price}
                </p>
              )}

            </Link>
          </div>
        ))}

      </div>

      {/* No Products */}
      {displayedProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-gray-700">
            No products found
          </p>

          {searchText && (
            <p className="mt-2 text-gray-500">
              Try searching with another product name.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
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
      )}

    </section>
  );
};

export default Products;