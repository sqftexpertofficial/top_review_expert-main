import React from "react";
import { Result, Button } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import Link from "next/link";

const RegistrationSuccess = ({ onGoBack }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Result
        icon={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
        title="Registration Successful!"
        subTitle="Thank you for registering. Please wait for approval from the admin, which usually takes up to 24 hours."
        extra={[
          <Link href="/" key="home">
            <Button type="primary" onClick={onGoBack}>
              Go Back to Home
            </Button>
          </Link>,
        ]}
      />
    </div>
  );
};

export default RegistrationSuccess;
