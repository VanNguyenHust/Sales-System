import { AiSuggestionsContext } from "app/types";

export const WritingStyleOptions = [
  "Chuyên nghiệp",
  "Vui vẻ",
  "Hài hước",
  "Trang trọng",
  "Thân thiện",
  "Bình thường",
  "Tự tin",
  "Học thuật",
  "Đơn giản hóa",
  "Sống động",
  "Đồng cảm",
  "Sang trọng",
  "Lôi cuốn",
  "Thẳng thắn",
  "Thuyết phục",
];

type PopoverSuggestionType = {
  /** Tiêu đề của popover */
  title?: string;
  /** Label của input */
  label?: string;
  /** Placeholder của input */
  placeholder?: string;
  /** Label của phần yêu cầu khác */
  otherReqLabel?: string;
  /** Placeholder của phần yêu cầu khác */
  otherReqPlaceholder?: string;
  /** Label của button Tạo nội dung */
  buttonLabel?: string;
  /** Độ dài tối đa của input gợi ý */
  maxLength?: number;
};

export const suggestPropertiesMap: Record<AiSuggestionsContext, PopoverSuggestionType | undefined> = {
  page: {
    title: "Tạo nội dung trang",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về trang",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung trang",
    maxLength: 8000,
  },
  article: {
    title: "Tạo nội dung bài viết",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về bài viết",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung bài viết",
    maxLength: 8000,
  },
  blog: undefined,
  product: {
    title: "Tạo nội dung sản phẩm",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về sản phẩm",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung sản phẩm",
    maxLength: 8000,
  },
};

export const rewritePropertiesMap: Record<AiSuggestionsContext, PopoverSuggestionType | undefined> = {
  page: {
    title: "Tạo nội dung trang",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về trang",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung trang",
    maxLength: 8000,
  },
  blog: undefined,
  article: {
    title: "Tạo nội dung bài viết",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về bài viết",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung bài viết",
    maxLength: 8000,
  },
  product: {
    title: "Tạo nội dung sản phẩm",
    label: "Mô tả",
    placeholder: "Nhập mô tả ngắn về sản phẩm",
    otherReqLabel: "Yêu cầu khác (khách hàng mục tiêu,...)",
    otherReqPlaceholder: "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi",
    buttonLabel: "Tạo nội dung sản phẩm",
    maxLength: 8000,
  },
};
