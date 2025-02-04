import React from "react";
import { selectionData } from "./SelectionData";
const Selection = ({ image, title }) => {
  const href = `/categories/${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-110 hover:animate-pulse cursor-pointer">
      <a href={href}>
        <img
          src={image}
          alt={title}
          className="w-[120px] h-[120px] mb-2 hover:animate-wiggle"
        />
      </a>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
  );
};

export default Selection;
