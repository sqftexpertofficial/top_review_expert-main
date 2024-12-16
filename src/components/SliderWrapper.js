"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow cursor-pointer pl-[15px]" onClick={onClick}>
      <RightOutlined />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow cursor-pointer" onClick={onClick}>
      <LeftOutlined />
    </div>
  );
};

const SliderWrapper = ({ children,takeComponentWidthHeight=true, slideToShow=3,mobileSlideToShow=1.1,centerMode=true }) => {
  const [showSlider, setShowSlider] = useState(false);
  useEffect(() => {
    setShowSlider(true);
  }, []);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: slideToShow,
    slidesToScroll: 1,
    variableWidth: takeComponentWidthHeight,
    adaptiveHeight: takeComponentWidthHeight,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: mobileSlideToShow,
          centerMode: centerMode,
          arrows: false,
          prevArrow: null,
          nextArrow: null,
        },
      },
    ],
  };
  return (
    <>
      {showSlider ? (
        <Slider {...settings} className="w-full">
          {children}
        </Slider>
      ) : (
        <div className='flex'>{children}</div>
      )}
    </>
  );
};

export default SliderWrapper;
