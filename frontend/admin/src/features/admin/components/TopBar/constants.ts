import { GlobalSearchType } from "app/types";

export type FilterType = GlobalSearchType | "all";

export const tabs: {
  id: FilterType;
  content: string;
}[] = [
  {
    id: "all",
    content: "Tất cả",
  },
  {
    id: GlobalSearchType.Product,
    content: "Sản phẩm",
  },
  {
    id: GlobalSearchType.Order,
    content: "Đơn hàng",
  },
  {
    id: GlobalSearchType.Customer,
    content: "Khách hàng",
  },
];
