"use client"
import React from "react";
import Link from "next/link";
import { useAppSelector } from "@/store";
import { usePathname } from "next/navigation";
import { Layout, Result, Spin } from "antd"; // Added Spin here
import {
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreAddOutlined,
  CloudUploadOutlined,
  ShopOutlined
} from "@ant-design/icons"; // Import your desired icons
import Header from "@/components/Header"

const { Sider, Content } = Layout;

const sideBar = [
  {
    label: "Manage Users",
    route: "/admin/manage-users",
    icon: <UserOutlined />,
  },
  {
    label: "Manage Companies",
    route: "/admin/manage-products",
    icon: <ShoppingCartOutlined />,
  },
  {
    label: "Manage Categories",
    route: "/admin/manage-categories",
    icon: <AppstoreAddOutlined />,
  },
  {
    label: "Upload Images",
    route: "/admin/upload-images",
    icon: <CloudUploadOutlined />,
  },
  {
    label: "Manage Business",
    route: "/admin/manage-business",
    icon: <ShopOutlined />,
  },
];

const AdminLayout = ({ children }) => {
  const pathname = usePathname();
  const authData = useAppSelector((state) => state.auth);
  const { userData, loading } = authData;

  return (
    <div>
      <Header />
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spin size="large" />
        </div>
      ) : !userData?.isAdmin ? (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, you are not authorized to access this page."
        />
      ) : (
        <Layout>
          <Sider
            className="fixed top-0 bottom-0 bg-gray-800 text-white"
            width={250}
          >
            <ul className="space-y-2 px-4 py-4">
              {sideBar.map((item) => (
                <Link href={item.route} key={item.label} className="text-white">
                  <li
                    className={`p-2 my-2 rounded flex items-center ${
                      pathname === item.route
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </li>
                </Link>
              ))}
            </ul>
          </Sider>
          <Layout>
            <Content
              className="p-4 overflow-y-auto"
              style={{
                height: "calc(100vh - 64px)",
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      )}
    </div>
  );
};

export default AdminLayout;
