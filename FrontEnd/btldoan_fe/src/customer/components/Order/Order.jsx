import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  CircularProgress,
  IconButton,
  Grid,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../../Redux/Auth/Action";
import { toast } from "react-toastify";
import { getOrderHistory } from "../../../Redux/Order/Action";

const Order = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const { order } = useSelector((store) => store);

  const jwt = localStorage.getItem("jwt");
  const user = auth?.user || {};
  const orders = order?.orders || [];
  console.log(orders);
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [statusFilter, setStatusFilter] = useState("All");
  const [showPhone, setShowPhone] = useState(false);

  // Bản đồ trạng thái sang tiếng Việt
  const statusMap = {
    All: "Tất cả",
    PENDING: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    SHIPPED: "Đang vận chuyển",
    DELIVERED: "Đã giao hàng",
    CANCELLED: "Đã hủy",
  };

  useEffect(() => {
    if (!jwt) {
      toast.warn("Bạn cần đăng nhập để xem lịch sử mua hàng.", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        await dispatch(getUser(jwt));
        await dispatch(getOrderHistory(jwt));
      } catch (error) {
        toast.error("Có lỗi khi tải dữ liệu. Vui lòng thử lại.", {
          position: "top-center",
          autoClose: 3000,
        });
        navigate("/login");
      }
    };

    fetchData();
  }, [dispatch, navigate, jwt]);

  useEffect(() => {
    // Lọc đơn hàng khi trạng thái hoặc dữ liệu thay đổi
    const filterOrders = (status) => {
      if (status === "All") {
        setFilteredOrders(orders);
      } else {
        const filtered = orders.filter((order) => order.orderStatus === status);
        setFilteredOrders(filtered);
      }
    };

    filterOrders(statusFilter);
  }, [orders, statusFilter]);

  const handleFilterChange = (status) => {
    setStatusFilter(status);
  };

  const togglePhoneVisibility = () => setShowPhone(!showPhone);

  const handleShopNow = () => navigate("/");

  const totalOrders = filteredOrders.length;
  const totalAmount = filteredOrders.reduce(
    (sum, order) => sum + order.totalDiscountedPrice,
    0
  );
  const getStatusColor = (status) => {
    const colors = {
      PENDING: { bg: "rgba(255, 193, 7, 0.1)", color: "#FFC107" }, // Màu vàng nhạt
      CONFIRMED: { bg: "rgba(0, 123, 255, 0.1)", color: "#007BFF" }, // Màu xanh dương
      SHIPPED: { bg: "rgba(23, 162, 184, 0.1)", color: "#17A2B8" }, // Màu xanh lam nhạt
      DELIVERED: { bg: "rgba(40, 167, 69, 0.1)", color: "#28A745" }, // Màu xanh lá
      CANCELLED: { bg: "rgba(220, 53, 69, 0.1)", color: "#DC3545" }, // Màu đỏ
      default: { bg: "rgba(108, 117, 125, 0.1)", color: "#6C757D" }, // Màu xám nhạt
    };

    return colors[status] || colors.default;
  };

  return (
    <>
      <Container>
        <Box className="mt-4">
          <Typography
            variant="h4"
            className="mb-6 text-gray-900 font-bold"
            sx={{ fontSize: "2rem" }}
          >
            Danh sách Đơn hàng
          </Typography>
        </Box>

        {/* Thông tin người dùng */}
        <Box className="flex mb-2 flex-col">
          <Box className="flex items-center">
            <img
              src="/avatar.png"
              alt="User Avatar"
              className="w-12 h-12 rounded-full mr-4"
            />
            <Box>
              <Typography variant="h6">
                {user.firstName} {user.lastName}
              </Typography>
              <Box className="flex items-center">
                <Typography>
                  {showPhone
                    ? user.mobile
                    : `${user.mobile?.slice(0, 2)}*****${user.mobile?.slice(
                        -3
                      )}`}
                </Typography>
                <IconButton onClick={togglePhoneVisibility}>
                  {showPhone ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Nút lọc trạng thái */}
      <Container>
        <Box className="flex mb-6">
          {Object.keys(statusMap).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "contained" : "outlined"}
              color={statusFilter === status ? "error" : "inherit"}
              sx={{ marginX: "8px", textTransform: "none" }}
              onClick={() => handleFilterChange(status)}
            >
              {statusMap[status]}
            </Button>
          ))}
        </Box>
      </Container>

      {/* Hiển thị trạng thái nếu không có đơn hàng */}
      {!jwt ? (
        <Container className="py-8">
          <CircularProgress />
        </Container>
      ) : totalOrders === 0 ? (
        <div className="flex flex-col items-center justify-center my-40">
          <img
            src="/bg_order.png"
            alt="Empty Cart"
            className="w-[10%] mx-auto"
          />
          <p className="text-lg font-semibold mt-4">
            Không có đơn hàng nào phù hợp.
          </p>
          <button
            className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md"
            onClick={handleShopNow}
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <Container className="py-8">
          {/* Tổng đơn hàng và tổng tiền */}
          <Box className="mb-6">
            <Grid container spacing={2}>
              <Grid
                item
                xs={6}
                className="text-center"
                sx={{
                  borderRight: "1px solid #e0e0e0", // Gạch dọc ngăn cách
                  paddingRight: "16px",
                }}
              >
                <Typography variant="body1">Tổng số đơn hàng</Typography>
                <Typography variant="h6">{totalOrders}</Typography>
              </Grid>
              <Grid
                item
                xs={6}
                className="text-center"
                sx={{
                  paddingLeft: "16px",
                }}
              >
                <Typography variant="body1">Tổng tiền tích lũy</Typography>
                <Typography variant="h6" color="error">
                  {totalAmount.toLocaleString()}đ
                </Typography>
              </Grid>
            </Grid>
          </Box>

          {/* Danh sách đơn hàng */}
          {filteredOrders.map((order, index) => {
            // Tính tổng tiền của từng đơn hàng
            const totalOrderAmount = order.orderItems.reduce(
              (sum, item) => sum + item.product.discountedPrice * item.quantity,
              0
            );

            return (
              <Box key={order.id} className="mb-6">
                <Typography
                  variant="h6"
                  sx={{ marginBottom: "8px", fontWeight: "bold" }}
                >
                  Đơn hàng {index + 1}
                </Typography>
                {order.orderItems.map((item) => (
                  <Paper key={item.id} className="mb-4 p-4">
                    <Box className="flex justify-between">
                      <Box className="flex">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <Box>
                          <Typography variant="h6">
                            {item.product.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              backgroundColor: getStatusColor(order.orderStatus)
                                .bg,
                              color: getStatusColor(order.orderStatus).color,
                              padding: "4px 8px",
                              borderRadius: "4px",
                              width: "auto",
                              display: "inline-block",
                              fontSize: "0.9rem",
                            }}
                          >
                            {statusMap[order.orderStatus]}
                          </Typography>
                          <Typography variant="body2">
                            {item.quantity} x{" "}
                            {item.product.price.toLocaleString()}đ
                          </Typography>
                          <Typography variant="body2" color="gray">
                            Ngày tạo:{" "}
                            {format(new Date(order.orderDate), "dd/MM/yyyy")}
                          </Typography>
                        </Box>
                      </Box>
                      <Box className="flex flex-col justify-between items-center">
                        <Typography variant="body1" color="error">
                          {item.product.discountedPrice.toLocaleString()}đ
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color:
                              order.paymentMethod === "VNPAY" ? "#fff" : "#000",
                            backgroundColor:
                              order.paymentMethod === "VNPAY"
                                ? "#90ee90"
                                : "#ffcccb", // xanh nhạt và đỏ nhạt
                            padding: "4px 4px", // Thêm khoảng cách bên trong
                            borderRadius: "4px", // Bo góc
                            display: "inline-block", // Giữ kích thước gọn
                          }}
                        >
                          {order.paymentMethod === "VNPAY"
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
                <Box className="flex justify-between">
                  <Typography>
                    Tổng tiền: {order.totalPrice.toLocaleString()}đ
                  </Typography>
                  <Typography>
                    Giảm giá: {order.discounte.toLocaleString()}đ
                  </Typography>
                  <Typography color="error" fontWeight="bold">
                    {totalOrderAmount.toLocaleString()}đ
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Container>
      )}
    </>
  );
};

export default Order;
