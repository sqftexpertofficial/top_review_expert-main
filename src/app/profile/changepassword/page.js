"use client";
import React from "react";
import { Form, Input, Button } from "antd";
import {  useAppSelector} from "@/store";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const authData = useAppSelector((state) => state.auth);
  const {userData} = authData
  const handleSubmit = async (values) => {
    // try {
    //   await axios.put('/api/change-password', values);
    //   message.success('Password updated successfully!');
    //   form.resetFields();
    // } catch (error) {
    //   message.error('Failed to update password');
    // }
  };

  return (
    <div className="p-3">
      <h1 className="text-2xl font-bold mb-4 max-sm:text-[14px] max-sm:mb-0">
        Update Password
      </h1>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>

        <div className="mb-4">
           Top Review ID - <b>{userData?.id}</b>
        </div>

        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={[
            { required: true, message: "Please enter your old password" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters long" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button type="primary" htmlType="submit">
              Update Password
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
