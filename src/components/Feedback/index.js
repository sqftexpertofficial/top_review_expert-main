"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  message,
  Spin,
  Drawer,
  Timeline,
  Button,
  Radio,
  Pagination,  // Import Pagination component from Ant Design
} from "antd";
import { fetchLatestFeedbackData, fetchFeedbackDataByUser } from "@/services";

const Feedback = ({ productCompanyId }) => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [userFeedbackDetails, setUserFeedbackDetails] = useState([]);
  const [filterStatus, setFilterStatus] = useState("unresolved"); // Default filter status is unresolved

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [pageSize, setPageSize] = useState(10); // Items per page (limit)
  const [totalItems, setTotalItems] = useState(0); // Total number of items available

  // Fetch feedback data based on the filter, search term, offset, and limit
  const fetchFeedback = async (search = "", rectificationRequest = false, page = 1, limit = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit; 
      const response = await fetchLatestFeedbackData({
        productCompanyId,
        search,
        rectificationRequest,
        offset,
        limit,
      });

      if (response.data) {
        setFeedbackData(response?.data); // Set the feedback data for the current page
        setTotalItems(response?.pagination?.pageSize); // Set the total number of items from the response
      }
    } catch (error) {
      message.error("Failed to fetch feedback data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productCompanyId) {
      fetchFeedback(searchTerm, filterStatus !== "unresolved", currentPage, pageSize);
    }
  }, [productCompanyId, filterStatus, currentPage, pageSize]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search button click
  const handleSearchClick = () => {
    fetchFeedback(searchTerm, filterStatus !== "unresolved", currentPage, pageSize);
  };

  // Handle filter status change
  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value); // Update the filter status
  };

  // Format date into a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Handle feedback item click to show the drawer with feedback details
  const handleFeedbackClick = async (feedback) => {
    setDrawerVisible(true); // Show the drawer
    setSelectedFeedback(feedback);
    try {
      const response = await fetchFeedbackDataByUser({
        mobileNo: feedback.mobileNo,
        productCompanyId: productCompanyId,
      });
      if (response) {
        setUserFeedbackDetails(response); // Set the feedback details in state
      }
    } catch (error) {
      message.error("Failed to fetch feedback details");
    }
  };

  // Close the drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
    setUserFeedbackDetails([]); // Clear the feedback details when closing the drawer
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page); // Update the current page
    setPageSize(pageSize); // Update the page size (number of items per page)
  };

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        {/* Search input */}
        <Input
          placeholder="Search feedback by mobileNo, name"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-96"
        />
        <Button type="primary" onClick={handleSearchClick} className="ml-2">
          Search
        </Button>
      </div>

      {/* Filter options */}
      <div className="mb-4">
        <Radio.Group onChange={handleFilterChange} value={filterStatus}>
          <Radio.Button value="unresolved">Unresolved</Radio.Button>
          <Radio.Button value="resolved">Resolved</Radio.Button>
        </Radio.Group>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {feedbackData.map((feedback) => (
              <Card
                key={feedback.id}
                title={`Feedback from ${feedback.mobileNo}`}
                extra={
                  <span className="text-yellow-500">
                    {feedback.starRating} ★
                  </span>
                }
                className="bg-white shadow-lg rounded-md cursor-pointer"
                onClick={() => handleFeedbackClick(feedback)} // On click, show the feedback details
              >
                <p className="text-xs text-gray-500">
                  Created At: {formatDate(feedback.latestFeedbackDate)}
                </p>
              </Card>
            ))}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center mb-4">
            <Pagination
              current={currentPage} // Current page number
              pageSize={pageSize} // Items per page
              total={totalItems} // Total number of feedback items
              onChange={handlePageChange} // Handle page change
              showSizeChanger // Option to change the page size
              pageSizeOptions={["5", "10", "20"]} // Page size options
            />
          </div>
        </>
      )}

      {/* Drawer for feedback details */}
      <Drawer
        title={`Feedback Details for ${selectedFeedback?.mobileNo}`}
        placement="right"
        open={drawerVisible}
        onClose={closeDrawer}
        width={500}
      >
        <Timeline>
          {userFeedbackDetails.length > 0 ? (
            userFeedbackDetails.map((detail, index) => (
              <Timeline.Item key={index}>
                {/* Render the question and answer pair */}
                {detail?.answers?.map((el) => (
                  <div>
                    <p className="text-sm">
                      {el.question.questionText} -{" "}
                      {Array.from({ length: el.answerValue }).map(
                        (_, index) => (
                          <span key={index} className="text-yellow-500">
                            ★
                          </span>
                        )
                      )}
                    </p>
                  </div>
                ))}
                <p className="text-[blue]">{detail.description}</p>  
                <p >Rating {detail.starRating}   ★</p>            
                <p className="text-[grey]">{formatDate(detail.createdAt)}</p>
              </Timeline.Item>
            ))
          ) : (
            <Timeline.Item>
              <Spin size="small" />
            </Timeline.Item>
          )}
        </Timeline>
      </Drawer>
    </div>
  );
};

export default Feedback;
