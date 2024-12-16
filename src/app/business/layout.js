"use client";
import React, { useEffect, useState } from "react";
import { Layout, Menu, Dropdown, Space, Avatar, Alert, Result } from "antd";
import { usePathname } from "next/navigation";
import {
  UserOutlined,
  DashboardOutlined,
  SettingOutlined,
  DownOutlined,
  StarFilled,
  QuestionCircleOutlined
} from "@ant-design/icons";
import Link from "next/link";
import Header from "@/components/Header";
import { useAppSelector, useAppDispatch } from "@/store";
import { setSelectedBusiness } from "@/store/authSlice";
import { checkTrialPeriod } from "@/utils";

const { Sider, Content } = Layout;

const BusinessLayout = ({ children }) => {
  const pathname = usePathname();
  const businessData = useAppSelector((state) => state.auth.business);
  const selectedBusiness = useAppSelector(
    (state) => state.auth.selectedBusiness
  );
  const dispatch = useAppDispatch();

  const [accountType, setAccountType] = useState("premium");
  const [alertVisible, setAlertVisible] = useState(true);
  const [isTrialEnded, setIsTrialEnded] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);

  const menuItems = [
    {
      label: <Link href="/business/home">Dashboard</Link>,
      key: "/business/home",
      icon: <DashboardOutlined className="text-white" />,
    },
    {
      label: <Link href="/business/feedback">Feedback</Link>,
      key: "/business/feedback",
      icon: <UserOutlined className="text-white" />,
    },
    {
      label: <Link href="/business/manage-faq">Manage FAQ</Link>,
      key: "/business/manage-faq",
      icon: <QuestionCircleOutlined className="text-white" />
    },
    // {
    //   label: <Link href="/business/settings">Settings</Link>,
    //   key: "/business/settings",
    //   icon: <SettingOutlined className="text-white" />,
    // },
  ];

  useEffect(() => {
    if (businessData.length > 0) {
      dispatch(setSelectedBusiness(businessData[0]));
    }
  }, [businessData, dispatch]);

  useEffect(() => {
    if (selectedBusiness?.productCompanyId) {
      const res = checkTrialPeriod(selectedBusiness.approvedDate);
      if (res === false) {
        setIsTrialEnded(true); // Trial ended
        setTrialDaysLeft(null);
      } else {
        setIsTrialEnded(false); // Trial ongoing
        setTrialDaysLeft(res); // Days remaining
      }
    }
  }, [selectedBusiness]);

  const handleBusinessChange = (business) => {
    dispatch(setSelectedBusiness(business));
    setAccountType(business.accountType);
  };

  const businessMenu = (
    <Menu>
      {businessData.map((business) => (
        <Menu.Item
          key={business?.productCompany?.id}
          onClick={() => handleBusinessChange(business)}
        >
          <Space>
            <Avatar
              src={business?.productCompany?.img}
              shape="square"
              className="!object-cover"
            />
            {business?.productCompany?.name}
          </Space>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout className="!overflow-hidden">
      <Header isBusiness={true} />
      <Layout>
        <Sider width={250} className="bg-gray-800 fixed top-0 bottom-0">
          <div className="py-4 px-2 text-white bg-gray-700 flex items-center">
            <Dropdown overlay={businessMenu} trigger={["click"]}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                <Space>
                  <Avatar
                    src={
                      businessData?.find(
                        (b) =>
                          b?.productCompany?.name ===
                          selectedBusiness?.productCompany?.name
                      )?.productCompany?.img
                    }
                    size={"large"}
                    shape="square"
                    className="!object-fill"
                  />
                  <div className="w-20 overflow-hidden whitespace-nowrap text-ellipsis">
                    <span className="ml-1">
                      {selectedBusiness?.productCompany?.name}
                    </span>
                  </div>
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: "100%", borderRight: 0 }}
            className="text-white"
          >
            {menuItems.map((item) => (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                className={`${pathname === item.key ? "bg-gray-700" : ""}`}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu>
          <div className="flex items-center justify-between p-4 bg-gray-700 mt-auto">
            <span className="text-white">Premium</span>
            <SettingOutlined className="text-white" />
          </div>
        </Sider>
        <Layout style={{ padding: "1px" }}>
          <Content
            className="overflow-y-auto"
            style={{
              background: "#fff",
              margin: 0,
              height: "87vh",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="p-4">
              {isTrialEnded ? (
                <Result
                  status="warning"
                  title="Your trial period has ended"
                  subTitle="Please contact support to continue using your account."
                  extra={
                    <Link href="/contact-support">
                      <button>Subscribe</button>
                    </Link>
                  }
                />
              ) : (
                <>
                  {!isTrialEnded && alertVisible && trialDaysLeft !== null && (
                    <Alert
                      message={`Your trial period ends in ${trialDaysLeft} day(s). Please subscribe to use our services`}
                      type="info"
                      showIcon={true}
                      className="!mb-4"
                      style={{
                        width: "-webkit-fill-available",
                      }}
                      closable
                      onClose={() => setAlertVisible(false)} // Close alert
                    />
                  )}
                  {children}
                </>
              )}
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default BusinessLayout;
