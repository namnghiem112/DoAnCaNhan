import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { customerTheme } from "../customer/them/customeThem";
import Navigation from "../Admin/components/Nabar/Navigation";
import Footer from "../Admin/components/Footer/Footer";
import HomePage from "../Admin/components/pages/HomePage";
const AdminRoutes = () => {
  const location = useLocation();
  const showNavigation = location.pathname !== "*";
  return (
    <div>
      <ThemeProvider theme={customerTheme}>
        {showNavigation && <Navigation />}
        <Routes>
          <Route path="/*" element={<HomePage />}></Route>
        </Routes>
        <Footer />
      </ThemeProvider>
    </div>
  );
};

export default AdminRoutes;
