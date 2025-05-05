import { LinkType } from "app/features/website/types";

export const TypeMenuOptions = [
  {
    label: "Trang chủ",
    value: LinkType.HOME,
  },
  {
    label: "Danh mục sản phẩm",
    value: LinkType.COLLECTION,
  },
  {
    label: "Sản phẩm",
    value: LinkType.PRODUCT,
  },
  {
    label: "Tất cả sản phẩm",
    value: LinkType.ALL_PRODUCT,
  },
  {
    label: "Trang nội dung",
    value: LinkType.PAGE,
  },
  {
    label: "Danh mục bài viết",
    value: LinkType.BLOG,
  },
  {
    label: "Trang tìm kiếm",
    value: LinkType.SEARCH,
  },
  {
    label: "Địa chỉ web",
    value: LinkType.HTTP,
  },
];

export const MAX_DEPTH_LINK = 4;
export const MIN_ID_BTN_ADD = -999999999;
