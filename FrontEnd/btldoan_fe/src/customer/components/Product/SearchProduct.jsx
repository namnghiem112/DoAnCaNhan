import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const SearchProduct = () => {
  const [loadingState, setLoadingState] = useState(false);
  const { customersProduct, loading } = useSelector((store) => store);
  const products = customersProduct?.searchProducts || [];
  console.log(customersProduct);

  return (
    <div className="bg-gray-100 px-32 py-8">
      <div className="bg-white pb-6 px-6">
        {/* Số lượng kết quả tìm được */}
        <div className="py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Có {products.length} kết quả tìm kiếm phù hợp
          </h3>
        </div>

        {loading || loadingState ? (
          // Hiển thị trạng thái loading
          <div className="text-center py-10">
            <p className="text-gray-500">Đang tải sản phẩm...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">Không tìm thấy sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
