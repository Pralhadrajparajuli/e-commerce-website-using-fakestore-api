import { Routes, Route } from "react-router-dom";

import Header from "./Header";
import Home from "./Home";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import CategoryProducts from "./CategoryProducts";
import Login from "./Login";
// import Cart from "./Cart";

const App = () => {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/category/:category" element={<CategoryProducts/>} />
        <Route path="/sale" element={<Products saleOnly={true} />}/>
        <Route path="/products/:category" element={<Products />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/cart" element={<Cart />}/> */}
      </Routes>
    </>
  );
};

export default App;