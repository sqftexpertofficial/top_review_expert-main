"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Input,
  Button,
  DatePicker,
  message,
  Spin,
  Table,
} from "antd";
import { Chart } from "react-google-charts";
import { useAppSelector } from "@/store";
import {
  UserOutlined,
  CheckCircleOutlined,
  StarOutlined,
  SearchOutlined,
  GoogleOutlined,
} from "@ant-design/icons"; // Updated icons
import QRCode from "qrcode.react"; // Import the QRCode component for generating QR codes
import {
  updateBusinessData,
  getDashboardData,
  getReviewAnalytics,
} from "@/services"; // Assume this function updates the URL in your API
import dayjs from "dayjs"; // Use dayjs for date handling

const Dashboard = () => {
  const selectedBusiness = useAppSelector(
    (state) => state.auth.selectedBusiness
  );

  const [reviewUrl, setReviewUrl] = useState(
    selectedBusiness?.productCompany?.gReviewUrl || ""
  );
  const [isUrlValid, setIsUrlValid] = useState(true); // State to track URL validation status
  const [startDate, setStartDate] = useState(null); // State for start date
  const [endDate, setEndDate] = useState(null); // State for end date
  const [dashboardData, setDashboardData] = useState({
    totalFeedbacks: null,
    issuesResolved: null,
  }); // Store data in a single object
  const [loading, setLoading] = useState(false); // Loader state for fetching data
  const [reviewAnalytics, setReviewAnalytics] = useState({}); // State to store review analytics data

  const competitorData = [
    ["Competitor", "Feedbacks"],
    ["Competitor A", 30],
    ["Competitor B", 50],
    ["Competitor C", 20],
    ["Competitor D", 20],
  ];

  // Handle URL update
  const handleUrlUpdate = async () => {
    if (!reviewUrl) {
      setIsUrlValid(false);
      message.error("Please enter a valid Google Place Id.");
      return;
    }

    try {
      await updateBusinessData(selectedBusiness.productCompany.id, {
        gReviewUrl: `https://search.google.com/local/writereview?placeid=${reviewUrl}`,
      });
      message.success("Review URL updated successfully!");
    } catch (error) {
      message.error("Failed to update the review URL.");
      console.error("Failed to update review URL:", error);
    }
  };

  // Fetch feedback and resolved issues count based on filters
  const fetchData = async () => {
    if (!selectedBusiness?.productCompany?.id) {
      message.error("Product company ID is missing");
      return;
    }

    setLoading(true); // Start loading

    const formattedStartDate = startDate
      ? dayjs(startDate).format("YYYY-MM-DD")
      : "";
    const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : "";

    try {
      const response = await getDashboardData({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        productCompanyId: selectedBusiness.productCompany.id,
      });

      setDashboardData({
        totalFeedbacks: response.totalFeedback,
        issuesResolved: response.resolvedIssues,
      });
    } catch (error) {
      message.error("Failed to fetch data");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Fetch review analytics
  const fetchReviewAnalytics = async () => {
    if (!selectedBusiness?.productCompany?.id) {
      message.error("Product company ID is missing");
      return;
    }

    try {
      const response = await getReviewAnalytics({
        productCompanyId: selectedBusiness.productCompany.id,
      });
      setReviewAnalytics(response);
    } catch (error) {
      setReviewAnalytics({});
      console.error("Error fetching review analytics:", error);
    }
  };

  const calculateCurrentWeek = () => {
    const now = dayjs();
    const start = now.subtract(1, "week").startOf("week").startOf("day");
    const end = now.endOf("day");
    return { start, end };
  };

  useEffect(() => {
    const { start, end } = calculateCurrentWeek();
    setStartDate(start);
    setEndDate(end);
  }, []);

  useEffect(() => {
    if (selectedBusiness.productCompanyId) {
      fetchReviewAnalytics();
      fetchData();
    }
  }, [selectedBusiness.productCompanyId]);

  useEffect(() => {
    if (!!selectedBusiness?.productCompany?.gReviewUrl) {
      setReviewUrl(
        getPlaceIdFromUrl(selectedBusiness?.productCompany?.gReviewUrl)
      );
    }
  }, [selectedBusiness]);

  const getPlaceIdFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get("placeid");
    } catch (e) {
      return url;
    }
  };

  // Prepare top 5 restaurants data
  const topRestaurants = reviewAnalytics?.restaurants
    ? reviewAnalytics.restaurants
        .sort((a, b) => b.rating - a.rating) // Sort by rating descending
        .slice(0, 5)
    : [];

  // Define the columns for the restaurant table
  const restaurantColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Rating", dataIndex: "rating", key: "rating" },
    {
      title: "Total Ratings",
      dataIndex: "user_ratings_total",
      key: "user_ratings_total",
    },
    { title: "Address", dataIndex: "address", key: "address" },
  ];

  // Prepare review growth chart data
  const reviewGrowthData = reviewAnalytics?.reviewAnalytics || {};

  const reviewGrowthChartData = [
    [
      "Period",
      "Projected Top Reviews",
      "Additional Reviews Needed",
      "Daily Target",
    ],
    [
      "1 Month",
      reviewGrowthData["1Months"]?.projectedTopReviews || 0,
      reviewGrowthData["1Months"]?.additionalReviewsNeeded || 0,
      reviewGrowthData["1Months"]?.dailyTarget || 0,
    ],
    [
      "2 Months",
      reviewGrowthData["2Months"]?.projectedTopReviews || 0,
      reviewGrowthData["2Months"]?.additionalReviewsNeeded || 0,
      reviewGrowthData["2Months"]?.dailyTarget || 0,
    ],
    [
      "3 Months",
      reviewGrowthData["3Months"]?.projectedTopReviews || 0,
      reviewGrowthData["3Months"]?.additionalReviewsNeeded || 0,
      reviewGrowthData["3Months"]?.dailyTarget || 0,
    ],
    [
      "6 Months",
      reviewGrowthData["6Months"]?.projectedTopReviews || 0,
      reviewGrowthData["6Months"]?.additionalReviewsNeeded || 0,
      reviewGrowthData["6Months"]?.dailyTarget || 0,
    ],
  ];

  const reviewGrowthChartOptions = {
    title: "Review Growth Target vs Additional Reviews Needed",
    curveType: "function",
    legend: { position: "bottom" },
    vAxis: { title: "Reviews" },
    hAxis: { title: "Month" },
    seriesType: "bars",
  };

  const domain =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Date Range Picker */}
      <Row gutter={16} className="mb-6 justify-end" align="middle">
        <Col xs={24} sm={12} md={5}>
          <DatePicker.RangePicker
            value={[startDate, endDate]}
            onChange={([start, end]) => {
              setStartDate(start);
              setEndDate(end);
            }}
            format="YYYY-MM-DD"
            style={{ width: "100%" }}
            placeholder={["Start Date", "End Date"]}
            allowClear={false}
          />
        </Col>
        <Col xs={24} sm={12} md={2}>
          <Button type="primary" onClick={fetchData} style={{ width: "100%" }}>
            Apply Filter
          </Button>
        </Col>
      </Row>

      {/* First row with feedback counts */}
      <Row gutter={24}>
        {/* Total Feedbacks Card */}
        <Col md={6} sm={12} xs={24}>
          <Card
            title={
              <span>
                <UserOutlined /> Total Feedbacks
              </span>
            }
            bordered={false}
            className="shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg"
          >
            {loading ? (
              <div className="flex justify-center">
                <Spin size="large" />
              </div>
            ) : (
              <h2 className="text-5xl font-bold">
                {dashboardData?.totalFeedbacks}
              </h2>
            )}
          </Card>
        </Col>

        {/* Issues Resolved Card */}
        <Col xs={24} sm={12} md={6}>
          <Card
            title={
              <span>
                <CheckCircleOutlined /> Issues Resolved
              </span>
            }
            bordered={false}
            className="shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg"
          >
            {loading ? (
              <div className="flex justify-center">
                <Spin size="large" />
              </div>
            ) : (
              <h2 className="text-5xl font-bold text-yellow-600">
                {dashboardData?.issuesResolved}
              </h2>
            )}
          </Card>
        </Col>

        {/* Google Rating Card */}

        {!!selectedBusiness?.productCompany?.gReviewUrl && (
          <Col xs={24} sm={12} md={6}>
            <Card
              title={
                <span>
                  <StarOutlined /> Google Rating
                </span>
              }
              bordered={false}
              className="shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg"
            >
              {loading ? (
                <div className="flex justify-center">
                  <Spin size="large" />
                </div>
              ) : (
                <h2
                  className={`text-5xl font-bold ${
                    reviewAnalytics?.myRestaurant?.rating <= 2.5
                      ? "text-red-600" // Red for low ratings
                      : reviewAnalytics?.myRestaurant?.rating <= 3.5
                      ? "text-yellow-500" // Yellow for average ratings
                      : "text-green-600" // Green for good ratings
                  }`}
                >
                  {reviewAnalytics?.myRestaurant?.rating}
                </h2>
              )}
            </Card>
          </Col>
        )}

        {/* Total User Ratings Card */}
        {!!selectedBusiness?.productCompany?.gReviewUrl && (
          <Col xs={24} sm={12} md={6}>
            <Card
              title={
                <span>
                  <SearchOutlined /> Total User Ratings
                </span>
              }
              bordered={false}
              className="shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg"
            >
              {loading ? (
                <div className="flex justify-center">
                  <Spin size="large" />
                </div>
              ) : (
                <h2 className="text-5xl font-bold">
                  {reviewAnalytics?.myRestaurant?.user_ratings_total}
                </h2>
              )}
            </Card>
          </Col>
        )}
      </Row>

      {/* Second row with charts */}
      <Row gutter={24} justify="center" className="mt-10">
        <Col span={12}>
          <Card
            title="Review Growth Target"
            bordered={false}
            className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <Chart
              width={"100%"}
              height={"400px"}
              chartType="ComboChart"
              loader={<div>Loading Chart...</div>}
              data={reviewGrowthChartData}
              options={reviewGrowthChartOptions}
              rootProps={{ "data-testid": "2" }}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title={
              <span>
                <GoogleOutlined /> Google Place Id
              </span>
            }
            bordered={false}
            className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            <div>
              <Input
                value={reviewUrl}
                onChange={(e) => setReviewUrl(e.target.value)}
                placeholder="Enter google place id"
                className="mb-4"
              />
              <Button
                type="primary"
                className="mt-4 mr-3"
                onClick={handleUrlUpdate}
              >
                Update Id
              </Button>
              {!isUrlValid && (
                <span className="text-red-500">
                  Please enter a valid Google Review URL
                </span>
              )}
            </div>
            {!!selectedBusiness?.productCompany?.gReviewUrl && (
              <div className="mt-6">
                <QRCode
                  value={`${domain}/reviewus?businessId=${selectedBusiness?.productCompany?.id}`}
                  size={200}
                />
                <div className="mt-4">
                  <a
                    href={`${domain}/reviewus?businessId=${selectedBusiness?.productCompany?.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    {`${domain}/reviewus?businessId=${selectedBusiness?.productCompany?.id}`}
                  </a>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Display Top 5 Restaurants */}
      {topRestaurants.length > 0 && (
        <Row gutter={24} className="mt-10">
          <Col span={24}>
            <Card
              title="Top 5 Competitors in your place"
              bordered={false}
              className="shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <Table
                dataSource={topRestaurants}
                columns={restaurantColumns}
                rowKey="name"
                pagination={false}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
