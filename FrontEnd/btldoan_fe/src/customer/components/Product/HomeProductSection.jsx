import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import SeeAllButton from "../Button/SeeAllButton";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findProducts } from "../../../../src/Redux/Product/Action";
const HomeProductSection = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jwt = localStorage.getItem("jwt");
  const param = useParams();
  const { customersProduct, loading } = useSelector((store) => store); // Thêm loading từ Redux
  const location = useLocation();
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);

  // Trích xuất query params
  const colorValue = searchParams.get("color") || "";
  const sizeValue = searchParams.get("size") || "";
  const price = searchParams.get("price");
  const discount = searchParams.get("minDiscount") || 0;
  const sortValue = searchParams.get("sort") || "price_low";
  const pageNumber = Number(searchParams.get("pageNumber") || 1);
  const stock = searchParams.get("stock") || "in_stock";
  const category = searchParams.get("category") || "";

  const [loadingState, setLoadingState] = useState(false); // Loading cục bộ

  useEffect(() => {
    const [minPrice, maxPrice] = price
      ? price.split("-").map(Number)
      : [0, 1000000000];

    const data = {
      category: category || param.lavelThree || "",
      colors: colorValue,
      sizes: sizeValue,
      minPrice: minPrice || 0,
      maxPrice: maxPrice || 1000000000,
      minDiscount: Number(discount) || 0,
      sort: sortValue,
      pageNumber: pageNumber > 0 ? pageNumber - 1 : pageNumber,
      pageSize: 10,
      stock: stock,
    };

    setLoadingState(true); // Bắt đầu trạng thái loading
    dispatch(findProducts(data)).finally(() => {
      setLoadingState(false); // Kết thúc trạng thái loading
    });
  }, [
    category,
    colorValue,
    sizeValue,
    price,
    discount,
    sortValue,
    pageNumber,
    stock,
    param.lavelThree,
    dispatch,
  ]);
  const products = customersProduct?.products?.content || [];

  return (
    <div className="bg-[#e82e4d] px-32 py-8">
      <div className="bg-white pb-6">
        <h2 className="text-3xl text-gray-800 font-semibold p-2 pl-6 text-left hover:text-[#e82e4d] transition-all duration-300 ease-in-out cursor-pointer">
          ƯU ĐÃI HOT, ĐỪNG BỎ LỠ!!
        </h2>

        {loading || loadingState ? ( // Hiển thị trạng thái loading
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 rounded-xl">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
          </div>
        )}
        <SeeAllButton />
      </div>
    </div>
  );
};

export default HomeProductSection;
