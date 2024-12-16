"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Select, Input, Upload, Drawer } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { fetchAllProductCompanies, addProductCompany, updateProductCompany, deleteProductCompany, getCategoryList, uploadCSV } from "@/services";
import StarRating from "@/components/StarRating"; 
import ProductCompanyModal from "@/components/ProductCompanyModal"; 
import ReviewManagement from "@/components/ReviewManagement"; 
import FAQDrawer from "@/components/FAQDrawer";
import Feedback from "@/components/Feedback";  

const { Option } = Select;

const ProductManagement = () => {
  const [productCompanies, setProductCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [isReviewDrawerVisible, setIsReviewDrawerVisible] = useState(false);
  const [isFAQDrawerVisible, setIsFAQDrawerVisible] = useState(false);
  const [isFeedbackDrawerVisible, setIsFeedbackDrawerVisible] = useState(false); 
  const [currentCompanyId, setCurrentCompanyId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await getCategoryList();
      setSelectedCategory(res && res[0].id)
      setAllCategories(res);
    } catch (error) {
      message.error("Error fetching categories");
      console.error("Error fetching categories", error);
    }
  };

  const fetchProductCompanies = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const response = await fetchAllProductCompanies({
        filter: { categoryId: selectedCategory, name: searchTerm },
        pagination: { page: (page - 1) * size, size },
      });
      setProductCompanies(response.rows);
      setPagination({
        current: page,
        pageSize: size,
        total: response.count,
      });
    } catch (error) {
      message.error("Error fetching product companies");
      console.error("Error fetching product companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsModalVisible(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (values) => {
    try {
      if (selectedCompany) {
        await updateProductCompany(selectedCompany.id, values);
        message.success('Product company updated successfully!');
      } else {
        await addProductCompany(values);
        message.success('Product company added successfully!');
      }
      fetchProductCompanies(pagination.current, pagination.pageSize); 
      setIsModalVisible(false);
    } catch (error) {
      message.error("Error saving product company");
      console.error("Error saving product company:", error);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await deleteProductCompany(companyId);
      message.success('Product company deleted successfully!');
      fetchProductCompanies(pagination.current, pagination.pageSize); 
    } catch (error) {
      message.error("Error deleting product company");
      console.error("Error deleting product company:", error);
    }
  };

  const handleShowReviews = (companyId) => {
    setCurrentCompanyId(companyId);
    setIsReviewDrawerVisible(true);
  };

  const handleShowFAQ = (companyId) => {
    setCurrentCompanyId(companyId);
    setIsFAQDrawerVisible(true);
  };

  const handleShowFeedbacks = (companyId) => {
    setCurrentCompanyId(companyId);
    setIsFeedbackDrawerVisible(true); // Open the feedback management drawer
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterSearch = () => {
    fetchProductCompanies(1, pagination.pageSize);
  };

  const handleBulkUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadCSV(formData);
      message.success("Bulk upload successful!");
      fetchProductCompanies(pagination.current, pagination.pageSize);
    } catch (error) {
      message.error("Error during bulk upload");
      console.error("Error during bulk upload:", error);
    }
  };

  const handleFileChange = (info) => {
    if (info.file.type !== 'text/csv') {
      message.error("You can only upload CSV files!");
      return;
    }
    handleBulkUpload(info.file);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      width: "100px",
      render: (img) => <img src={img} alt="Product" style={{ width: 100, height: 70, objectFit: 'contain' }} />,
    },
    {
      title: "Company ID",
      dataIndex: "id",
      key: "id",
      width: "300px",
      render: (id) => (
        <span>
          {id} <CopyOutlined onClick={() => navigator.clipboard.writeText(id)} style={{ cursor: 'pointer', marginLeft: 8 }} />
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "400px"
    },
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
      width: "300px",
    },
    {
      title: "Star Rating",
      dataIndex: "starRatings",
      key: "starRatings",
      width: "100px",
      render: (rating) => <StarRating rating={rating} />,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEditCompany(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleShowReviews(record.id)} type="link">
            Manage Reviews
          </Button>
          <Button onClick={() => handleShowFAQ(record.id)} type="link">
            Manage FAQ
          </Button>
          <Button onClick={() => handleShowFeedbacks(record.id)} type="link">
            Manage Feedbacks 
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product company?"
            onConfirm={() => handleDeleteCompany(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (allCategories.length > 0) {
      handleFilterSearch(); 
    }
  }, [allCategories]);

  return (
    <div className="container mx-auto">
      <h1 className="my-3 text-xl font-medium">Manage Product Companies</h1>
      <div className="mb-4">
        <Select
          className="ml-3"
          placeholder="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: 300 }}
          allowClear
        >
          {allCategories.map(category => (
            <Option key={category.id} value={category.id}>
              {category.name}
            </Option>
          ))}
        </Select>
        <Input
          className="!ml-3"
          placeholder="Search by company name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ width: 300 }}
          allowClear
        />
        <Button className="ml-3" type="primary" onClick={handleFilterSearch}>
          Search
        </Button>
        <Button type="primary" onClick={handleAddCompany} className="ml-2">
          Add Product Company
        </Button>
        <Upload
          accept=".csv"
          showUploadList={false}
          beforeUpload={(file,originFileObj) => {
            handleFileChange({ file, originFileObj });
            return false; // Prevent automatic upload
          }}
        >
          <Button variant="filled" className="ml-2">Bulk Upload CSV</Button>
        </Upload>
      </div>

      <Table
        columns={columns}
        dataSource={productCompanies}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchProductCompanies(page, pageSize),
        }}
        rowKey="id"
      />

      <ProductCompanyModal
        visible={isModalVisible}
        allCategories={allCategories}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleModalSubmit}
        initialValues={selectedCompany}
      />

      <ReviewManagement
        companyId={currentCompanyId}
        visible={isReviewDrawerVisible}
        onClose={() => setIsReviewDrawerVisible(false)}
      />

      <FAQDrawer
        companyId={currentCompanyId}
        visible={isFAQDrawerVisible}
        onClose={() => setIsFAQDrawerVisible(false)}
      />
      <Drawer
        title="Manage Feedback"
        open={isFeedbackDrawerVisible}
        onClose={() => setIsFeedbackDrawerVisible(false)} 
        width={800}
      >
      <Feedback
        productCompanyId={currentCompanyId}
      />
      </Drawer>
    </div>
  );
};

export default ProductManagement;
