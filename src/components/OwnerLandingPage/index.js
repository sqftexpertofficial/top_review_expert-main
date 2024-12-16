"use client";
import React from "react";
import BusinessHeader from "@/components/BusinessHeader";
import BusinessSignUp from "@/components/BusinessSignUp";
import Image from "next/image";
import {
  testimonialList,
} from "@/constants.js";
import SliderWrapper from "@/components/SliderWrapper";
import ReviewerCard from "@/components/ReviewerCard";
// import faqQuestions from "@/components/faqQuestions";

const brands = [
  { name: "Darbar", src: "/assets/darbar fine.png", alt: "brand logos" },
  {
    name: "Kanakya Foods",
    src: "/assets/Kakatiya foods.png",
    alt: "Kanakya Foods",
  },
  {
    name: "Maa Annapurna Cuisine",
    src: "/assets/maa annapurna.png",
    alt: "Maa Annapurna Cuisine",
  },
];

const features = [
  {
    title: "Visitors Review",
    description: "COLLECT FEEDBACK",
    imgSrc: "/assets/Customer Feedback-01.png",
    imgAlt: "Visitors Review Image",
  },
  {
    title: "Customer Recovery",
    description: "RECONNECT CUSTOMER",
    imgSrc: "/assets/Customer Feedback-02.png",
    imgAlt: "Customer Recovery Image",
  },
  {
    title: "Whatsapp Marketing",
    description: "BOOST REVENUE",
    imgSrc: "/assets/Customer Feedback-03.png",
    imgAlt: "Whatsapp Marketing Image",
  },
  {
    title: "Performance Insights",
    description: "TRANSFORM DATA INTO RESULTS",
    imgSrc: "/assets/Customer Feedback-04.png",
    imgAlt: "Performance Insights Image",
  },
];

const OwnerLandingPage = () => {
  const handleSubmit = (val) => {
    console.log(val);
  };
  return (
    <>
      <BusinessHeader />
      <div className="container flex max-sm:flex-col max-w-full md:h-[100%]">
        {/* left side container */}
        <div className='w-[50%] max-sm:w-full p-0 bg-cover bg-no-repeat bg-center relative z-0 bg-[url("https://www.mouthshut.com/App_Themes/images/Dashboard/sign-up-img.jpg")]'>
          <div className="absolute w-full h-full bg-gradient-to-r from-violet-500" />
          <div className="relative w-[570px] float-right top-[15%] justify-between max-sm:w-full max-sm:top-0 my-[30px] px-[15px]">
            <h1 className="text-[30px] font-normal text-white mb-[20px]">
              Start enhancing your Business
            </h1>
            <div className="w-[100px] border border-solid border-white mb-[30px]" />
            <div className="text-[24px] font-normal text-white mb-[24px]">
              Improve your ORM with customer reviews
            </div>
            <ul className="text-[18px] leading-[1.6] text-white">
              <li className="flex items-center gap-[8px]">
                <div className="w-[7px] h-[7px] rounded-[20px] bg-white" />{" "}
                <h2>Increase your on-site conversion rate</h2>
              </li>
              <li className="flex items-center gap-[8px]">
                <div className="w-[7px] h-[7px] rounded-[20px] bg-white" />{" "}
                <h2>Open up communication lines with unhappy customers</h2>
              </li>
              <li className="flex items-center gap-[8px]">
                <div className="w-[7px] h-[7px] rounded-[20px] bg-white" />{" "}
                <h2>
                  Our Services Starting at Rs 249/Month, offering reliable
                  solutions for you.
                </h2>
              </li>
            </ul>
          </div>
        </div>
        {/* right side container */}
        <div className="w-[50%] max-sm:w-full relative">
          <div className="relative top-[5%] float-left my-[30px] pl-[13%] max-sm:px-[13px]">
            <div className="max-sm:text-[20px] text-[24px] mb-3 text-[#242c42] font-medium">
              Enquire about your brand to get started
            </div>
            <BusinessSignUp handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="brand-trust">
        {/* Trusted By Brands Section */}
        <section className="trusted-by-brands py-8 w-full mt-10">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Trusted By Brands
            </h2>
            <div className="flex justify-center items-center flex-wrap gap-x-12 gap-y-28">
              {brands.map((brand) => (
                <div key={brand.name} className="brand-logo">
                  <Image
                    src={brand.src}
                    alt={brand.alt}
                    width={brand.name === "Darbar" ? 180 : 80} // Darbar image width increased
                    height={brand.name === "Darbar" ? 350 : 120} // Uniform height for all images
                    className={brand.name === "Darbar" ? "object-contain" : ""}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why TopReviewExpert Section */}
        <section className="why-topreview-expert bg-gray-50 py-8 w-full shadow-md shadow-gray-300 mb-10">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-2xl font-semibold mb-6">
              Why TopReviewExpert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="feature-card flex flex-col items-center"
                >
                  <p className="text-sm text-white font-semibold bg-blue-500 px-4 py-1 rounded w-fit mb-2">
                    {feature.description}
                  </p>

                  <h3 className="text-xl font-medium mt-2 mb-4">
                    {feature.title}
                  </h3>

                  {/* Image */}
                  <div className="flex justify-center mt-2">
                    <Image
                      src={feature.imgSrc}
                      alt={feature.imgAlt}
                      width={120}
                      height={120}
                      className="ml-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

    
      <div className="my-auto mx-auto max-w-[1200px]">
  <div 
    className="my-4 font-semibold text-lg max-sm:ml-4 text-blue-500 text-center">
    TOPREVIEW EXPERT
  </div>
  <SliderWrapper>
    {testimonialList?.map((el, index) => (
      <div key={index}>
        <ReviewerCard cardData={el} />
      </div>
    ))}
  </SliderWrapper>

  
</div>
{/* <div className="mt-8">
    <h2 className="text-2xl font-bold text-center mb-6">{faqQuestions.title}</h2>
    <div className="space-y-6">
      {faqQuestions.questions.map((question, index) => (
        <div key={index} className="p-4 border rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-2">{question.title}</h3>
          <p dangerouslySetInnerHTML={{ __html: question.description }} />
        </div>
      ))}
    </div>
  </div> */}


    </>
  );
};

export default OwnerLandingPage;
