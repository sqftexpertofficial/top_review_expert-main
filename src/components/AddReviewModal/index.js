import { Modal, Button, Rate, Form, Input, Slider, Upload } from "antd";
import {useState} from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { uploadImage } from "@/services";

export const AddReviewModal = ({
  openReview,
  handleReviewOpen,
  handleSubmit,
  isSaveReviewLoading,
  attributes=[]
}) => {
  const [rating, setRating] = useState(0);
  const [attributesRatings, setAttributesRatings] = useState({});
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  const handleSliderValue = (val, id) => {
    const attributes = {...attributesRatings, [id]:val}
    setAttributesRatings(attributes)
  }
  const marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100'
  };
  const getTrackStyle = (value) => {
    if (value <= 20) return 'red'
    if (value <= 40) return  'orange'
    if (value <= 60) return '#50e3c2'
    if (value <= 80) return 'green'
    return 'green'
  };


  // Handle image upload to API
  const uploadImagesToServer = async () => {
    const uploadedUrls = [];
    setUploading(true);

    for (const file of fileList) {
      const formData = new FormData();
      formData.append('photo', file.originFileObj); // 'file' field is important for API
      try {
        const response = await uploadImage(formData);
        uploadedUrls.push(response.fileUrl); // Assuming response contains the URL
      } catch (error) {
        message.error('Image upload failed.');
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    try {
      const uploadedImageUrls = await uploadImagesToServer();
      handleSubmit({ ...formData, attributes: attributesRatings, images: uploadedImageUrls });
    } catch (error) {
      message.error("Failed to submit review.");
    }
  };




  return (
    <Modal
      title="Add Review"
      open={openReview}
      onCancel={handleReviewOpen}
      footer={[]}
    >
      <Form
        onFinish={(obj)=>handleFormSubmit(obj)}
        initialValues={{
          remember: false,
        }}
        wrapperCol={{
          span: 16,
        }}
      >
        <Form.Item
          name="rating"
          label="Star Rating"
          rules={[{ required: true, message: "Please input your ratings" }]}
        >
          <Rate allowHalf onChange={(value)=>setRating(value)}/>
        </Form.Item>

        <Form.Item
          name="reviewTitle"
          rules={[
            { required: true, message: "Please input your review title" },
          ]}
          wrapperCol={{
            span: 24,
          }}
        >
          <Input placeholder="Your reivew title will attract readers, so be creative" />
        </Form.Item>

        <Form.Item
          name="reviewComments"
          rules={[{ required: true, message: "Please give the review!" }]}
          wrapperCol={{
            span: 24,
          }}
        >
          <Input.TextArea placeholder="Write your review about the product" />
        </Form.Item>

        {attributes.map(item=>
          <Form.Item
          label={item.attribute}
          wrapperCol={{
            span: 30,
          }}
        >
          <Slider
          className="mr-8 ml-5"
          min={0}
          max={100}
          value={attributesRatings[item.id] ? attributesRatings[item.id]: rating*20}
          onChange={(val)=> handleSliderValue(val,item.id)}
          styles={{
            track: {
              background: getTrackStyle(attributesRatings[item.id] ? attributesRatings[item.id]: rating*20),
            },
          }}
          marks={marks}
        />
        </Form.Item>
        )}


        {/* Image Upload Section */}
        <Form.Item
          label="Upload Images"
          wrapperCol={{
            span: 24,
          }}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleFileChange}
            multiple
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        

        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: 8,
              offset: 8,
            },
          }}
        >
          <Button
            htmlType="submit"
            className="bg-green-500 text-white px-4 rounded-md mt-3 w-full"
            loading={isSaveReviewLoading || uploading}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
