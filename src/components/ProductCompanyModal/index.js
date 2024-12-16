import React from "react";
import { Modal, Form, Input, Button, Select } from "antd";

const ProductCompanyModal = ({ visible, onCancel, onSubmit, initialValues, allCategories }) => {
  const [form] = Form.useForm();

  // Set the form values when the modal opens
  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, visible]);

  return (
    <Modal
      title={initialValues ? "Edit Product Company" : "Add Product Company"}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} onFinish={onSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the company name!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="categoryId" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
          <Select placeholder="Select a category">
            {allCategories.map(category => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        
        <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Please input the slug!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="metaTitle" label="Meta Title" rules={[{ required: true, message: 'Please input the meta title!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="metaDescription" label="Meta Description" rules={[{ required: true, message: 'Please input the meta description!' }]}>
          <Input.TextArea />
        </Form.Item>
        
        <Form.Item name="h1Tag" label="H1 Tag" rules={[{ required: true, message: 'Please input the H1 tag!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="h2Tag" label="H2 Tag" rules={[{ required: true, message: 'Please input the H2 tag!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item name="img" label="Image URL" rules={[{ required: true, message: 'Please input the image URL!' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {initialValues ? "Update" : "Add Product Company"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProductCompanyModal;
