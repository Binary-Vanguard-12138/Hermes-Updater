import { List } from "react-feather";
import ProfileIcon from "@mui/icons-material/AccountCircleOutlined";

const elementsSection = [
  {
    href: "/admin/user",
    icon: List,
    title: "Users",
  },
  {
    href: "/admin/profile",
    icon: ProfileIcon,
    title: "My Profile",
  },
];

const navItems = [
  {
    title: "Contents",
    pages: elementsSection,
  },
];

export default navItems;
