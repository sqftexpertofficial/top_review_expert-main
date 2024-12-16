"use client";

// components/Reviews.js
import React, { useState } from "react";
import StarRating from "../StarRating";
import { Select, Pagination } from "antd";
import { getReviewByCompany } from "@/services";
import UserAvatar from "../UserAvatar";
import ProgressRating from "../ProgressRating";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

const ReviewsComp = ({ reviews, containerId, reviewTitle, id }) => {
  const [allReviews, setReviews] = useState({
    rows: reviews.rows ?? [],
    count: reviews.count ?? 0,
  });
  const [fullScreenImageList, setFullScreenImageList] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const fetchReviews = async (page) => {
    const reviews = await getReviewByCompany(id, 10, (page - 1) * 10);
    setReviews(reviews);
  };

  const openFullScreen = (index, list) => {
    setFullScreenImageList(list);
    setCurrentImageIndex(index);
  };

  const closeFullScreen = () => {
    setFullScreenImageList([]);
    setCurrentImageIndex(0);
  };

  return (
    <div id={containerId} className="pb-4 border-b">
      {/* List of Reviews */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h2 className="text-2xl font-bold mb-2 sm:mb-0">{reviewTitle}</h2>
        <Select
          defaultValue="latest"
          style={{ width: 120 }}
          options={[
            { value: "latest", label: "Latest" },
            { value: "mostRead", label: "Most Read" },
            { value: "productRating", label: "Product Rate" },
            { value: "mostHelpful", label: "Most Helpful" },
          ]}
        />
      </div>

      {allReviews?.rows?.map((review, index) => (
        <div
          key={index}
          className="mb-4 border p-3 sm:p-4 flex flex-col sm:flex-row rounded-lg shadow-sm"
        >
          {/* User Photo, Name, Reviews Count, Review Title, Rating, Content */}
          <div className="flex flex-col items-center mb-2 sm:w-[12%] flex-shrink-0">
            <UserAvatar username={review?.user?.username} />
            <span className="text-sm">{review?.user?.username}</span>
          </div>

          <div className="pl-3 sm:pl-4 w-full sm:w-[88%]">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold">{review.title}</h3>
              <div className="text-sm text-gray-500">
                {review?.productCompany?.name}
              </div>
            </div>
            <div className="flex items-center mb-2">
              <StarRating rating={review.rating} className={"text-lg"} />
            </div>

            <div className="flex flex-wrap mb-2">
              {review.attributeRatings.map((attribute, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between w-full sm:w-1/2 p-2"
                >
                  <span className="mr-2 text-sm w-[12rem] md:w-[20rem]">
                    {attribute.attribute?.attribute}:
                  </span>
                  {/* <div className="flex-1"> */}
                  <ProgressRating rating={attribute.rating} />
                  {/* </div> */}
                </div>
              ))}
            </div>

            <p className="mt-2 text-sm">{review.description}</p>

            {review.images && review.images.length > 0 && (
              <div className="overflow-x-auto flex mt-2">
                {review.images.map((photo, photoIndex) => (
                  <div
                    key={photoIndex}
                    className="cursor-pointer mr-2 flex-shrink-0"
                    onClick={() => openFullScreen(photoIndex, review.images)}
                  >
                    <img
                      src={photo}
                      alt={`Photo ${photoIndex + 1}`}
                      className="h-24 object-cover w-24 rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {allReviews.count === 0 && (
        <div className="text-gray-600 p-4 text-sm">
          No reviews available! Be the first to review.
        </div>
      )}

      <div className="flex justify-end mt-4">
        <Pagination
          total={allReviews.count}
          defaultPageSize={10}
          onChange={fetchReviews}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>

      {fullScreenImageList.length > 0 && (
        <div className="fixed top-0 left-0 w-full h-full bg-black z-50 flex items-center justify-center">
          <button
            className="absolute top-5 right-5 bg-white text-black py-2 px-4 rounded cursor-pointer text-lg z-50"
            onClick={closeFullScreen}
          >
            Close
          </button>
          <Gallery
            items={fullScreenImageList.map((photo) => ({
              original: photo,
              thumbnail: photo,
              description: "",
            }))}
            showPlayButton={false}
            showFullscreenButton={false}
            startIndex={currentImageIndex}
            onClose={closeFullScreen}
          />
        </div>
      )}
    </div>
  );
};

export default ReviewsComp;
