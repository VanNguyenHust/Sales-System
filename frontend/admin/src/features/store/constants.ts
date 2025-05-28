import { Permission } from "@/constants";
import { PermissionColumnGroup } from "./type";

export const defaultColumnsPermission: PermissionColumnGroup[] = [
  {
    groupName: "Đơn hàng",
    value: "orders",
    index: 1,
    open: false,
    help: false,
    columns: [
      {
        label: "Xem tất cả đơn hàng",
        key: "read_orders",
        selected: false,
        in_role: false,
      },
      {
        label: "Cập nhật đơn hàng",
        key: "update_orders",
        selected: false,
        in_role: false,
      },
      {
        label: "Xóa đơn hàng",
        key: "delete_orders",
        selected: false,
        in_role: false,
      },
      {
        label: "Tạo đơn hàng",
        key: "create_orders",
        selected: false,
        in_role: false,
      },
    ],
  },
  {
    groupName: "Sản phẩm",
    value: "products",
    index: 2,
    open: false,
    help: true,
    columns: [
      {
        label: "Xem sản phẩm",
        key: "read_products",
        selected: false,
        in_role: false,
      },
      {
        label: "Sửa sản phẩm",
        key: "update_products",
        selected: false,
        in_role: false,
      },
      {
        label: "Tạo sản phẩm",
        key: "create_products",
        selected: false,
        in_role: false,
        permissionRequired: ["read_products"],
      },
      {
        label: "Xóa sản phẩm",
        key: "delete_products",
        selected: false,
        in_role: false,
        permissionRequired: ["read_products"],
      },
    ],
  },
  {
    groupName: "Khách hàng",
    value: "customers",
    index: 1,
    open: false,
    help: true,
    columns: [
      {
        label: "Xem khách hàng",
        key: "read_customers",
        selected: false,
        in_role: false,
      },
      {
        label: "Tạo khách hàng",
        key: "create_customers",
        selected: false,
        in_role: false,
      },
      {
        label: "Sửa khách hàng",
        key: "update_customers",
        selected: false,
        in_role: false,
      },
      {
        label: "Xóa khách hàng",
        key: "delete_customers",
        selected: false,
        in_role: false,
      },
    ],
  },
  {
    groupName: "Cấu hình",
    value: "settings",
    index: 2,
    open: false,
    help: true,
    columns: [
      {
        label: "Cấu hình chung",
        key: "store_settings",
        selected: false,
        in_role: false,
      },
      {
        label: "Cấu hình chi nhánh",
        key: "location_settings",
        selected: false,
        in_role: false,
      },
      {
        label: "Cấu hình nhân viên",
        key: "user_settings",
        selected: false,
        in_role: false,
      },
    ],
  },
];

export enum UserType {
  REGULAR = "regular",
  COLLABORATOR = "collaborator",
  REQUESTED = "requested",
}

export const indexsColumnsOrder: Permission[] = [
  "read_orders",
  "create_orders",
  "update_orders",
  "delete_orders",
];
