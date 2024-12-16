"use client";
import React from "react";
import { useAppSelector } from "@/store";
import Feedback from "@/components/Feedback";

const FeedbackPage = () => {
  const selectedBusiness = useAppSelector(
    (state) => state.auth.selectedBusiness
  );

 return(
    <Feedback productCompanyId={selectedBusiness?.productCompanyId}/>
 )
};

export default FeedbackPage;
