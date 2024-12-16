import React, { useState } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { register } from '@/services';
import { updateSignUpModalStatus } from "@/store/authSlice";
import { useAppDispatch } from "@/store";

const SignUp = ({ onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();

  const handleSignup = async (values) => {
    try {
      const res = await register({ ...values });
      messageApi.open({
        type: 'success',
        content: res?.message || 'Success!',
      });
      form.resetFields();
      dispatch(updateSignUpModalStatus(false));
      onSuccess()
    } catch (err) {
      messageApi.open({
        type: 'error',
        content: err?.error || 'Something went wrong!',
      });
    }
  };


  const handleSubmit = (values) => {
    handleSignup(values)
  };


  return (
    <>
    <Modal open={true} footer={null} onCancel={onClose}>
      <h2 className="text-2xl font-bold mb-4">Create Free Account</h2>
      <Form
        form={form}
        name="signup_form"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder='User Name *'/>
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email address!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder='Email Address *'/>
        </Form.Item>
        <Form.Item
          name="mobileNumber"
          rules={[
            { required: true, message: 'Please input your mobile number!' },
            { pattern: /^(\+\d{1,3}[- ]?)?\d{10}$/, message: 'Please enter a valid mobile number!' },
          ]}
        >
          <Input placeholder='Mobile Number *'/>
        </Form.Item>
        <Form.Item
          name="password"
          hasFeedback
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters long!' },
            { pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, message: 'Password must contain at least 1 uppercase letter and 1 symbol!' },
          ]}
        >
          <Input.Password
            iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
            placeholder="Password"
          />
        </Form.Item>
        {error && <p className="text-red-500 mb-4 text-[13px]">{error}</p>}
        <Form.Item wrapperCol={{
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 8,
          offset: 8,
        },
      }}>
          <Button htmlType="submit" className="w-full" loading={false}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </Modal>
    {contextHolder}
    </>
  );
};

export default SignUp;
