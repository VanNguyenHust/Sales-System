export interface AlphaFilterInterface {
  /** Định danh của filter */
  key: string;
  /** Tiêu đề của filter */
  label: string;
  /** Markup của filter */
  filter: React.ReactNode;
  /** Filter có shortcut (Hiển thị ra bên ngoài) */
  shortcut?: boolean;
  /** Action dùng để submit trạng thái temporary của filter ở chế độ shortcut */
  onSubmit?(key: string): void;
  /** Vô hiệu hoá filter */
  disabled?: boolean;
  /** Ẩn button xoá giá trị của filter **/
  hideClearButton?: boolean;
  /** Action được gọi khi clear button click. Mặc định xóa các giá trị của filter key */
  onClear?(key: string): void;
  /** Danh sách giá trị được hiển thị dưới dạng danh sách tag. Set giá trị sẽ thay thế `AppliedFilterInterface["label"]` khi hiển thị */
  labelValues?: AlphaFilterLabelValueInterface[];
  /** Cuộn các item sau chỉ số cho trước (1-based index) */
  labelValuesRollupAfter?: number;
  /** Callback khi shortcut open */
  onShortcutOpen?: () => void;
}

export interface AlphaFilterGroupInterface {
  /** Tiêu đề của group */
  label: string;
  /** Các bộ lọc */
  filters: AlphaFilterInterface[];
}

export interface AlphaFilterLabelValueInterface {
  /** Định danh của giá trị trong filter */
  key: string;
  /** Tiêu đề của giá trị */
  label: string;
  /** Callback khi giá trị bị xóa */
  onRemove: () => void;
}

export interface AlphaAppliedFilterInterface {
  /** Định danh của filter */
  key: string;
  /** Tiêu đề của filter */
  label: string;
  /** Callback khi filter bị xóa */
  onRemove(key: string): void;
}
