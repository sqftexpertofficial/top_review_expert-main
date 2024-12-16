"use client";

// components/Reviews.js
import React, { useState } from "react";
import StarRating from "../StarRating";
import { Select, Pagination } from "antd";
import { getReviewByCompany } from "@/services";
import UserAvatar from "../UserAvatar";
import {getRelativeTime} from "@/utils"

const CompanyReviews = ({ reviews, containerId, reviewTitle, id }) => {
  const [allReviews, setReviews] = useState({
    rows: reviews.rows ?? [],
    count: reviews.count ?? 0,
  });
  const fetchReviews = async (page) => {
    const reviews = await  getReviewByCompany(id, 10, (page-1)*10)
    setReviews(reviews);
  };
  return (
    <div id={containerId} className="pb-4 border-b">
      {/* List of Reviews */}
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">
          {reviewTitle}
        </h2>
        <div className="">
          <Select
            defaultValue="latest"
            style={{ width: 120 }}
            //   onChange={()=>{}}
            options={[
              { value: "latest", label: "Latest" },
              { value: "mostRead", label: "Most Read" },
              { value: "productRating", label: "Product Rate" },
              { value: "mostHelpful", label: "Most Helpful" },
            ]}
          />
        </div>
      </div>
      {allReviews &&
        allReviews?.rows?.map((review, index) => (
          <div key={index} className="mb-4 border p-4 max-sm:text-[10px]">
            <div className="mb-2">Reviewed  <a href={`/companies/${review?.productCompany.slug}`} className="text-[#44a513] font-bold">{review?.productCompany?.name}</a></div>
            <div className="flex">
            {/* User Photo, Name, Reviews Count, Review Title, Rating, Content */}
            <div className="flex flex-col items-center mb-2 w-[12%] flex-shrink-0">
              {/* <img src={review.userPhoto} alt={review.userId} className="w-8 h-8 object-cover rounded-full mr-2" /> */}
              {/* <UserAvatar username={review?.user?.username}/> */}
              <img src={review?.productCompany?.img} alt="companyimage" width={90} height={90}/>
            </div>
            <div className="ml-5 w-[100%]">
                <h3 className="text-lg font-bold">{review.title}</h3>
              <div className="flex items-center mb-2">
                {/* Rating with 5-star icons */}
                <StarRating rating={review.rating} className={"text-lg"} />
                <span className="ml-2 text-xs text-[grey]">{getRelativeTime(review.updatedAt)}</span>
              </div>
              <p className="text-sm">{review.description}</p>
              {/* Like, Comment, Share buttons */}
              {/* <div className="flex mt-2">
                            <button className="mr-2">Like</button>
                            <button className="mr-2">Comment</button>
                            <button>Share</button>
                        </div> */}
            </div>
            </div>
          </div>
        ))}
      {allReviews && allReviews.count === 0 && (
        <div className=" text-gray-600 p-4 max-sm:text-[12px]">
          No reviews available!. Be the first to review
        </div>
      )}
      <div className="flex justify-end">
        <Pagination
          total={allReviews.count}
          defaultPageSize={10}
          // defaultPageSize={1}
          onChange={fetchReviews}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </div>
  );
};

export default CompanyReviews;
