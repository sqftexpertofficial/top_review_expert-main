import { Dropdown, Menu } from "antd";
import Link from "next/link";
import UserAvatar from "../UserAvatar";

const AvatarWithMenu = ({ username, onLogout }) => {
  const menu = (
    <Menu className="w-[10rem]">
      <Menu.Item key="username" className="!font-bold">
        <Link href="/profile">{username}</Link>
      </Menu.Item>
      <hr />
      <Menu.Item key="logout">
        <span className="ml-2" onClick={onLogout}>
          Logout
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <div className="cursor-pointer">
        <UserAvatar username={username} />
      </div>
    </Dropdown>
  );
};

export default AvatarWithMenu;
