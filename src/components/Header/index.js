"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import SignIn from "../SignIn";
import SignUp from "../Signup";
import { getUserData, getCategoryList } from "@/services";
import { Button, Skeleton, Dropdown, Drawer } from "antd";
import {
  MenuOutlined,
  ArrowRightOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import { getCookie, removeCookie } from "@/utils";
import {
  setAuthState,
  updateSignInModalStatus,
  updateSignUpModalStatus,
  setLoading,
  setBusiness,
} from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import AvatarWithMenu from "../AvatarMenu";

const Header = ({ isBusiness = false }) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategory] = useState([
    { key: "1", label: <div>All</div> },
  ]);
  const dispatch = useAppDispatch();
  const authData = useAppSelector((state) => state.auth);
  const { userData, isSignInModalOpen, isSignUpModalOpen, loading, business } =
    authData;

  const fetchUserData = async () => {
    dispatch(setLoading(true));
    try {
      const res = await getUserData();
      dispatch(setAuthState(res?.dataValues));
      if (res.business) {
        dispatch(setBusiness(res?.business));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const cookie = getCookie("session");
    if (cookie) {
      fetchUserData();
    } else {
      dispatch(setLoading(false));
    }
  }, [isSignInModalOpen]);

  const fetchCategoriesData = async () => {
    const dataList = await getCategoryList();
    const updateCategories =
      dataList?.map((item, index) => ({
        key: String(index + 1),
        label: (
          <a
            target="_self"
            rel="noopener noreferrer"
            href={`/product-list?category=${item.id}`}
          >
            {item.name}
          </a>
        ),
      })) || [];

    updateCategories.unshift({
      key: "0",
      label: (
        <a target="_self" rel="noopener noreferrer" href={`/product-list`}>
          All
        </a>
      ),
    });
    setCategory(updateCategories);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const onLogout = () => {
    removeCookie("session");
    dispatch(setAuthState(null));
  };

  const onSuccessLogin = () => {
    dispatch(updateSignInModalStatus(false));
  };

  const onSuccessSignup = () => {
    dispatch(updateSignUpModalStatus(false));
  };

  return (
    <header className="border-b p-4 flex justify-between items-center bg-white shadow-md">
      {/* Left Section: Logo and Mobile Menu Icon */}
      <div className="md:hidden cursor-pointer" onClick={() => setOpen(true)}>
        <MenuOutlined className="text-2xl text-gray-700" />
      </div>
      <div className="flex items-center w-full ">
        <div className="flex items-center">
          <Link href="/" className="text-lg font-bold mr-4">
            <img
              src={!isBusiness ? "/logo.png" : "/business-logo.png"}
              alt="logo-icon"
              className="h-[55px] max-sm:h-[45px]"
            />
          </Link>
          {!isBusiness && (
            <p className="text-sm max-sm:hidden">
              <Dropdown menu={{ items: categories }} placement="bottomLeft" arrow>
                <Button className="bg-gray-200 hover:bg-gray-300 transition-colors">
                  Browse Categories
                </Button>
              </Dropdown>
              {userData?.isAdmin && (
                <Link href="/admin/manage-users">
                  <Button className="ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                    Dashboard
                  </Button>
                </Link>
              )}
              {business?.length > 0 && (
                <Link href="/business/home">
                  <Button
                    type="primary"
                    className="ml-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Business
                  </Button>
                </Link>
              )}
            </p>
          )}
        </div>

        {/* Right Section: Sign In/Sign Up and Loading */}
        {isSignInModalOpen ? (
          <SignIn
            onSuccess={onSuccessLogin}
            onClose={() => dispatch(updateSignInModalStatus(false))}
          />
        ) : null}
        {isSignUpModalOpen ? (
          <SignUp
            onSuccess={onSuccessSignup}
            onClose={() => dispatch(updateSignUpModalStatus(false))}
            popupType="signUp"
          />
        ) : null}
        <div className="flex ml-auto items-center align-center">
          {loading ? (
            <Skeleton.Input active={loading} className="w-24" />
          ) : !!userData ? (
            <>
              <AvatarWithMenu
                username={userData.username}
                onLogout={onLogout}
              />
            </>
          ) : (
            <div className="flex items-center max-sm:flex-row max-sm:justify-between">
              {/* Always show the Brand Signup button */}
              <Link href="/brand-signup" className="hidden md:block">
                <Button
                  type="primary"
                  className="mx-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  Brand Signup
                </Button>
              </Link>

              <button
                className="mr-4 cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => dispatch(updateSignInModalStatus(true))}
              >
                Sign in
              </button>
              <button
                className="md:mr-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                onClick={() => dispatch(updateSignUpModalStatus(true))}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
      {open && (
        <Drawer
          title={
            <div className="flex justify-between">
              <span>Search</span>
              <ArrowRightOutlined />
            </div>
          }
          placement={"left"}
          closable={false}
          onClose={onClose}
          open={open}
          bodyStyle={{ display: "flex", flexDirection: "column", gap: "10px" }}
          width="70%"
        >
          <a
            href="/"
            className="flex gap-[6px] text-gray-600 hover:text-gray-800"
          >
            <DoubleRightOutlined />
            Home
          </a>
          <a
            href="/product-list"
            className="flex gap-[6px] text-gray-600 hover:text-gray-800"
          >
            <DoubleRightOutlined />
            Categories
          </a>
          <hr />
          <a
            href="/brand-signup"
            className="flex gap-[6px] text-gray-600 hover:text-gray-800"
          >
            Brand Signup
          </a>
        </Drawer>
      )}
    </header>
  );
};

export default Header;
