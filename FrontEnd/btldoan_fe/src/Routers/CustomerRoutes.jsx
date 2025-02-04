import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { customerTheme } from "../customer/them/customeThem";
import Navigation from "../customer/components/Nabar/Navigation";
import Footer from "../customer/components/Footer/Footer";
import HomePage from "../customer/pages/HomePage";
import LoginUserForm from "../customer/components/Auth/Login";
import RegisterUserForm from "../customer/components/Auth/Register";
import Account from "../customer/components/Account/Account";
import ProductDetail from "../customer/components/Product/ProductDetail";
import SearchProduct from "../customer/components/Product/SearchProduct";
import Cart from "../customer/components/Cart/Cart";
import Order from "../customer/components/Order/Order";
import Payment from "../customer/components/Cart/Payment";
import FloatingButtons from "../customer/components/Button/FloatingButtons";
const CustomerRoutes = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "*";
  return (
    <div>
      <ThemeProvider theme={customerTheme}>
        {showNavigation && <Navigation />}
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<HomePage />}></Route>
          <Route path="/register" element={<HomePage />}></Route>
          <Route path="/forgot" element={<HomePage />}></Route>
          <Route path="/reset" element={<HomePage />}></Route>
          <Route path="/account" element={<Account />}></Route>
          <Route path="/products/id/:productId" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/products/search" element={<SearchProduct />}></Route>
          <Route path="/order" element={<Order />}></Route>
          <Route path="/payment" element={<Payment />}></Route>
        </Routes>
        <Footer />
        <FloatingButtons />
      </ThemeProvider>
    </div>
  );
};

export default CustomerRoutes;
