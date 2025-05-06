import { TableColumnsType } from "antd";

export type FilterStoresRequest = {
  query?: string;
  status?: number;
  province?: string;
  page?: number;
  limit?: number;
};

export type StoreResponse = {
  id: string;
  name: string;
  province: string;
  email: string;
  phoneNumber: string;
  status: number;
  storeOwner: string;
  maxProduct: number;
  maxLocation: number;
  maxUser: number;
  createdOn: string;
  startDate: string;
  endDate: string;
};

export type StoresResponse = {
  count: number;
  stores: StoreResponse[];
};

export type StoreStatus = "Chưa kích hoạt" | "Đang hoạt động" | "Đã hết hạn";

export const StoreStatusKey: Record<number, StoreStatus> = {
  0: "Chưa kích hoạt",
  1: "Đang hoạt động",
  2: "Đã hết hạn",
};

export const columnsStore: TableColumnsType<StoreResponse> = [
  {
    title: "Mã cửa hàng",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên cửa hàng",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tỉnh thành",
    dataIndex: "province",
    key: "province",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Chủ cửa hàng",
    dataIndex: "storeOwner",
    key: "storeOwner",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: number) => {
      return StoreStatusKey[status] || "Chưa kích hoạt";
    },
  },
];
