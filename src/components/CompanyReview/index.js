"use client";

// components/CompanyReview.js
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../Breadcrumb";
import CustomerImageRatings from "../CustomerImageRatings";
import TabsAdPosters from "../TabsAdPosters";
import Tabs from "../Tabs";
import ReviewsComp from "../ReviewsComp";
import Photos from "../Photos";
import Specifications from "../Specifications";
import QA from "../QA";
import { AddReviewModal } from "../AddReviewModal";
import { addReviewByCompany, getProductList, getReviewByCompany } from "@/services";
import { message } from "antd";

const CompanyReview = ({ data, reviews }) => {
  const breadcrumbItems = ["Home", "Product Reviews", data.h1Tag];
  const [reviewsData, setReviewsData] = useState(reviews)
  const router = useRouter();
  const [openReview, setOpenReviewModal] = useState(false);
  const [isSaveReviewLoading, setIsSaveReviewLoading] = useState(false);
  const [quickLinks, setQuickLinks] = useState([]);
  const companyTitle = data.h1Tag;
  const companyImage = data.img;
  const stars = ["&#9733;", "&#9733;", "&#9733;", "&#9733;", "&#9733;"];
  const ratings = data.starRatings;
  const votes = data.votes;
  const likeScore = data.likeScore;
  const attributes = [
    { name: "Flavor", value: 80, key: "flavor"},
    { name: "Ingredients", value: 90 , key: "ingredients"},
    { name: "Effectiveness", value: 75, key: "effectiveness" },
    { name: "Value for Money", value: 85, key: "valueformoney" },
  ];
  const attributesEcommerce = [
    { name: "Customer Service", value: 80, key: "customerService" },
    { name: "Product Quality", value: 90, key: "productQuality" },
    { name: "Delivery Timelines", value: 75, key: "deliveryTimelines" },
    { name: "App & Websites", value: 85, key: "appWebSites" },
    { name: "Reliability", value: 85, key: "reliability" },
  ];
  const tabs = [
    { name: "Reviews", id: "reviews-tab-content" },
    { name: "Photos", id: "photos-tab-content" },
    { name: "Specifications", id: "specifications-tab-content" },
    { name: "Q&A", id: "qa-tab-content" },
  ];

  const specificationSections = [
    {
      title: "Product overview",
      fields: [
        {
          title: "Price (In INR)",
          value: "RS 15,000",
        },
        {
          title: "Launch Date",
          value: "17/Dec/2023",
        },
        {
          title: "Body style",
          value: "Sv",
        },
      ],
    },
    {
      title: "Engine & Transmission",
      fields: [
        {
          title: "Price (In INR)",
          value: "RS 15,000",
        },
        {
          title: "Launch Date",
          value: "17/Dec/2023",
        },
        {
          title: "Body style",
          value: "Sv",
        },
      ],
    },
  ];

  const adPosters = [
    // { image: 'https://image3.mouthshut.com/images/Offline/Common/Images/MS-Banner/All-Contest.jpg', alt: 'Ad 1' },
    // { image: 'https://image3.mouthshut.com/images/Offline/Common/Images/MS-Banner/All-Contest.jpg', alt: 'Ad 2' },
  ];


  const overview =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ...";
  const values = ["Value 1", "Value 2", "Value 3"];

  const getProducts = async () => {
    try {
        let res = await getProductList({
            offset: 0,
            limit: 40,
            categoryId: data.categoryId
        })
        setQuickLinks(res?.rows)
    } catch (e) {
        console.log(e)
    }
}

  useEffect(()=>{
    getProducts()
  },[])

  const onBreadCrumbRedirect = (item) => {
    if (item === "Home") {
      router.push("/", { scroll: false });
    } else if (item === "Product Reviews") {
      router.push("/product-list", { scroll: false });
    }
    return null;
  };

  const handleReviewOpen = () => {
    setOpenReviewModal(!openReview);
  };

  const getReview=async()=>{
    try{
    let reviews = await getReviewByCompany(data.id, 10, 0)
    setReviewsData(reviews)
    }catch(e){
        return false
    }
  }

  const handleSubmit = async (reviewObj) => {
    setIsSaveReviewLoading(true)
    const attributeList = data.attributeRatings.map(item=>{
      return {id:item.id, rating: reviewObj.attributes[item.id] || (reviewObj.rating*20)}
    })
    try {
      await addReviewByCompany({
        productCompanyId: data.id,
        rating: reviewObj.rating,
        title: reviewObj.reviewTitle,
        description: reviewObj.reviewComments,
        comment: "",
        attributeRatings: attributeList,
        images: reviewObj?.images
      });
      message.success('Your Review Added Successfully!')
      getReview()
    } catch (e) {
    } finally {
      handleReviewOpen();
      setIsSaveReviewLoading(false)
    }
  };


  return (
    <>
    <div className="container mx-auto py-4 px-4 md:px-8 bg-white my-4 md:w-[84%] border border-solid border-[#e5e5e5] rounded-sm">
      {/* Breadcrumb and Company Title */}
      <div className="mb-4">
        <Breadcrumb
          items={breadcrumbItems}
          handleRedirection={(item) => onBreadCrumbRedirect(item)}
        />
        <h1 className="text-2xl font-bold max-sm:text-[20px]">
          {companyTitle}
        </h1>
      </div>

      {/* Company Image, Stars, Ratings, Votes, Attributes with Progress Bars */}
      <CustomerImageRatings
        companyImage={companyImage}
        stars={stars}
        ratings={ratings}
        likeScore={likeScore}
        votes={votes}
        attributes={data.attributeRatings}
        showReiewModal={handleReviewOpen}
        productCompanyId={data.id}
      />

      <AddReviewModal
        handleReviewOpen={handleReviewOpen}
        openReview={openReview}
        handleSubmit={handleSubmit}
        isSaveReviewLoading={isSaveReviewLoading}
        attributes={data.attributeRatings}
      />
      <div className="flex">
        <div className="md:w-[70%] max-sm:w-full">
          {/* Tabs (Reviews, Photos, Specifications, Q&A) and Ad Posters */}
          <Tabs tabs={tabs}></Tabs>

          {/* Tab content for Reviews */}
          <ReviewsComp
            reviews={reviewsData ?? []}
            containerId={tabs[0].id}
            reviewTitle={data.h2Tag}
            id={data.id}
          />

          {/* Tab content for Photos */}
          <Photos
            containerId={tabs[1].id}
            title={`${data.name} Product photos`}
            id={data.id}
          />

          {/* Tab content for Specifications */}
          <Specifications
            sections={[] ?? specificationSections}
            containerId={tabs[2].id}
            name={data.name}
          />

          {/* Tab content for Q&A */}
          <QA faqs={data?.faqs || []} containerId={tabs[3].id} name={data.name} />
        </div>
        <div className="md:w-[30%] pl-4 max-sm:hidden">
          <TabsAdPosters tabs={tabs} adPosters={adPosters} />
        </div>
      </div>
    </div>
    {quickLinks.length !== 0 && (<div className="bg-gray-900 text-white py-4">
      <div className="container mx-auto px-8">
        {/* Heading */}
        <h4 className="text-lg font-semibold mb-4">
          {data?.category?.name}
        </h4>

        {/* List of URLs */}
        <ul className="flex text-[12px] flex-wrap gap-[5px]">
          {quickLinks.map((link, index) => (
            <li key={index}>
              <a href={`/companies/${link.slug}`} className="hover:text-gray-300">
                {link.name} Reviews,
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>)}
    </>
  );
};

export default CompanyReview;
