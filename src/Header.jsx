import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";
const Header = () => {
  // Cart data
  const { cartCount } = useCart();

  // Wishlist data
  const { wishlistCount } = useWishlist();

  // Drawer states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">

        <div className="mx-auto flex max-w-7xl items-center gap-8 px-6 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2"
          >
            <img
              src="/src/assets/logo.svg"
              alt="TechStore Logo"
              className="h-20 w-30 object-contain"
            />
          </Link>


          {/* Navbar */}
          <nav className="flex items-center gap-7 text-base font-semibold">

            <Link
              to="/"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Products
            </Link>

            <Link
              to="/shop"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Shop
            </Link>

            <Link
              to="/sale"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Sale
            </Link>

          </nav>


          {/* Search */}
          <div className="ml-auto flex w-64 items-center rounded-lg border px-3 py-2">

            <Search size={20} />

            <input
              type="text"
              placeholder="Search products..."
              className="ml-2 w-full text-sm outline-none"
            />

          </div>


          {/* Icons */}
          <div className="flex shrink-0 items-center gap-3">

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-lg border p-2.5 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <Heart size={22} />

              {/* Wishlist Count */}
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                  {wishlistCount}
                </span>
              )}
            </button>


            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg border p-2.5 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <ShoppingCart size={22} />

              {/* Cart Count */}
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>


            {/* User */}
            <button
              className="rounded-lg border p-2.5 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <User size={22} />
            </button>

          </div>

        </div>

      </header>


      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />


      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={wishlistOpen}
        onClose={() => setWishlistOpen(false)}
      />

    </>
  );
};

export default Header;