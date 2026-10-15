import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Payment from "./components/Payment";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CategoryProducts from "./pages/CategoryProducts";
import Login from "./pages/Login";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Toast from "./components/Toast";

import useAuthStore from "./store/authStore";
const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryProducts />} />
        <Route path="/sale" element={<Products saleOnly={true} />} />
        <Route path="/products/:category" element={<Products />} />
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<Account />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>

      <Footer />
      <Toast />
    </>
  );
};

export default App;
