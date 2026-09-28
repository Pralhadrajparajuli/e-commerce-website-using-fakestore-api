import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* About */}
        <div>
          <h2 className="text-2xl font-bold">TechStore</h2>

          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-400">
            Your one-stop online store for quality products at great prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <Link to="/" className="hover:text-white">
              Home
            </Link>

            <Link to="/products" className="hover:text-white">
              Shop
            </Link>

            <Link to="/sale" className="hover:text-white">
              Sale
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold">Categories</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
            <Link to="/products/electronics" className="hover:text-white">
              Electronics
            </Link>

            <Link to="/products/jewelery" className="hover:text-white">
              Jewelery
            </Link>

            <Link to="/products/men's clothing" className="hover:text-white">
              Men's Clothing
            </Link>

            <Link to="/products/women's clothing" className="hover:text-white">
              Women's Clothing
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold">Contact Us</h3>

          <div className="mt-4 space-y-4 text-sm text-gray-400">
            <p>Kathmandu, Nepal</p>

            <p>+977 9800000000</p>

            <p>support@techstore.com</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-sm text-gray-500 md:flex-row">
          <p>© 2026 TechStore. All rights reserved.</p>

          <div className="flex gap-5">
            <button className="hover:text-white">Privacy Policy</button>

            <button className="hover:text-white">Terms & Conditions</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
