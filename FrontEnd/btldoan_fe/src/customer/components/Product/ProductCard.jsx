import React from "react";
import { FiSearch, FiPlus } from "react-icons/fi"; // Import search icon from react-icons
import { Link } from "react-router-dom";
const ProductCard = ({
  id,
  imageUrl,
  brand,
  title,
  price,
  discountedPrice,
  discountPersent,
}) => {
  return (
    <div className="relative group max-w-xs mx-auto border-red-400 bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 my-4">
      <div className="absolute z-[1000] left-2 top-2 text-[16px] text-[#ee4d2d] bg-[#fde632] rounded-full w-[44px] h-[44px] flex justify-center items-center font-bold">
        -{discountPersent}%
      </div>
      <div className="relative group cursor-pointer">
        <Link to={`products/id/${id}`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-90"
          />
          <div className="absolute inset-0 flex bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="absolute border-current bg-white shadow-lg shadow-gray-400 w-[44px] h-[44px] flex justify-center items-center rounded-full  
                opacity-0 group-hover:opacity-100 right-[-50px] top-2 group-hover:right-2 transition-all duration-500 ease-in-out cursor-pointer"
            >
              <a href={`products/id/${id}`}>
                <FiSearch className="text-2xl rounded-md font-black text-black hover:text-[#e82e4d] transition-colors duration-300" />
              </a>
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <p className="text-left text-[#7a8189] text-sm uppercase font-semibold tracking-widest">
          {brand}
        </p>
        <a
          href={`products/id/${id}`}
          className="text-left text-gray-800 text-md font-bold line-clamp-2 hover:text-[#d82e4d]"
        >
          {title}
        </a>

        <div className="relative flex items-center mt-2 justify-between">
          <div className="flex justify-center items-center">
            <p className="text-[#fa283d] text-lg font-bold">
              {discountedPrice.toLocaleString()}đ
            </p>
            <p className="text-[#666] text-lg line-through ml-2">
              {price.toLocaleString()}đ
            </p>
          </div>
          <div className="inset-0 flex bg-opacity-30 transition-opacity duration-300 justify-center items-center">
            <div
              className="border-current bg-[#d82e4d] hover:brightness-125 shadow-lg w-[30px] h-[30px] flex justify-center items-center rounded-full 
             right-1 bottom-1 cursor-pointer transition duration-300 ease-in-out"
            >
              <a href="/cart">
                <FiPlus className="text-2xl rounded-md font-black text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
