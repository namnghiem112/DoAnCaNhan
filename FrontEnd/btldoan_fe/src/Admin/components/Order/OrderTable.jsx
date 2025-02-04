import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrders,
  deleteOrder,
  confirmOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
} from "../../../Redux/AdminOrder/Action";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const OrderTable = () => {
  const dispatch = useDispatch();
  const { orderAdmin } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize] = useState(10);
  const [loadingState, setLoadingState] = useState(false);

  const handlePaginationChange = (event, value) => {
    setPageNumber(value - 1);
  };

  useEffect(() => {
    const data = {
      pageNumber,
      pageSize,
    };

    setLoadingState(true);
    dispatch(getAllOrders(data.pageNumber, data.pageSize, jwt)).finally(() =>
      setLoadingState(false)
    );
  }, [pageNumber, dispatch, jwt]);

  const orderList = orderAdmin?.orders?.content || [];
  const handleDeleteOrder = async (orderId) => {
    try {
      await dispatch(deleteOrder(orderId, jwt));
      toast.success("Order deleted successfully!");
      dispatch(getAllOrders(jwt, pageNumber, pageSize));
    } catch (error) {
      toast.error(error.message || "Failed to delete order. Please try again.");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Kiểm tra trạng thái và gọi đúng action
      if (newStatus === "CONFIRMED") {
        await dispatch(confirmOrder(orderId, jwt));
        toast.success(`Order ${orderId} confirmed successfully!`);
      } else if (newStatus === "SHIPPED") {
        await dispatch(shipOrder(orderId, jwt));
        toast.success(`Order ${orderId} shipped successfully!`);
      } else if (newStatus === "DELIVERED") {
        await dispatch(deliverOrder(orderId, jwt));
        toast.success(`Order ${orderId} delivered successfully!`);
      } else if (newStatus === "CANCELLED") {
        await dispatch(cancelOrder(orderId, jwt));
        toast.success(`Order ${orderId} cancelled successfully!`);
      }

      // Sau khi thay đổi trạng thái, tải lại danh sách đơn hàng
      dispatch(getAllOrders(pageNumber, pageSize, jwt));
    } catch (error) {
      // Hiển thị thông báo lỗi nếu có lỗi
      toast.error(
        error.message || "Failed to update status. Please try again."
      );
    }
  };

  const handleStatusDropdownChange = (orderId, event) => {
    const selectedStatus = event.target.value;
    handleStatusChange(orderId, selectedStatus);
  };

  return (
    <Box width={"100%"} className="bg-[#0d0d22] min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Card className="pt-2 mb-2" sx={{ flex: "0 0 auto" }}>
        <CardHeader
          title="All Orders"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
      </Card>
      <Card sx={{ flex: "1 1 auto", overflowY: "auto" }}>
        <TableContainer>
          <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Discount Percent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderList.map((order) =>
                order.orderItems.map((item, index) => (
                  <TableRow hover key={item.id}>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.orderItems.length}>
                          {order.id}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      <Avatar
                        alt={item.product.title}
                        src={item.product.imageUrl}
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <div>{item.product.title}</div>
                      <div className="text-sm text-gray-400">
                        {item.product.brand || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price?.toLocaleString()}₫</TableCell>
                    <TableCell>{item.product.discountPersent}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.orderItems.length}>
                          <FormControl sx={{ minWidth: 120 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                              value={order.orderStatus || ""}
                              onChange={(e) =>
                                handleStatusDropdownChange(order.id, e)
                              }
                              label="Status"
                              IconComponent={ArrowDropDownIcon}
                            >
                              <MenuItem value="PENDING">Pending</MenuItem>
                              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                              <MenuItem value="SHIPPED">Shipped</MenuItem>
                              <MenuItem value="DELIVERED">Delivered</MenuItem>
                              <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell rowSpan={order.orderItems.length}>
                          {order.paymentMethod === "CASH" ? (
                            <>{order.totalDiscountedPrice?.toLocaleString()}₫</>
                          ) : (
                            <Button
                              variant="contained"
                              sx={{
                                backgroundColor: "#17A2B8", // Màu nền xám nhẹ, trông như nút đã thanh toán
                                color: "#fff", // Màu chữ đen
                                "&:hover": {
                                  backgroundColor: "#007BFF", // Màu khi hover (xám tối hơn)
                                },
                              }}
                            >
                              ĐÃ THANH TOÁN
                            </Button>
                          )}
                        </TableCell>
                        <TableCell rowSpan={order.orderItems.length}>
                          <Button
                            variant="text"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteOrder(order.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Card className="mt-2 border">
        <div className="mx-auto px-4 py-5 flex justify-center shadow-lg rounded-md">
          <Pagination
            count={orderAdmin?.totalPages || 1}
            page={pageNumber + 1}
            color="primary"
            onChange={handlePaginationChange}
          />
        </div>
      </Card>
    </Box>
  );
};

export default OrderTable;
