import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { findProductById } from "../../../Redux/Product/Action";
import { addItemToCart } from "../../../Redux/Cart/Action";
import { AiFillCheckCircle } from "react-icons/ai";
import { FaStar, FaRegStar } from "react-icons/fa";
import Rating from "react-rating";
import "./Product.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createRating } from "../../../Redux/Rating/Action";
import { createReview } from "../../../Redux/Review/Action";
const ProductDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customersProduct } = useSelector((store) => store);
  const { productId } = useParams();
  const jwt = localStorage.getItem("jwt");
  const [selectedSize, setSelectedSize] = useState(null); // Kích thước được chọn
  const [quantity, setQuantity] = useState(1); // Số lượng sản phẩm
  const [error, setError] = useState(""); // Lưu thông báo lỗi
  const [isModalVisible, setIsModalVisible] = useState(false); // Điều khiển hiển thị modal
  const modalRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [rating, setRating] = useState(""); // số sao
  const [review, setReview] = useState(""); // nhận xét
  // Tính thời gian đếm ngược đến cuối ngày
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      const diff = endOfDay - now;

      setTimeLeft({
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (productId) {
      const data = { productId: Number(productId) };
      dispatch(findProductById(data));
    } else {
      console.error("Product ID is undefined or missing in the URL!");
    }
  }, [productId, dispatch]);

  const product = customersProduct?.product || {};
  const ratings = product?.ratings || [];
  const reviews = product?.reviews || [];

  useEffect(() => {
    // Reset số lượng về 1 và xóa thông báo lỗi nếu chọn kích thước khác
    setQuantity(1);
    setError("");
  }, [selectedSize]);

  const handleQuantityChange = (type) => {
    if (!selectedSize) {
      setError("Vui lòng chọn kích cỡ trước!");
      return;
    }

    const selectedSizeObj = product.sizes?.find(
      (size) => size.name === selectedSize
    );

    if (!selectedSizeObj) return;

    if (type === "increase") {
      if (quantity + 1 > selectedSizeObj.quantity) {
        setError("Không thể thêm vượt quá số lượng có sẵn!");
      } else {
        setQuantity(quantity + 1);
        setError(""); // Xóa thông báo lỗi khi thao tác hợp lệ
      }
    }

    if (type === "decrease") {
      if (quantity > 1) {
        setQuantity(quantity - 1);
        setError(""); // Xóa thông báo lỗi khi thao tác hợp lệ
      }
    }
  };

  const handleAddToCart = () => {
    if (!jwt) {
      // Nếu không có JWT, hiển thị thông báo yêu cầu đăng nhập
      setError("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }

    if (!selectedSize) {
      setError("Vui lòng chọn kích cỡ!");
      return;
    }

    const selectedSizeObj = product.sizes?.find(
      (size) => size.name === selectedSize
    );

    if (!selectedSizeObj || quantity > selectedSizeObj.quantity) {
      setError("Số lượng sản phẩm vượt quá số lượng còn lại!");
      return;
    }

    // Tạo dữ liệu để thêm vào giỏ hàng
    const data = {
      productId: product.id,
      size: selectedSize,
      quantity: quantity,
      price: product.discountedPrice,
    };

    console.log("Adding to cart: ", data);

    // Dispatch action thêm sản phẩm vào giỏ hàng
    dispatch(addItemToCart({ data, jwt }));

    // Hiển thị modal thông báo
    setIsModalVisible(true);

    // Reset thông báo lỗi
    setError("");
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalVisible]);
  // so sao
  // const handleStarClick = (starValue) => {
  //   setRating(starValue);
  // };

  const handleSubmitReview = () => {
    if (!jwt) {
      toast.error("Bạn cần phải đăng nhập để đánh giá!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    if (!rating) {
      setError("Vui lòng chọn số sao!");
      return;
    }

    if (!review.trim()) {
      setError("Vui lòng nhập nhận xét!");
      return;
    }

    const reviewData = {
      productId: product.id,
      reviewText: review,
      rating: parseFloat(rating),
    };

    console.log(reviewData);

    // Dispatching review and rating actions
    dispatch(
      createReview(
        { productId: reviewData.productId, review: reviewData.reviewText },
        jwt
      )
    );
    dispatch(
      createRating(
        { productId: reviewData.productId, rating: reviewData.rating },
        jwt
      )
    );

    // Reset state after submission
    setRating(0);
    setReview("");
    setError("");

    // Show success toast notification
    toast.success("Đánh giá của bạn đã được gửi thành công!", {
      position: "top-center",
      autoClose: 3000,
    });
  };

  if (!product || !product.title) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6">
      {/* Phần chính */}
      <div className="flex flex-wrap px-4 py-6 max-lg:flex-col">
        {/* Cột Hình Ảnh */}
        <div className="w-1/3 max-lg:w-full flex justify-center items-center">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="max-w-full rounded-lg shadow-lg"
            />
          )}
        </div>

        {/* Cột Mô Tả */}
        <div className="w-2/3 max-lg:w-full px-6 flex flex-col justify-center space-y-4 text-left">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-sm text-red-600 font-semibold mt-2">
            Tình trạng: {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
          </p>
          <p className="text-sm text-gray-600">Mã SKU: {product.id}</p>

          {/* Giá và Khuyến mãi */}
          <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
            <p className="text-3xl font-bold text-red-500">
              {product.discountedPrice?.toLocaleString()}₫
            </p>
            <p className="text-sm text-gray-500 line-through">
              {product.price?.toLocaleString()}₫
            </p>
            <p className="text-sm text-green-600 font-semibold">
              Tiết kiệm:{" "}
              {(product.price - product.discountedPrice)?.toLocaleString()}₫
            </p>
          </div>

          {/* Chọn kích thước */}
          <div className="mt-4">
            <h3 className="font-bold text-gray-800 mb-2">Chọn kích cỡ:</h3>
            <div className="space-y-2">
              {product.sizes?.map((size, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <button
                    className={`px-4 py-2 rounded-md border ${
                      size.quantity === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : selectedSize === size.name
                        ? "bg-gray-300 text-black"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() =>
                      size.quantity > 0 && setSelectedSize(size.name)
                    }
                    disabled={size.quantity === 0}
                  >
                    {size.name}
                  </button>
                  <span
                    className={`font-semibold ${
                      size.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {size.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Điều chỉnh số lượng */}
          <div className="mt-4 flex flex-col">
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md border shadow hover:bg-gray-300 disabled:bg-gray-300"
                onClick={() => handleQuantityChange("decrease")}
                disabled={!selectedSize}
              >
                -
              </button>
              <span className="px-6 text-lg font-bold">{quantity}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md border shadow hover:bg-gray-300 disabled:bg-gray-300"
                onClick={() => handleQuantityChange("increase")}
                disabled={!selectedSize}
              >
                +
              </button>
            </div>
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
          {/* Đồng hồ đếm ngược */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300 text-yellow-700 flex items-center space-x-4 mt-4">
            <div className="text-lg font-bold">ƯU ĐÃI HOT, ĐỪNG BỎ LỠ!</div>
            <div className="text-sm font-medium flex items-center space-x-1">
              <span className="text-red-600 font-bold">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>{" "}
              giờ
              <span className="text-red-600 font-bold">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>{" "}
              phút
              <span className="text-red-600 font-bold">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>{" "}
              giây
            </div>
          </div>
          {/* Nút Thao Tác */}
          <div className="flex items-center space-x-4 mt-4">
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-600">
              MUA NGAY
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow hover:bg-gray-300"
              onClick={handleAddToCart}
            >
              THÊM VÀO GIỎ
            </button>
          </div>
        </div>
      </div>

      {/* Modal Thông Báo */}
      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96"
            ref={modalRef}
          >
            {/* Title với nền xanh nhạt và icon tích */}
            <div className="flex items-center bg-green-100 p-3 rounded-md">
              <AiFillCheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-bold text-green-600">
                Thêm vào giỏ hàng thành công
              </h3>
            </div>
            {/* Nội dung: Hình ảnh và mô tả trong cùng hàng */}
            <div className="flex items-center mt-4 text-left">
              {/* Hình ảnh sản phẩm */}
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-md border border-gray-200 mr-4"
              />
              {/* Thông tin sản phẩm */}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {product.title}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-red-500 font-bold mt-1">
                {product.discountedPrice.toLocaleString()}₫ x {quantity} sản
                phẩm
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Tổng tiền:{" "}
                {(product.discountedPrice * quantity).toLocaleString()}₫
              </p>
            </div>
            {/* Nút thao tác */}
            <div className="flex justify-between mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Đóng
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Xem giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 py-6 w-2/3 max-lg:w-full ml-16">
        {/* Tiêu đề mô tả */}
        <h2 className="text-2xl font-bold border-b pb-2 mb-4 text-left">
          Mô tả sản phẩm
        </h2>

        {/* Nội dung mô tả */}
        <div className="space-y-4 text-left">
          <p className="text-lg text-gray-700">
            <strong>Tên CT:</strong> Mua 1 tặng 1
          </p>
          <p className="text-lg text-gray-700">
            <strong>Thời gian áp dụng:</strong> 2/12-31/12
          </p>
          <p className="text-lg text-gray-700">
            <strong>Nội dung CT:</strong> Mua 1 tặng 1+++ theo danh sách đính
            kèm
          </p>
          <p className="text-lg text-gray-700">
            <strong>Phạm vi áp dụng:</strong> Inbox - app - web
          </p>
        </div>

        {/* Đoạn văn mô tả chi tiết */}
        <div className="mt-6 text-lg text-gray-800 text-left">
          <p>{product.description}</p>
        </div>

        {/* Hình ảnh minh họa */}
        <div className="mt-6 flex justify-center">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title}
              className="max-w-full rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
      <div className="px-4 py-6 w-2/3 max-lg:w-full ml-16">
        {/* Display average rating */}
        {ratings.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mt-2 text-left">
              ({ratings.length} {ratings.length === 1 ? "đánh giá" : "đánh giá"}
              )
            </p>
          </div>
        )}
        {/* Display individual reviews */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2 text-left">
            Những đánh giá khác
          </h3>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 mb-4">
                  <div className="flex items-center space-x-4">
                    {/* User Avatar */}
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-white font-semibold">
                      {review.username.charAt(0)}{" "}
                      {/* First letter of username */}
                    </div>

                    {/* User Info and Timestamp */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {review.username}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex space-x-1 flex-col text-left">
                      <Rating
                        readonly
                        initialRating={ratings[index].rating}
                        emptySymbol={<FaRegStar size={20} color="#FFD700" />}
                        fullSymbol={<FaStar size={20} color="#FFD700" />}
                      />
                      <p className="text-base text-gray-500">{review.review}</p>
                    </div>
                  </div>

                  {/* Review Tags */}
                  <div className="mt-2 flex flex-wrap space-x-2">
                    {review.tags &&
                      review.tags.length > 0 &&
                      review.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-200 text-gray-700 py-1 px-3 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mt-2">{review.reviewText}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                Chưa có đánh giá nào cho sản phẩm này.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 ml-16 bg-gray-50 px-4 py-6 rounded-lg border border-gray-200 w-2/3 text-left">
        <h2 className="text-lg font-bold mb-4">Đánh giá sản phẩm</h2>

        {/* Rating and review submission form */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Số sao
            </label>
            <Rating
              fractions={2} // Hỗ trợ sao nửa
              initialRating={rating}
              onChange={(value) => setRating(value)}
              emptySymbol={<FaRegStar size={24} color="#FFD700" />}
              fullSymbol={<FaStar size={24} color="#FFD700" />}
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Nhận xét
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows="4"
              className="border p-2 rounded-md w-full"
              placeholder="Viết nhận xét của bạn..."
            ></textarea>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            onClick={handleSubmitReview}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
