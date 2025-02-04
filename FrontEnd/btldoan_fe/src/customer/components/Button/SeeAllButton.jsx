import { FiChevronRight } from "react-icons/fi";

const SeeAllButton = () => {
  return (
    <button className="flex items-center justify-center m-auto text-lg font-semibold text-[#e82e4d] hover:text-white hover:bg-[#e82e4d] py-2 px-4 rounded-3xl transition-all duration-300 border-[1px]">
      Xem Tất Cả
      <FiChevronRight className="ml-1" />
    </button>
  );
};

export default SeeAllButton;
