"use client"
import { useEffect } from "react";
import { getAllUniqueReferrers } from "@/services";

const ManageReferrals = () => {
  const getReferrers = async () => {
    await getAllUniqueReferrers();
  };
  useEffect(() => {
    getReferrers()
  }, []);

  return <div>mbk</div>;
};

export default ManageReferrals;
