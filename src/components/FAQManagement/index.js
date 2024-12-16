import React, { useState, useEffect } from "react";
import { Drawer, List, Button, Popconfirm, message, Input, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { fetchFAQs, deleteFAQ, updateFAQ, createFAQ } from "@/services";

const FAQManagement = ({ companyId, isBusiness }) => {
  const [faqs, setFaqs] = useState([]);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // State for child drawer visibility (Create FAQ)
  const [isChildDrawerVisible, setIsChildDrawerVisible] = useState(false);

  // Fetch FAQs when companyId changes or the drawer is opened
  useEffect(() => {
    if (companyId ) {
      fetchFAQsForCompany(companyId);
    }
  }, [companyId]);

  const fetchFAQsForCompany = async (companyId) => {
    setLoading(true);
    try {
      const response = await fetchFAQs(companyId, isBusiness, { productCompanyId: companyId });
      setFaqs(response || []);
    } catch (error) {
      message.error("Error fetching FAQs");
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq);
    form.setFieldsValue(faq); // Pre-populate form with FAQ data
    setIsChildDrawerVisible(true); // Open the child drawer for editing
  };

  const handleDeleteFAQ = async (faqId) => {
    try {
      await deleteFAQ(faqId, isBusiness, { productCompanyId: companyId });
      message.success("FAQ deleted successfully!");
      fetchFAQsForCompany(companyId);
    } catch (error) {
      message.error("Error deleting FAQ");
      console.error("Error deleting FAQ:", error);
    }
  };

  const handleSubmit = async (values) => {
    if (editingFAQ) {
      // Updating existing FAQ
      try {
        await updateFAQ(editingFAQ.id, {...values, productCompanyId: companyId }, isBusiness,);
        message.success("FAQ updated successfully!");
        setEditingFAQ(null); // Reset the editingFAQ state after updating
        fetchFAQsForCompany(companyId); // Refresh the list of FAQs
        setIsChildDrawerVisible(false); // Close the child drawer after updating
      } catch (error) {
        message.error("Error updating FAQ");
        console.error("Error updating FAQ:", error);
      }
    } else {
      // Creating new FAQ
      try {
        await createFAQ({ ...values, productCompanyId: companyId }, isBusiness);
        message.success("FAQ created successfully!");
        fetchFAQsForCompany(companyId); // Refresh FAQs after creation
        setIsChildDrawerVisible(false); // Close the child drawer
      } catch (error) {
        message.error("Error creating FAQ");
        console.error("Error creating FAQ:", error);
      }
    }
  };

  const handleCreateNewFAQ = () => {
    setEditingFAQ(null); // Ensure we're in "create mode"
    form.resetFields(); // Reset form fields
    setIsChildDrawerVisible(true); // Open the child drawer for creating a new FAQ
  };

  return (
    <>
      <div className="my-4">
        {/* Button to create new FAQ */}
        <div className="flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateNewFAQ}
          className="mb-4"
        >
          Create FAQ
        </Button>
        </div>

        {/* List of FAQs */}
        <List
          loading={loading}
          className="border !pl-2"
          dataSource={faqs}
          renderItem={(faq) => (
            <List.Item
              actions={[
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditFAQ(faq)} // Edit action
                  type="link"
                >
                  Edit
                </Button>,
                <Popconfirm
                  title="Are you sure to delete this FAQ?"
                  onConfirm={() => handleDeleteFAQ(faq.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button icon={<DeleteOutlined />} type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                title={faq.question}
                description={faq.answer}
              />
            </List.Item>
          )}
        />
      </div>

      {/* Child Drawer for creating/editing FAQ */}
      <Drawer
        title={editingFAQ ? "Edit FAQ" : "Create FAQ"}
        open={isChildDrawerVisible}
        onClose={() => setIsChildDrawerVisible(false)}
        width={400}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} className="mt-4">
          <Form.Item
            name="question"
            label="Question"
            rules={[{ required: true, message: "Please input the question!" }]}
          >
            <Input placeholder="Enter FAQ question" />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Answer"
            rules={[{ required: true, message: "Please input the answer!" }]}
          >
            <Input.TextArea placeholder="Enter FAQ answer" rows={4} />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            {editingFAQ ? "Save Changes" : "Create FAQ"}
          </Button>
          <Button
            className="ml-2"
            onClick={() => {
              setEditingFAQ(null);
              form.resetFields();
              setIsChildDrawerVisible(false); // Close the child drawer
            }}
            type="default"
          >
            Cancel
          </Button>
        </Form>
      </Drawer>
      </>
  );
};

export default FAQManagement;
