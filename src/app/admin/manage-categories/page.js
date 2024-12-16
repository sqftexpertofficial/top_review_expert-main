"use client";

import React, { useState, useEffect } from "react";
import { Table, Button, Input, Modal, Form, Popconfirm, message } from "antd";
import { CopyOutlined } from "@ant-design/icons"; // Import the copy icon
import { fetchAllCategories, addCategory, updateCategory, deleteCategory } from "@/services";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        message.success('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  // Function to fetch all categories with pagination
  const fetchCategories = async (page = 1, size = 20) => {
    setLoading(true);
    try {
      const response = await fetchAllCategories({pagination: { page: (page - 1) * size, size }});
      setCategories(response?.rows);
      setPagination({
        current: page,
        pageSize: size,
        total: response?.count || 0,
      });
    } catch (error) {
      message.error("Error fetching categories");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle add category
  const handleAddCategory = () => {
    setIsAddModalVisible(true);
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
    });
    setIsEditModalVisible(true);
  };

  // Handle form submission for adding category
  const handleAddCategorySubmit = async (values) => {
    try {
      await addCategory(values);
      message.success('Category added successfully!');
      fetchCategories(); // Refresh category list
      setIsAddModalVisible(false); // Close modal
    } catch (error) {
      message.error("Error adding category");
      console.error("Error adding category:", error);
    }
  };

  // Handle form submission for updating category
  const handleUpdateCategory = async (values) => {
    try {
      await updateCategory(selectedCategory.id, values);
      message.success('Category updated successfully!');
      fetchCategories(); // Refresh category list
      setIsEditModalVisible(false); // Close modal
    } catch (error) {
      message.error("Error updating category");
      console.error("Error updating category:", error);
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      message.success('Category deleted successfully!');
      fetchCategories(); // Refresh category list
    } catch (error) {
      message.error("Error deleting category");
      console.error("Error deleting category:", error);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Antd Table columns
  const columns = [
    {
      title: "Category ID",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span>
          {id} <CopyOutlined onClick={() => copyToClipboard(id)} style={{ cursor: 'pointer', marginLeft: 8 }} />
        </span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <>
          <Button onClick={() => handleEditCategory(record)} type="link">
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDeleteCategory(record.id)}
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

  return (
      <div className="container mx-auto">
        <h1 className="my-3 text-xl font-medium">Manage Categories</h1>
        <div className="mb-4">
          <Button type="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => fetchCategories(page, pageSize),
          }}
          rowKey="id"
        />

        {/* Edit Category Modal */}
        <Modal
          title="Edit Category"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleUpdateCategory}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the category name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please input the slug!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Add Category Modal */}
        <Modal
          title="Add Category"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form form={addForm} onFinish={handleAddCategorySubmit}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the category name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please input the slug!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add Category
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
  );
};

export default CategoryManagement;
