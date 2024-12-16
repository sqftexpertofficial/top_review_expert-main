import Header from "@/components/Header";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import ProfileName from "../../components/ProfileName";

const ProfileLayout = ({ children }) => {

  return (
    <div>
      <Header />
      <div className="bg-[lightgrey] h-[8rem] relative">
        <div className="absolute bottom-[-46px] left-[180px]">
          <Avatar size={110} icon={<UserOutlined />} />
        </div>
      </div>
      <div className=" mt-20 w-[70%] my-0 mx-auto p-6 border-[#e5e5e5] h-[100%]">
        <ProfileName/>
        <div className="flex justify-between flex-wrap mt-4">
          <div className="p-2 border-[#e5e5e5] border w-[30%]">
          <div className="border-solid border-0 border-b border-[#e5e5e5] p-2 text-sm">
              <Link href="/profile">Profile</Link>
            </div>
            <div className="border-solid border-0 border-b border-[#e5e5e5] p-2 text-sm">
              <Link href="/profile/timeline">Timeline</Link>
            </div>
            <div className="border-solid border-0 border-b border-[#e5e5e5] p-2 text-sm">
              <Link href="/profile/reviews">Reviews</Link>
            </div>
            <div className="border-solid border-0 border-b border-[#e5e5e5] p-2 text-sm">
              <Link href="/profile/following">Following</Link>
            </div>
            <div className="border-solid border-0 p-2 text-sm">
              <Link href="/profile/changepassword">Change Password</Link>
            </div>
          </div>
          <div className="p-2 border-[#e5e5e5] border w-[69%]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
