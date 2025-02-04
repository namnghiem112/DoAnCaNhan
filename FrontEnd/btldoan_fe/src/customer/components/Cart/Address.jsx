import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
// Style cho Box (nội dung modal)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff", // Đặt nền trắng cho modal
  borderRadius: "8px",
  padding: "20px",
  boxShadow: 24, // Để có shadow đẹp cho modal
  maxHeight: "90vh", // Giới hạn chiều cao modal nếu có nhiều content
  overflowY: "auto", // Cho phép cuộn nếu nội dung quá nhiều
};

const Address = ({ open, handleClose, handleSubmit }) => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    paymentMethod: "CASH", // Giá trị mặc định
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmitForm = () => {
    if (
      !address.firstName ||
      !address.lastName ||
      !address.address ||
      !address.mobile ||
      !address.paymentMethod
    ) {
      toast.error("Đã có lỗi xảy ra, vui lòng thử lại.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    handleSubmit(address); // Gửi thông tin địa chỉ lên Cart
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="address-modal-title"
      aria-describedby="address-modal-description"
    >
      <Box sx={modalStyle}>
        <h2 id="address-modal-title">Nhập Thông Tin Địa Chỉ</h2>
        <TextField
          label="Họ"
          variant="outlined"
          fullWidth
          margin="normal"
          name="firstName"
          value={address.firstName}
          onChange={handleChange}
        />
        <TextField
          label="Tên"
          variant="outlined"
          fullWidth
          margin="normal"
          name="lastName"
          value={address.lastName}
          onChange={handleChange}
        />
        <TextField
          label="Địa chỉ"
          variant="outlined"
          fullWidth
          margin="normal"
          name="address"
          value={address.address}
          onChange={handleChange}
        />
        <TextField
          label="Số điện thoại"
          variant="outlined"
          fullWidth
          margin="normal"
          name="mobile"
          value={address.mobile}
          onChange={handleChange}
        />
        {/* Thêm Select Box */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="payment-method-label">
            Phương Thức Thanh Toán
          </InputLabel>
          <Select
            labelId="payment-method-label"
            name="paymentMethod"
            value={address.paymentMethod}
            onChange={handleChange}
            label="Phương Thức Thanh Toán"
          >
            <MenuItem value="CASH">Tiền Mặt (CASH)</MenuItem>
            <MenuItem value="VNPAY">Thanh Toán VNPay</MenuItem>
          </Select>
        </FormControl>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSubmitForm}
            variant="contained"
            color="primary"
          >
            Gửi
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default Address;
