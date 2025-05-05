export interface Logo {
  /** Đường dẫn tới ảnh logo */
  source?: string;
  /** Địa chỉ điều hướng khi click vào logo */
  url?: string;
  /** Nhãn hỗ trợ */
  accessibilityLabel?: string;
  /** Chiều rộng của ảnh */
  width?: number;
}

export interface NavigationCollapseAction {
  /** Có đang collapse */
  collapsed: boolean;
  /** Callback khi click */
  onToggle(): void;
}
