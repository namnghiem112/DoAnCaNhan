import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createOrder } from "../../../Redux/Order/Action";
import { toast } from "react-toastify";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasRun = useRef(false); // Flag chặn chạy lại useEffect

  function getQueryParams(search) {
    const params = new URLSearchParams(search);
    const queryObject = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });
    return queryObject;
  }

  function parseAddress(orderInfo) {
    const decodedInfo = decodeURIComponent(orderInfo.replace(/\+/g, " "));
    const parts = decodedInfo.split(",");
    const namePart = parts[0]?.replace("Ho ten:", "").trim();
    const addressPart = parts[1]?.replace("Dia chi:", "").trim();
    const phonePart = parts[2]?.replace("So dien thoai:", "").trim();
    const nameParts = namePart.split(" ");
    const firstName = nameParts.slice(0, -1).join(" ") || "";
    const lastName = nameParts.slice(-1).join(" ") || "";

    return {
      firstName,
      lastName,
      address: addressPart,
      mobile: phonePart,
      paymentMethod: "VNPAY",
    };
  }

  useEffect(() => {
    // Kiểm tra nếu đã chạy useEffect
    if (hasRun.current) return;
    hasRun.current = true;

    const queryParams = getQueryParams(location.search);

    if (queryParams.vnp_OrderInfo) {
      const addressData = parseAddress(queryParams.vnp_OrderInfo);
      console.log(addressData);
      console.log(location.search);
      if (
        queryParams.vnp_ResponseCode === "00" &&
        addressData.firstName &&
        addressData.lastName &&
        addressData.address &&
        addressData.mobile
      ) {
        dispatch(createOrder(addressData, localStorage.getItem("jwt")))
          .then(() => {
            toast.success("Thanh toán thành công, đơn hàng đã được tạo!", {
              position: "top-center",
              autoClose: 3000,
            });
            navigate("/order");
          })
          .catch(() => {
            toast.error("Đã xảy ra lỗi khi tạo đơn hàng.", {
              position: "top-center",
              autoClose: 3000,
            });
          });
      } else {
        toast.error("Thông tin không đầy đủ hoặc giao dịch thất bại.", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } else {
      toast.error("Không tìm thấy thông tin thanh toán.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }, [location.search, dispatch, navigate]);

  return <div>Đang xử lý thanh toán...</div>;
};

export default Payment;
