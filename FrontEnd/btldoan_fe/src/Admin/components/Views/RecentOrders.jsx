import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../Redux/AdminOrder/Action";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";

const RecentOrders = () => {
  const dispatch = useDispatch();
  const { orderAdmin } = useSelector((store) => store); // Lấy dữ liệu từ Redux Store
  const jwt = localStorage.getItem("jwt"); // Token xác thực
  const [loading, setLoading] = useState(false);

  // Gọi API khi component được mount
  useEffect(() => {
    setLoading(true);
    dispatch(getAllOrders(0, 5, jwt)) // Lấy 5 đơn hàng gần nhất từ API
      .finally(() => setLoading(false));
  }, [dispatch, jwt]);

  const orders = orderAdmin?.orders?.content || []; // Lấy danh sách đơn hàng
  console.log(orderAdmin?.orders?.content);
  // Hàm đổi màu trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#FFC107"; // Màu vàng
      case "CONFIRMED":
        return "#007BFF"; // Màu xanh lam nhạt
      case "SHIPPED":
        return "#17A2B8"; // Màu xanh dương
      case "DELIVERED":
        return "#28A745"; // Màu xanh lá
      case "CANCELLED":
        return "#DC3545"; // Màu đỏ
      default:
        return "#6C757D"; // Màu xám mặc định
    }
  };
  // Hàm trả về màu nhạt hơn khi hover
  const getHoverColor = (status) => {
    switch (status) {
      case "PENDING":
        return "#FFD54F"; // Vàng nhạt
      case "CONFIRMED":
        return "#64B5F6"; // Xanh lam nhạt hơn
      case "SHIPPED":
        return "#4FC3F7"; // Xanh dương nhạt hơn
      case "DELIVERED":
        return "#81C784"; // Xanh lá nhạt
      case "CANCELLED":
        return "#E57373"; // Đỏ nhạt
      default:
        return "#9E9E9E"; // Xám nhạt
    }
  };

  return (
    <Card className="bg-gray-800 text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
      <CardContent>
        <Typography variant="h6" className="text-purple-500 mb-2">
          Recent Orders
        </Typography>
        <Typography variant="body2" className="text-right text-blue-500 mt-2">
          <a href="/admin/orders">View All</a>
        </Typography>

        {loading ? (
          <Typography className="text-center mt-4">Loading...</Typography>
        ) : (
          <TableContainer>
            <Table className="w-full text-left">
              <TableHead>
                <TableRow className="text-gray-400 border-b border-gray-700">
                  <TableCell className="py-2 text-white">ID</TableCell>
                  <TableCell className="py-2 text-white">Image</TableCell>
                  <TableCell className="py-2 text-white">Title</TableCell>
                  <TableCell className="py-2 text-white">Price</TableCell>
                  <TableCell className="py-2 text-white">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) =>
                  order.orderItems.map((item, index) => (
                    <TableRow
                      key={order.id}
                      className="border-b border-gray-700 hover:bg-gray-700"
                    >
                      {index === 0 && (
                        <TableCell rowSpan={order.orderItems.length}>
                          {order.id}
                        </TableCell>
                      )}
                      {/* Image */}
                      <TableCell className="py-2">
                        <Avatar
                          src={
                            item.product.imageUrl ||
                            "https://via.placeholder.com/40"
                          }
                          alt={item.product.title}
                          className="w-8 h-8 rounded-full"
                        />
                      </TableCell>
                      {/* Title */}
                      <TableCell className="py-2">
                        <div>{item.product.title}</div>
                        <div className="text-sm text-gray-400">
                          {item.product.brand || "Unknown"}
                        </div>
                      </TableCell>
                      {/* Price */}
                      <TableCell className="py-2">
                        {item.price?.toLocaleString()}₫
                      </TableCell>
                      {/* Status */}
                      {index === 0 && (
                        <TableCell
                          className="py-2"
                          rowSpan={order.orderItems.length}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            style={{
                              backgroundColor: getStatusColor(
                                order.orderStatus
                              ),
                              color: "#fff",
                              transition: "background-color 0.3s ease",
                            }}
                            onMouseOver={(e) =>
                              (e.target.style.backgroundColor = getHoverColor(
                                order.orderStatus
                              ))
                            }
                            onMouseOut={(e) =>
                              (e.target.style.backgroundColor = getStatusColor(
                                order.orderStatus
                              ))
                            }
                          >
                            {order.orderStatus || "Pending"}
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
