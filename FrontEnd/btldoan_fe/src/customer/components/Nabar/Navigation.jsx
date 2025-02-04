import React from "react";
import AuthModal from "../Auth/AuthModal";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "../../../Redux/Auth/Action";
import { getCart } from "../../../Redux/Cart/Action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { searchProduct } from "../../../Redux/Product/Action";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openUserMenu = Boolean(anchorEl);
  const jwt = localStorage.getItem("jwt");
  const [username, SetUserName] = useState(null);
  const { cart } = useSelector((store) => store);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Mở modal nếu đường dẫn là /reset
  useEffect(() => {
    const locationPath = window.location.pathname;
    if (locationPath === "/reset") {
      setOpenAuthModal(true);
    }
  }, [window.location.pathname]); // Kiểm tra đường dẫn khi trang thay đổi

  useEffect(() => {
    const defaultQueryString =
      "?color=&size=&minPrice=&maxPrice=&minDiscount=0&category=&stock=in_stock&sort=&pageNumber=0&pageSize=10";

    if (window.location.pathname === "/" && window.location.search === "") {
      navigate(`/${defaultQueryString}`, { replace: true });
    }
  }, [navigate]);

  const handleOpen = () => {
    setOpenAuthModal(true);
  };

  const handleClose = () => {
    setOpenAuthModal(false);
  };

  const location = useLocation();

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart(jwt));
    }
  }, [jwt]);

  useEffect(() => {
    if (auth.user) {
      SetUserName(auth.user.firstName + " " + auth.user.lastName);
      handleClose();
    }
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate(-1);
    }
  }, [auth.user]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      localStorage.setItem("jwt", token);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCartClick = () => {
    if (!jwt) {
      toast.warn("Bạn cần đăng nhập để xem giỏ hàng.", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate("/cart");
    }
  };

  const handleOrderClick = () => {
    if (!jwt) {
      toast.warn("Bạn cần đăng nhập để xem lịch sử mua hàng.", {
        position: "top-center",
        autoClose: 3000,
      });
    } else {
      navigate("/order");
    }
  };

  const handleSearch = () => {
    if (searchKeyword.trim() === "") {
      toast.warn("Vui lòng nhập từ khóa tìm kiếm!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(searchProduct(searchKeyword));
    navigate(`/products/search?query=${searchKeyword}`);
  };

  return (
    <>
      <ToastContainer />
      <div className="flex gap-4 max-sm:flex-col items-center justify-center text-center text-white px-6 rounded font-[sans-serif]">
        <img
          src="/image_title.png"
          alt="Banner Top"
          className="w-full object-cover"
        />
      </div>
      <header className="flex items-center justify-between p-4 bg-white shadow-md pr-[40px]">
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img
              src="/logo_samishop.png"
              alt="SammiShop Logo"
              className="h-14 mr-2 w-80"
            />
          </a>
        </div>
        <div className="flex items-center w-[30%] mr-[20px]">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full h-[40px] bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-3 pr-28 py-2"
              placeholder="Nhập mã THANG11 giảm 7% cho mọi đơn từ 0đ TỐI ĐA 66K"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              className="absolute top-1 right-1 flex items-center rounded bg-red-500 py-1 px-2.5 text-white"
              type="button"
              onClick={handleSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 mr-2"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm text-gray-700 w-[50%] justify-around">
          {/* <div className="flex items-center space-x-2">
            <img src="/phone.png" alt="Support" className="h-10" />
            <div>
              <p className="font-medium text-base ">Hỗ trợ khách hàng</p>
              <a href="tel:19002613" className="font-bold text-black">
                19002613
              </a>
            </div>
          </div> */}

          <div className="flex items-center space-x-2">
            <img src="/account.png" alt="Account" className="h-10" />
            <div className="flex flex-col">
              {jwt ? (
                <>
                  <button
                    onClick={() => navigate("/account")}
                    className="font-medium text-base text-black block"
                  >
                    {username || "Người dùng"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 block cursor-pointer"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="#"
                    className="font-medium text-base text-black block"
                  >
                    Tài khoản
                  </a>
                  <button
                    onClick={handleOpen}
                    className="text-gray-500 block cursor-pointer"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCartClick}
              className="relative cursor-pointer"
            >
              <img src="/cart.png" alt="Cart" className="h-10" />
              <span className="absolute top-0 right-0 w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                {cart.cart?.totalItem || 0}
              </span>
            </button>
            <button
              onClick={handleCartClick}
              className="font-medium text-base text-black cursor-pointer"
            >
              Giỏ hàng
            </button>
          </div>
          {/* Order Check */}
          {auth?.user?.role?.roleName === "ROLE_ADMIN" ? (
            <>
              <div className="flex items-center space-x-2">
                <img src="/address.png" alt="Dashboard" className="h-10" />
                <button
                  onClick={() => navigate("/admin")}
                  className="font-medium text-base text-black cursor-pointer"
                >
                  Dashboard
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleOrderClick}
                  className="relative cursor-pointer"
                >
                  <img src="/testBill.png" alt="Cart" className="h-10" />
                </button>
                <button
                  onClick={handleOrderClick}
                  className="font-medium text-base text-black cursor-pointer"
                >
                  Lịch sử mua hàng
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOrderClick}
                className="relative cursor-pointer"
              >
                <img src="/testBill.png" alt="Cart" className="h-10" />
              </button>
              <button
                onClick={handleOrderClick}
                className="font-medium text-base text-black cursor-pointer"
              >
                Lịch sử mua hàng
              </button>
            </div>
          )}
        </div>
      </header>
      <AuthModal handleClose={handleClose} open={openAuthModal} />
    </>
  );
};

export default Navigation;
