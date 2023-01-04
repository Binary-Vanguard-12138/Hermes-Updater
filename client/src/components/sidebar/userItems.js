import { List } from "react-feather";
import ProfileIcon from "@mui/icons-material/AccountCircleOutlined";

const elementsSection = [
  {
    href: "/user/product",
    icon: List,
    title: "Product Updates",
  },
  {
    href: "/user/profile",
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
