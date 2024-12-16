"use client";

import React, { useState } from "react";
import { Upload, Button, message, List, Typography, Space, Image } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { uploadImage } from "@/services";

const { Dragger } = Upload;

const ImageUploadModule = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [responses, setResponses] = useState([]);

  const handleFileChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 20) {
      message.error("You can upload a maximum of 20 files.");
      return;
    }
    setFileList(newFileList);
  };

  const uploadFile = (file) => {
    return new Promise(async (resolve, reject) => {
      const formData = new FormData();
      formData.append("photo", file.originFileObj);
      formData.append("folderName", "companies");

      try {
        const response = await uploadImage(formData); // Ensure this function handles FormData
        resolve(response.fileUrl); // Adjust based on your API response
      } catch (error) {
        reject(`Upload failed for ${file.name}`);
      }
    });
  };

  const uploadFiles = async () => {
    setUploading(true);
    const uploadedUrls = [];

    for (const file of fileList) {
      try {
        const url = await uploadFile(file);
        uploadedUrls.push(url);
      } catch (error) {
        message.error(error); // Show the error message
      }
    }

    setUploading(false);
    setResponses(uploadedUrls);
    setFileList([]); // Clear file list after upload
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    message.success("URL copied to clipboard!");
  };

  return (
    <>
      <div className="h-[500px]">
        <Dragger
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent automatic upload
          multiple
        >
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </div>

      <Button
        type="primary"
        onClick={uploadFiles}
        loading={uploading}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </Button>

      {responses.length > 0 && (
        <List
          header={<div>Uploaded Image URLs</div>}
          bordered
          dataSource={responses}
          renderItem={(url, index) => (
            <List.Item>
              <Space style={{ width: "100%" }} align="center">
                <Image
                  width={50}
                  src={url}
                  alt={`Uploaded Image ${index + 1}`}
                  style={{ marginRight: 8 }}
                />
                <Typography.Text>{url}</Typography.Text>
                <CopyOutlined
                  onClick={() => handleCopy(url)}
                  style={{ cursor: 'pointer', marginLeft: 8 }}
                />
              </Space>
            </List.Item>
          )}
        />
      )}
      </>
  );
};

export default ImageUploadModule;
