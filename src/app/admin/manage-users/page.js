"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  Select,
  Button,
  Input,
  Modal,
  Form,
  Popconfirm,
  message,
} from "antd";
import {
  fetchAllUsers,
  fetchByUserId,
  updateUser,
  deleteUser,
  addUser,
} from "@/services";
import { CopyOutlined } from "@ant-design/icons";
import ReviewManagement from "@/components/ReviewManagement";

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ roleId: "", status: "active" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isReviewDrawerVisible, setIsReviewDrawerVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (
    page = 1,
    size = 10,
    search = "",
    status = "active"
  ) => {
    setLoading(true);
    try {
      const response = await fetchAllUsers({
        search: search || "",
        pagination: { page: (page - 1) * size, size },
        status,
      });
      setUsers(response?.rows);
      setPagination({
        current: page,
        pageSize: size,
        total: response?.count || 0,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchUsers(
      pagination.current,
      pagination.pageSize,
      searchQuery,
      filters.status
    );
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
    });
    setIsEditModalVisible(true);
  };

  const handleAddUser = () => {
    setIsAddModalVisible(true);
  };

  const handleUpdateUser = async (values) => {
    try {
      await updateUser(selectedUser.id, {
        ...values,
      });
      fetchUsers();
      setIsEditModalVisible(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAddUserSubmit = async (values) => {
    try {
      await addUser(values);
      fetchUsers();
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDeleteUser = async (userId, isActive) => {
    try {
      await deleteUser(userId, isActive);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCopyUserId = (userId) => {
    navigator.clipboard.writeText(userId);
    message.success("User ID copied to clipboard!");
  };

  const handleShowReviews = (user) => {
    setSelectedUser(user);
    setIsReviewDrawerVisible(true);
  };
  
  useEffect(() => {
    fetchUsers(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (id) => (
        <span>
          {id}{" "}
          <CopyOutlined
            onClick={() => handleCopyUserId(id)}
            style={{ cursor: "pointer", marginLeft: 8 }}
          />
        </span>
      ),
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mobile Number",
      dataIndex: "mobileNumber",
      key: "mobileNumber",
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
          <Button onClick={() => handleEditUser(record)} type="link">
            Edit
          </Button>
          <Button onClick={() => handleShowReviews(record)} type="link">
            Reviews
          </Button>
          <Popconfirm
            title={`Are you sure you want to ${
              record.status === "active" ? "delete" : "enable"
            } this user?`}
            onConfirm={() =>
              handleDeleteUser(
                record.id,
                record.status === "active" ? true : false
              )
            }
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              {record.status === "active" ? "Delete" : "Enable"}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="container mx-auto">
        <h1 className="my-3 text-xl font-medium">Manage Users</h1>
        <div className="flex items-center mb-4">
          <div className="flex space-x-4">
            <Input
              placeholder="Search by name, mobile, email"
              value={searchQuery}
              onChange={handleSearchChange}
              style={{ width: 400 }}
              allowClear
            />
            <Select
              className="w-48"
              placeholder="Select Status"
              onChange={(value) => handleFilterChange("status", value)}
              value={filters.status}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </div>
          <Button type="primary" onClick={handleSearch} className="mx-2">
            Filter
          </Button>
          <div className="ml-auto flex">
            <Button type="primary" onClick={handleAddUser}>
              Add User
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) =>
              fetchUsers(page, pageSize, searchQuery, filters.status),
          }}
          rowKey="id"
        />

        {/* Edit User Modal */}
        <Modal
          title="Edit User"
          open={isEditModalVisible}
          onCancel={() => setIsEditModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleUpdateUser}>
            <Form.Item name="username" label="User Name">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
            <Form.Item name="mobileNumber" label="Mobile Number">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Add User Modal */}
        <Modal
          title="Add User"
          open={isAddModalVisible}
          onCancel={() => setIsAddModalVisible(false)}
          footer={null}
        >
          <Form form={addForm} onFinish={handleAddUserSubmit}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please input the email!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="User Name"
              rules={[{ required: true, message: "Please input username!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please input the password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add User
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <ReviewManagement
        isUser={true}
        companyId={selectedUser?.id}
        visible={isReviewDrawerVisible}
        onClose={() => setIsReviewDrawerVisible(false)}
      />
      </>
  );
};

export default UserManagement;
