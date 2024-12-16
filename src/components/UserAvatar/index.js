import { getInitials, getAvatarColor } from "@/utils";
import { Avatar} from "antd";

const UserAvatar = ({ username }) => {
  return (
    <Avatar
      style={{
        backgroundColor: getAvatarColor(username),
        verticalAlign: "middle",
      }}
      size={40}
    >
      {getInitials(username)}
    </Avatar>
  );
};

export default UserAvatar;
