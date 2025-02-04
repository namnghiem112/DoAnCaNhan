import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout, updateUser } from "../../../Redux/Auth/Action";
import { Link, useNavigate } from "react-router-dom";

// Hàm chuyển đổi ngày từ MM/dd/yyyy sang yyyy-MM-dd
const formatDate = (date) => {
  if (!date) return "";

  const [month, day, year] = date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const Account = () => {
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false); // Quản lý trạng thái chỉnh sửa
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "",
    birthDate: "",
  });

  const [errorMessages, setErrorMessages] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    gender: "",
    birthDate: "",
  });

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [jwt, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const user = auth?.user; // Kiểm tra xem auth và user có tồn tại không

  if (!user) {
    return <div>Loading...</div>; // Xử lý khi user chưa được tải
  }

  // Hàm để xử lý thay đổi giá trị input trong form
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu người dùng xóa hết, giữ lại trường đó là rỗng
    setFormData({
      ...formData,
      [name]: value, // Update giá trị formData
    });

    // Cập nhật lỗi khi trường bị bỏ trống
    setErrorMessages({
      ...errorMessages,
      [name]: value ? "" : "Trường này không thể để trống", // Hiển thị lỗi nếu bỏ trống trường
    });
  };

  // Hàm gửi form chỉnh sửa
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Chỉ gửi dữ liệu thay đổi và không gửi các trường trống
    const updatedData = {
      firstName: formData.firstName || user.firstName,
      lastName: formData.lastName || user.lastName,
      mobile: formData.mobile || user.mobile,
      gender: formData.gender || user.gender,
      birthDate: formData.birthDate || user.birthDate,
    };

    // Kiểm tra xem các trường có được điền hay không
    const errors = {};
    Object.keys(updatedData).forEach((key) => {
      if (!updatedData[key]) {
        errors[key] = "Trường này không thể để trống";
      }
    });

    setErrorMessages(errors);

    // Nếu không có lỗi, gửi yêu cầu cập nhật
    if (Object.keys(errors).length === 0) {
      dispatch(updateUser(jwt, user.id, updatedData));
      setIsEditing(false); // Thoát khỏi chế độ chỉnh sửa
    }
  };

  return (
    <div className="account-page">
      {/* Breadcrumb */}

      {/* Layout 2 cột */}
      <div className="flex">
        {/* Cột menu bên trái */}
        <div className="w-1/4 pr-4 border-r">
          <div className="breadcrumb text-gray-500 text-sm mb-4">
            <Link to="/" className="hover:underline">
              Trang chủ
            </Link>{" "}
            / Tài khoản
          </div>
          <h2 className="font-bold text-lg mb-4">TRANG TÀI KHOẢN</h2>
          <ul className="space-y-2">
            <li>
              <Link
                to="/account"
                className="text-red-600 font-medium hover:underline"
              >
                Thông tin tài khoản
              </Link>
            </li>
            <li>
              <Link to="/addresses" className="hover:underline">
                Số địa chỉ ({user.address.length || 0})
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 hover:underline"
              >
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>

        {/* Cột nội dung bên phải */}
        <div className="w-3/4 pl-4 text-left">
          <h2 className="font-bold text-lg mb-4">TÀI KHOẢN</h2>

          {/* Form chỉnh sửa thông tin tài khoản */}
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Tên tài khoản:</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="firstName"
                    value={
                      formData.firstName ||
                      (user.firstName === "" ? "" : user.firstName)
                    } // Nếu user.firstName có giá trị, giữ giá trị đó
                    onChange={handleChange}
                    className="p-2 border rounded w-full"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={
                      formData.lastName ||
                      (user.lastName === "" ? "" : user.lastName)
                    } // Tương tự cho lastName
                    onChange={handleChange}
                    className="p-2 border rounded w-full"
                    placeholder="Last Name"
                  />
                </div>
                {errorMessages.firstName && (
                  <p className="text-red-500">{errorMessages.firstName}</p>
                )}
                {errorMessages.lastName && (
                  <p className="text-red-500">{errorMessages.lastName}</p>
                )}
              </div>

              <div>
                <label className="font-medium">Điện thoại:</label>
                <input
                  type="text"
                  name="mobile"
                  value={
                    formData.mobile || (user.mobile === "" ? "" : user.mobile)
                  } // Tương tự cho mobile
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  placeholder="Mobile"
                />
                {errorMessages.mobile && (
                  <p className="text-red-500">{errorMessages.mobile}</p>
                )}
              </div>

              <div>
                <label className="font-medium">Giới tính:</label>
                <input
                  type="text"
                  name="gender"
                  value={
                    formData.gender || (user.gender === "" ? "" : user.gender)
                  } // Tương tự cho gender
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                  placeholder="Gender"
                />
                {errorMessages.gender && (
                  <p className="text-red-500">{errorMessages.gender}</p>
                )}
              </div>

              <div>
                <label className="font-medium">Ngày sinh:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || formatDate(user.birthDate)} // Sử dụng hàm formatDate để chuyển đổi ngày
                  onChange={handleChange}
                  className="p-2 border rounded w-full"
                />
                {errorMessages.birthDate && (
                  <p className="text-red-500">{errorMessages.birthDate}</p>
                )}
              </div>

              <button
                type="submit"
                className="bg-red-600 text-white p-2 rounded mt-4"
              >
                Cập nhật
              </button>
            </form>
          ) : (
            <div className="space-y-2">
              <p>
                <span className="font-medium">Tên tài khoản:</span>{" "}
                {user.firstName} {user.lastName}
              </p>
              <p>
                <span className="font-medium">Điện thoại:</span>{" "}
                {user.mobile || "Chưa cập nhật"}
              </p>
              <p>
                <span className="font-medium">Giới tính:</span>{" "}
                {user.gender || "Chưa cập nhật"}
              </p>
              <p>
                <span className="font-medium">Ngày sinh:</span>{" "}
                {user.birthDate || "Chưa cập nhật"}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="text-red-600 hover:underline mt-4"
              >
                Chỉnh sửa
              </button>
            </div>
          )}

          <h2 className="font-bold text-lg mt-6 mb-4">ĐƠN HÀNG CỦA BẠN</h2>
          <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
        </div>
      </div>
    </div>
  );
};

export default Account;
