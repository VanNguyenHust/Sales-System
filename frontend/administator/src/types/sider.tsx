import {
  HomeOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { MenuProps } from "antd";

export type MenuConfig = Required<MenuProps>["items"][number] & {
  children?: MenuConfig[];
};

export const menuItems: MenuConfig[] = [
  { key: "/dashboard", label: "Trang chủ", icon: <HomeOutlined /> },
  {
    key: "/stores",
    label: "Danh sách cửa hàng",
    icon: <AppstoreAddOutlined />,
  },
];

export function getMenuKeys(
  pathname: string,
  menuItems: MenuConfig[]
): { selectedKey: string; openKeys: string[] } {
  let selectedKey: string = "/dashboard";
  let openKeys: string[] = [];

  const pathSegments: string[] = pathname.split("/").filter(Boolean);
  const rootPath: string = pathSegments.length > 0 ? `/${pathSegments[0]}` : "";

  for (const item of menuItems) {
    if (item.key === pathname) {
      selectedKey = item.key || selectedKey;
      if (rootPath && rootPath !== item.key) {
        openKeys = [rootPath];
      }
      break;
    } else if (item.key && pathname.startsWith(item.key as string)) {
      selectedKey = item.key.toString();
      if (item.children && Array.isArray(item.children)) {
        for (const child of item.children) {
          if (
            child.key &&
            (pathname === child.key || pathname.startsWith(child.key as string))
          ) {
            selectedKey = child.key.toString();
            openKeys = [item.key.toString()];
            break;
          }
        }
      }
      if (!openKeys.length && rootPath === item.key) {
        openKeys = [rootPath];
      }
    }
  }

  return { selectedKey, openKeys };
}
