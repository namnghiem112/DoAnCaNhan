import React from "react";
import { Button, IconButton } from "@mui/material";
import { useDispatch } from "react-redux";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { removeCartItem, updateCartItem } from "../../../Redux/Cart/Action";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../../Redux/Cart/Action";

const CartItem = ({ item, showButton }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  // Kiểm tra JWT
  const checkJwt = () => {
    if (!jwt) {
      alert("Vui lòng đăng nhập để thực hiện thao tác này!");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleRemoveItemFromCart = () => {
    if (!checkJwt()) return; // Kiểm tra JWT
    const data = { cartItemId: item?.id, jwt };
    dispatch(removeCartItem(data))
      .then(() => {
        // Sau khi cập nhật thành công, gọi lại getCart để làm mới giỏ hàng
        dispatch(getCart(jwt));
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
      });
  };

  const handleUpdateCartItem = (num) => {
    if (!checkJwt()) return;

    const data = {
      data: { quantity: item?.quantity + num },
      cartItemId: item?.id,
      jwt,
    };

    // Gửi action cập nhật giỏ hàng
    dispatch(updateCartItem(data))
      .then(() => {
        // Sau khi cập nhật thành công, gọi lại getCart để làm mới giỏ hàng
        dispatch(getCart(jwt));
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
      });
  };

  if (!item || !item.product) {
    return <p className="text-red-500">Dữ liệu sản phẩm không hợp lệ.</p>;
  }

  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        {/* Hiển thị hình ảnh sản phẩm */}
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem] ">
          <img
            className="w-full h-full object-cover object-top"
            src={item?.product.imageUrl}
            alt={item?.product?.title || "Product Image"}
          />
        </div>
        {/* Thông tin sản phẩm */}
        <div className="ml-5 space-y-1">
          <p className="font-semibold">{item?.product?.title}</p>
          <p className="opacity-70">Size: {item?.size || "N/A"}</p>
          <p className="opacity-70 mt-2">Seller: {item?.product?.brand}</p>
          <div className="flex space-x-2 items-center pt-3">
            <p className="opacity-50 line-through">
              {item?.product.price?.toLocaleString()}₫
            </p>
            <p className="font-semibold text-lg">
              {item?.product.discountedPrice?.toLocaleString()}₫
            </p>
            <p className="text-green-600 font-semibold">
              {item?.product.discountPersent}% off
            </p>
          </div>
        </div>
      </div>

      {/* Nút chức năng */}
      {showButton && (
        <div className="lg:flex items-center lg:space-x-10 pt-4">
          {/* Điều chỉnh số lượng */}
          <div className="flex items-center space-x-2 ">
            <IconButton
              onClick={() => handleUpdateCartItem(-1)}
              disabled={item?.quantity <= 1}
              color="primary"
            >
              <RemoveCircleOutlineIcon />
            </IconButton>

            <span className="py-1 px-7 border rounded-sm">
              {item?.quantity}
            </span>

            <IconButton onClick={() => handleUpdateCartItem(1)} color="primary">
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
          {/* Nút xóa */}
          <div className="flex text-sm lg:text-base mt-5 lg:mt-0">
            <Button onClick={handleRemoveItemFromCart} variant="text">
              Remove
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
