import React from "react";
import HomeCarousel from "../components/Carousel/HomeCarousel";
import { homeCarouselData } from "../components/Carousel/HomeCarouselData";
import SelectionList from "../components/Nabar/SelectionList";
import { selectionData } from "../components/Nabar/SelectionData";
import HomeProductSection from "../components/Product/HomeProductSection";
const HomePage = () => {
  return (
    <div className="">
      <HomeCarousel images={homeCarouselData} />
      <SelectionList data={selectionData} />
      <HomeProductSection />
    </div>
  );
};

export default HomePage;
