"use client";
import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, message, Upload } from "antd";
import { UploadOutlined, UserOutlined, HomeOutlined, GlobalOutlined, InfoCircleOutlined, CalendarOutlined } from "@ant-design/icons";
// import axios from "axios";

const { Option } = Select;

const EditProfile = () => {
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    // Fetch initial profile data from API
    // const fetchProfileData = async () => {
    //   try {
    //     const response = await axios.get("/api/profile"); // Replace with your API endpoint
    //     setInitialValues(response.data);
    //     form.setFieldsValue(response.data);
    //     setImageUrl(response.data.imageUrl);
    //   } catch (error) {
    //     message.error("Failed to load profile data");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchProfileData();
  }, [form]);

  const handleSubmit = async (values) => {
    if (!values.name || !values.gender) {
      message.error("Name and Gender are mandatory fields.");
      return;
    }

    // try {
    //   await axios.put("/api/profile", values); // Replace with your API endpoint
    //   message.success("Profile updated successfully!");
    // } catch (error) {
    //   message.error("Failed to update profile");
    // }
  };

  const handleImageUpload = async (info) => {
    if (info.file.status === "done") {
      setImageUrl(info.file.response.imageUrl);
    }
  };

//   if (loading) {
//     return <div>Loading...</div>; // Loading state
//   }

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">
        Edit Profile
      </h1>
      <div className="flex mb-4">
        <div className="mr-4">
          <Upload
            name="avatar"
            showUploadList={false}
            action="/api/upload" // Replace with your upload endpoint
            onChange={handleImageUpload}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-gray-200 flex items-center justify-center w-full h-full">
                  <UploadOutlined className="text-gray-500 text-2xl" />
                </div>
              )}
            </div>
          </Upload>
        </div>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSubmit}
          className="ml-4 flex-grow"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name." }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select your gender." }]}
          >
            <Select placeholder="Select your gender" prefix={<InfoCircleOutlined />}>
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Date of Birth" name="dob">
            <DatePicker style={{ width: "100%" }} prefix={<CalendarOutlined />} />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input.TextArea rows={4} prefix={<HomeOutlined />} />
          </Form.Item>

          <Form.Item label="Country" name="country">
            <Input prefix={<GlobalOutlined />} />
          </Form.Item>

          <Form.Item label="State" name="state">
            <Input  />
          </Form.Item>

          <Form.Item label="City" name="city">
            <Input  />
          </Form.Item>

          <Form.Item label="Zip Code" name="zipcode">
            <Input />
          </Form.Item>

          <Form.Item label="Education" name="education">
            <Input />
          </Form.Item>

          <Form.Item label="Biography" name="biography">
            <Input.TextArea rows={4} prefix={<InfoCircleOutlined />} />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button type="primary" htmlType="submit">
                Update Profile
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;