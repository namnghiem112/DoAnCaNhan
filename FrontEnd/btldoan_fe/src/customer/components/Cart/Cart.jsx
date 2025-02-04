import React, { useState, useEffect } from "react";
import CartItem from "./CartItem";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCart } from "../../../Redux/Cart/Action";
import { toast } from "react-toastify";
import { createOrder } from "../../../Redux/Order/Action";
import Address from "./Address"; // Import modal Address component
import axios from "axios";
const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const { cart } = useSelector((store) => store);
  const [openAddressModal, setOpenAddressModal] = useState(false); // state quản lý việc mở modal
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobile: "",
    paymentMethod: "CASH",
  });

  useEffect(() => {
    if (!jwt) {
      toast.warn("Bạn cần đăng nhập để xem giỏ hàng.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      navigate("/login");
      return;
    }
    dispatch(getCart(jwt));
  }, [jwt, dispatch, navigate]);

  if (!jwt) return null; // Không render gì nếu chưa có jwt

  const handleShopNow = () => {
    navigate("/");
  };

  const handleOpenModal = () => {
    setOpenAddressModal(true);
  };

  const handleCloseModal = () => {
    setOpenAddressModal(false);
  };

  const handleSubmitAddress = async (addressData) => {
    const totalAmount = cart?.cart?.totalDiscountedPrice || 0;
    if (addressData.paymentMethod === "CASH") {
      // Xử lý thanh toán bằng tiền mặt
      dispatch(createOrder(addressData, jwt))
        .then(() => {
          toast.success("Đơn hàng của bạn đã được tạo thành công!", {
            position: "top-center",
            autoClose: 3000,
          });
          setOpenAddressModal(false);
          navigate("/order");
        })
        .catch(() => {
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại.", {
            position: "top-center",
            autoClose: 3000,
          });
        });
    } else if (addressData.paymentMethod === "VNPAY") {
      // Xử lý thanh toán qua VNPay
      try {
        const response = await axios.post(
          `http://localhost:8080/api/payment/vn-pay?amount=${totalAmount}&bankCode=NCB`,
          addressData,
          {
            headers: { Authorization: `Bearer ${jwt}` },
          }
        );

        if (response.data.status === "ok" && response.data.responseData) {
          // Chuyển hướng tới URL thanh toán VNPay
          window.location.href = response.data.responseData;
        } else {
          throw new Error("Không thể tạo giao dịch VNPay.");
        }
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi tạo giao dịch VNPay.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div>
      {cart?.cartItems?.length === 0 || !cart?.cartItems ? (
        <div className="flex flex-col items-center justify-center my-40">
          <div className="text-center">
            <img
              src="/bg_cart.png"
              alt="Empty Cart"
              className="w-full mx-auto"
            />
            <p className="text-lg font-semibold mt-4">
              "Hổng" có gì trong giỏ hết
            </p>
            <p className="text-sm text-gray-500">
              Về trang cửa hàng để chọn mua sản phẩm bạn nhé!!
            </p>
            <button
              className="mt-6 bg-red-500 text-white py-2 px-4 rounded-md"
              onClick={handleShopNow}
            >
              Mua sắm ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="lg:grid grid-cols-3 lg:px-16 relative">
          <div className="lg:col-span-2 lg:px-5 bg-white">
            <div className="space-y-3">
              {cart.cartItems.map((item) => (
                <CartItem
                  key={item?.id || Math.random()}
                  item={item}
                  showButton={true}
                />
              ))}
            </div>
          </div>
          <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0 ">
            <div className="border p-5 bg-white shadow-lg rounded-md">
              <p className="font-bold opacity-60 pb-4">PRICE DETAILS</p>
              <hr />

              <div className="space-y-3 font-semibold">
                <div className="flex justify-between pt-3 text-black">
                  <span>Price ({cart.cart?.totalItem || 0} item)</span>
                  <span>{(cart.cart?.totalPrice || 0)?.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-700">
                    -{(cart.cart?.discounte || 0)?.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-700">Free</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-700">
                    {(cart.cart?.totalDiscountedPrice || 0)?.toLocaleString()}₫
                  </span>
                </div>
              </div>

              <Button
                onClick={handleOpenModal}
                variant="contained"
                sx={{
                  padding: ".8rem 2rem",
                  marginTop: "2rem",
                  width: "100%",
                  backgroundColor: "#d82e4d", // Màu nền chính
                  "&:hover": {
                    backgroundColor: "#b1223b", // Màu khi hover
                  },
                }}
              >
                Thanh Toán
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Address */}
      <Address
        open={openAddressModal}
        handleClose={handleCloseModal}
        handleSubmit={handleSubmitAddress}
      />
    </div>
  );
};

export default Cart;
