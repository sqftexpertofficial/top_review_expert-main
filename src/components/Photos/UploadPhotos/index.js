'use client'

import React, { useState } from 'react';
import { Modal, Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { updateSignInModalStatus } from "@/store/authSlice";
import { useAppDispatch } from "@/store";
import { getCookie } from '@/utils';
import { uploadImage, uploadPhotos } from '@/services';

const ImageUploadModal = ({ visible, onClose, id, fetchPics }) => {
    const dispatch = useAppDispatch();
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleSubmit = async (values) => {
        if (fileList.length === 0) {
            message.error('Please upload an image.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', fileList[0].originFileObj)
        let response = await uploadImage(formData)
        if(response.fileUrl){
            await uploadPhotos({
                url : response.fileUrl,
                productCompanyId: id,
                description: values.description || ""
            })
            fetchPics()
            onClose();
            form.resetFields();
            setFileList([]);
            message.success('Form submitted successfully!');
        }
    };

    return (
        <Modal
            title="Upload Image"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Image"
                    rules={[{ required: true, message: 'Please upload an image.' }]}
                >
                    <Upload
                        accept="image/*"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={() => false} // Prevent automatic upload
                    >
                        <Button icon={<UploadOutlined />}>Upload Image</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description.' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const UploadPhotos = ({id, fetchPics}) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        let cookie = getCookie('session')
        if (cookie)
           setVisible(true);
        else
          dispatch(updateSignInModalStatus(true))
      
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <div className='flex justify-end'>
            <Button type="primary" onClick={showModal}>
                Add image
            </Button>
            <ImageUploadModal visible={visible} onClose={handleClose} id={id} fetchPics={fetchPics}/>
        </div>
    );
};

export default UploadPhotos;