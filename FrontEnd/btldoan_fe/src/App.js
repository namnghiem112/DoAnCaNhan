import logo from "./logo.svg";
import "./App.css";
import Navigation from "./customer/components/Nabar/Navigation";
import { Route, Routes, Navigate } from "react-router-dom"; // Thêm Navigate để chuyển hướng
import CustomerRoutes from "./Routers/CustomerRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/Action";
import AdminRoutes from "./Routers/AdminRoutes";

function App() {
  const { auth } = useSelector((store) => store); // Lấy trạng thái auth từ Redux
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt)); // Lấy thông tin người dùng nếu có JWT
    }
  }, [jwt, dispatch]);

  // Nếu chưa xác định thông tin auth, cho vào Customer (trang mặc định)
  if (!auth || !auth.user) {
    return (
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    );
  }

  // Nếu người dùng chưa có quyền Admin, chuyển hướng về Customer
  if (auth.user.role?.roleName !== "ROLE_ADMIN") {
    return (
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
      </Routes>
    );
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<CustomerRoutes />} />
        {/* Kiểm tra vai trò của người dùng trước khi render AdminRoutes */}
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </div>
  );
}

export default App;
