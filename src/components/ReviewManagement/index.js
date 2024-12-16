import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Form,
  Input,
  List,
  Rate,
  message,
  Pagination,
} from "antd";
import {
  addReview,
  deleteReview,
  fetchReviews,
} from "@/services";
import ReviewForm from "@/components/ReviewForm";

const ReviewManagement = ({ companyId, visible, onClose, isUser = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [selectedReview, setSelectedReview] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [isSubDrawerVisible, setSubDrawerVisible] = useState(false);
  const [attributes, setAttributes] = useState([]);

  useEffect(() => {
    if (visible && companyId) {
      fetchReviewsForCompany(
        companyId,
        pagination.current,
        pagination.pageSize,
        isUser
      );
    }
  }, [visible, companyId, pagination.current, pagination.pageSize]);

  const fetchReviewsForCompany = async (companyId, page, size, isUser) => {
    setLoading(true);
    try {
      const response = await fetchReviews({
        companyId,
        pagination: { page: (page - 1) * size, size },
        isUser,
      });
      setReviews(response.rows);
      setPagination((prev) => ({
        ...prev,
        total: response.count,
      }));
    } catch (error) {
      message.error("Error fetching reviews");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedReview) {
        // await updateReview(selectedReview.reviewId, values);
        // message.success("Review updated successfully!");
      } else {
        await addReview({ companyId, ...values });
        message.success("Review added successfully!");
      }
      form.resetFields();
      setSelectedReview(null);
      setSubDrawerVisible(false);
      fetchReviewsForCompany(
        companyId,
        pagination.current,
        pagination.pageSize,
        isUser
      );
    } catch (error) {
      message.error("Error saving review");
      console.error("Error saving review:", error);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    form.setFieldsValue({
      rating: review.rating,
      title: review.title,
      description: review.description,
    });
    setSubDrawerVisible(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      message.success("Review deleted successfully!");
      fetchReviewsForCompany(
        companyId,
        pagination.current,
        pagination.pageSize,
        isUser
      );
    } catch (error) {
      message.error(error?.error);
      console.error("Error deleting review:", error);
    }
  };

  const handlePaginationChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchReviewsForCompany(companyId, page, pageSize, isUser);
  };

  const handleReviewSubmit = (c) => {
    console.log(c);
  };

  const handleClose = () => {
    onClose();
    setPagination({ current: 1, pageSize: 10, total: 0 }); // Reset pagination
  };

  return (
    <>
      <Drawer
        title="Manage Reviews"
        open={visible}
        onClose={handleClose}
        width={800}
      >
        {/* {isUser && (
          <Button type="primary" onClick={() => setSubDrawerVisible(true)}>
            Add Review
          </Button>
        )} */}
        <List
          loading={loading}
          dataSource={reviews}
          renderItem={(review) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  onClick={() => handleDelete(review?.id)}
                >
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    {isUser && (
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={review?.productCompany?.img}
                          alt="Product"
                          style={{
                            width: 100,
                            height: 70,
                            objectFit: "contain",
                            marginRight: 10,
                          }}
                        />
                        <b>{review?.productCompany?.name}</b>
                      </div>
                    )}
                    <div>{review.title}</div>
                    <div className="my-2">
                      <Rate disabled value={review?.rating} />
                    </div>
                  </div>
                }
                description={
                  <div>
                    {review.description}
                    <div>
                      - {review?.user?.username} ({review?.user?.email})
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={handlePaginationChange}
          showSizeChanger
        />
      </Drawer>

      <Drawer
        title={selectedReview ? "Edit Review" : "Add Review"}
        open={isSubDrawerVisible}
        onClose={() => {
          setSubDrawerVisible(false);
          setSelectedReview(null);
          form.resetFields();
        }}
        width={400}
      >
        <ReviewForm
          attributes={attributes}
          onSubmit={handleReviewSubmit}
          isLoading={false}
        />
      </Drawer>
    </>
  );
};

export default ReviewManagement;
