import React from "react";
import Selection from "./Selection";
const SelectionList = ({ data }) => {
  return (
    <div className="px-32">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center">
        Danh mục nổi bật
      </h2>
      <div className="flex flex-wrap gap-4 justify-center p-6">
        {data.map((item, index) => (
          <Selection key={index} image={item.image} title={item.title} />
        ))}
      </div>
    </div>
  );
};

export default SelectionList;
