
import { useState } from "react";
import { Form, Input, Rate, Slider, Upload, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { uploadImage } from "@/services";

const ReviewForm = ({ attributes, onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [attributesRatings, setAttributesRatings] = useState({});
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSliderValue = (val, id) => {
    setAttributesRatings((prev) => ({ ...prev, [id]: val }));
  };

  const marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
  };

  const getTrackStyle = (value) => {
    if (value <= 20) return 'red';
    if (value <= 40) return 'orange';
    if (value <= 60) return '#50e3c2';
    if (value <= 80) return 'green';
    return 'green';
  };

  const uploadImagesToServer = async () => {
    const uploadedUrls = [];
    setUploading(true);

    for (const file of fileList) {
      const formData = new FormData();
      formData.append('photo', file.originFileObj);
      try {
        const response = await uploadImage(formData);
        uploadedUrls.push(response.fileUrl);
      } catch (error) {
        message.error('Image upload failed.');
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  const handleFormSubmit = async (formData) => {
    try {
      const uploadedImageUrls = await uploadImagesToServer();
      await onSubmit({ ...formData, attributes: attributesRatings, images: uploadedImageUrls });
    } catch (error) {
      message.error("Failed to submit review.");
    }
  };

  return (
    <Form onFinish={handleFormSubmit} wrapperCol={{ span: 30 }}>
      <Form.Item name="rating" label="Star Rating" rules={[{ required: true, message: "Please input your ratings" }]}>
        <Rate allowHalf onChange={(value) => setRating(value)} />
      </Form.Item>

      <Form.Item name="reviewTitle" rules={[{ required: true, message: "Please input your review title" }]}>
        <Input placeholder="Your review title will attract readers, so be creative" />
      </Form.Item>

      <Form.Item name="reviewComments" rules={[{ required: true, message: "Please give the review!" }]}>
        <Input.TextArea placeholder="Write your review about the product" />
      </Form.Item>

      {attributes?.map(item => (
        <Form.Item label={item.attribute} key={item.id}>
          <Slider
            min={0}
            max={100}
            value={attributesRatings[item.id] || rating * 20}
            onChange={(val) => handleSliderValue(val, item.id)}
            marks={marks}
            style={{
              track: {
                background: getTrackStyle(attributesRatings[item.id] || rating * 20),
              },
            }}
          />
        </Form.Item>
      ))}

      <Form.Item label="Upload Images">
        <Upload listType="picture-card" fileList={fileList} onChange={handleFileChange} multiple>
          {fileList.length >= 8 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      </Form.Item>

      <Form.Item>
        <Button htmlType="submit" className="bg-green-500 text-white px-4 rounded-md mt-3 w-full" loading={isLoading || uploading}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ReviewForm;
