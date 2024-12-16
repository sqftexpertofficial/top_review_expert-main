"use client";
import CustomCard from "@/components/CustomCard";
import Header from "@/components/Header";
import HomeFirstSection from "@/components/HomeFirstSection";
import RecommendedCard from "@/components/RecommendedCard";
import ReviewerCard from "@/components/ReviewerCard";
import Head from 'next/head'
import {
  recommendedData,
  upcomingMovies,
  upcomingProducts,
  trendingOn,
  testimonialList,
  staticCardsList
} from "@/constants.js";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons'
import CustomImgCard from "@/components/CustomImgCard";
import instance from '@/axios.config';
import { handleApiResponse } from "@/utils";
import { useEffect, useState } from "react";

const axios = instance;
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow cursor-pointer pl-[15px]" onClick={onClick}>

      <DoubleRightOutlined />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow cursor-pointer" onClick={onClick}>

      <DoubleLeftOutlined />
    </div>
  );
};

const Main = () => {

  const [carouselsData, setCarouselsData] = useState([]);

  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    variableWidth: true,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1.1,
          centerMode: true,
          arrows: false,
          prevArrow: null,
          nextArrow: null
        },
      },
    ],
  };

  var settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          arrows: false,
          prevArrow: null,
          nextArrow: null
        },
      },
    ],
  };



  const fetchCarouselData = async () => {

    const url = `https://mocki.io/v1/b666799a-c0d4-40ab-9b4f-6fe262d44b2d`;

    const res = await axios.get(url);

    const { details, apiError } = handleApiResponse(res);
    setCarouselsData(details.carousels)
    return { data: details, apiError }
  }



  useEffect(() => {
    fetchCarouselData();
  }, [])

  return (
    <div className="h-[100%]">
      <Head>

        <title>
          Top Review Expert
        </title>
        <link rel="canonical" href={"https://topreview.expert"} />
      </Head>
      <Header />
      <HomeFirstSection />
      <div className="my-auto md:mx-[20%]">
        <div className="my-4 font-medium"> Recommended Top Articles</div>
        <Slider {...settings} className='w-full'>
          {recommendedData?.map((el, index) => (
            <div key={index}>
              <RecommendedCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="my-auto md:mx-[20%]">
        <div className="my-4 font-medium">Users Testimonials</div>
        <Slider {...settings}>
          {testimonialList?.map((el, index) => (
            <div key={index}>
              <ReviewerCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div>


      <div className="my-auto md:mx-[20%]">
        <Slider {...settings1}>
          {staticCardsList?.map((el, index) => (
            <div key={index}>
              <CustomImgCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div>

      {carouselsData.map((carouselRow) => {
        return <div className="my-auto md:mx-[20%]">
          <div className="my-4 font-medium">{carouselRow.title}</div>
          <Slider {...settings}>
            {carouselRow?.data?.map((carousel, index) => {

              const el = {
                title: carousel.name,
                imageURL: carousel.img,
                starRatingObj: { rate: carousel.starRating, votes: carousel.votes },
                recommandationPercentage: '80',
                chipList: [carousel.category],
                redirectionLink: `/companies/${carousel.url_slug}`,
                datePlaceHolder: 'Launch Date'
              }
              return <div key={index}>
                <CustomCard cardData={el} />
              </div>
            })}
          </Slider>
        </div>
      })}
      {/* 
      <div className="my-auto md:mx-[20%]">
        <div className="my-4 font-medium">Trending on Top Review</div>
        <Slider {...settings}>
          {trendingOn?.map((el, index) => (
            <div key={index}>
              <CustomCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div> */}
      {/* 
      <div className="my-auto md:mx-[20%]">
        <div className="my-4 font-medium">
          Running in Theatres/Upcoming Movies
        </div>
        <Slider {...settings}>
          {upcomingMovies?.map((el, index) => (
            <div key={index}>
              <CustomCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div> */}

      {/* <div className="my-auto md:mx-[20%]">
        <div className="my-4 font-medium">Recent/Upcoming Products</div>
        <Slider {...settings}>
          {upcomingProducts?.map((el, index) => (
            <div key={index}>
              <CustomCard cardData={el} />
            </div>
          ))}
        </Slider>
      </div> */}
    </div>
  );
};

export default Main;
