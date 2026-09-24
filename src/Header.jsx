import { useState } from "react";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useAuth } from "./AuthContext";

import CartDrawer from "./CartDrawer";
import WishlistDrawer from "./WishlistDrawer";

const Header = () => {
  // Cart data
  const { cartCount } = useCart();

  // Wishlist data
  const { wishlistCount } = useWishlist();

  // Authentication data
  const { user, logout } = useAuth();

  // Drawer states
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Product dropdown
  const [productsOpen, setProductsOpen] = useState(false);

  // User dropdown
  const [userOpen, setUserOpen] = useState(false);

  // Search
  const [searchText, setSearchText] = useState("");

  const navigate = useNavigate();

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchText.trim()) {
      navigate(
        `/products?search=${encodeURIComponent(searchText.trim())}`
      );
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate("/");
  };

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

            {/* Home */}
            <Link
              to="/"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div className="relative">

              <button
                onClick={() => setProductsOpen(!productsOpen)}
                className="flex items-center gap-1 whitespace-nowrap hover:text-blue-600"
              >
                Products

                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    productsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {productsOpen && (
                <div className="absolute left-0 top-full z-50 mt-3 w-56 rounded-lg border bg-white py-2 shadow-lg">

                  {/* Electronics */}
                  <Link
                    to="/products/electronics"
                    onClick={() => setProductsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Electronics
                  </Link>

                  {/* Jewelery */}
                  <Link
                    to="/products/jewelery"
                    onClick={() => setProductsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Jewelery
                  </Link>

                  {/* Men's Clothing */}
                  <Link
                    to="/products/men's clothing"
                    onClick={() => setProductsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Men's Clothing
                  </Link>

                  {/* Women's Clothing */}
                  <Link
                    to="/products/women's clothing"
                    onClick={() => setProductsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                  >
                    Women's Clothing
                  </Link>

                </div>
              )}

            </div>

            {/* Shop */}
            <Link
              to="/products"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Shop
            </Link>

            {/* Sale */}
            <Link
              to="/sale"
              className="whitespace-nowrap hover:text-blue-600"
            >
              Sale
            </Link>

          </nav>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="ml-auto flex w-64 items-center rounded-lg border px-3 py-2"
          >
            <Search size={20} />

            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="ml-2 w-full text-sm outline-none"
            />
          </form>

          {/* Icons */}
          <div className="flex shrink-0 items-center gap-3">

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative rounded-lg border p-2.5 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <Heart size={22} />

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

              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">

              <button
                onClick={() => setUserOpen(!userOpen)}
                className="rounded-lg border p-2.5 transition hover:bg-gray-100 hover:text-blue-600"
              >
                <User size={22} />
              </button>

              {/* User Dropdown */}
              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-52 rounded-lg border bg-white py-2 shadow-lg">

                  {user ? (
                    <>
                      {/* Logged In User */}
                      <div className="border-b px-4 py-3">
                        <p className="text-xs text-gray-500">
                          Signed in as
                        </p>

                        <p className="font-semibold">
                          {user.name}
                        </p>
                      </div>

                      {/* Account */}
                      <Link
                        to="/account"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100"
                      >
                        My Account
                      </Link>

                      {/* Logout */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-red-500 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Sign In */}
                      <Link
                        to="/login"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                      >
                        Sign In
                      </Link>

                      {/* Register */}
                      <Link
                        to="/login"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-3 hover:bg-gray-100 hover:text-blue-600"
                      >
                        Register
                      </Link>
                    </>
                  )}

                </div>
              )}

            </div>

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