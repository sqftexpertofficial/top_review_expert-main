import React from "react";
import Reviewus from "@/components/Reviewus";

const Review = ({ searchParams }) => {
  return <Reviewus businessId={searchParams.businessId} nameQuery={searchParams.name} contactQuery={searchParams.contact} />;
};

export default Review;
