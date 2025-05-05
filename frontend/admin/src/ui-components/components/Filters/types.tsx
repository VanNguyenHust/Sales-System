export interface FilterInterface {
  /** Định danh của filter */
  key: string;
  /** Tiêu đề của filter */
  label: string;
  /** Markup của filter */
  filter: React.ReactNode;
  /** Filter có shortcut (Hiển thị ra bên ngoài) */
  shortcut?: boolean;
  /** Action dùng để submit trạng thái temporary của filter ở chế độ shortcut */
  submitAction?: FilterSubmitAction;
  /** Vô hiệu hoá filter */
  disabled?: boolean;
  /** Ẩn button xoá giá trị của filter **/
  hideClearButton?: boolean;
  /** Danh sách giá trị được hiển thị dưới dạng danh sách tag. Set giá trị sẽ thay thế `AppliedFilterInterface["label"]` khi hiển thị */
  labelValues?: FilterLabelValueInterface[];
  /** Cuộn các item sau chỉ số cho trước (1-based index) */
  labelValuesRollupAfter?: number;
  /** Callback khi shortcut open */
  onShortcutOpen?: () => void;
}

export interface FilterGroupInterface {
  /** Tiêu đề của group */
  label: string;
  /** Các bộ lọc */
  filters: FilterInterface[];
}

export interface FilterSubmitAction {
  /** Nội dung của action */
  content?: string;
  /** Disable action */
  disabled?: boolean;
  /**
   * Tự động đóng shortcut
   * @default true
   */
  autoCloseShortcut?: boolean;
  /**
   * Callback của action
   * */
  onAction?: () => void;
}

export interface FilterPrimaryAction {
  /** Nội dung của action */
  content?: string;
  /** Disable action */
  disabled?: boolean;
  /**
   * Tự động đóng sheet
   * @default true
   */
  autoCloseSheet?: boolean;
  /**
   * Callback của action
   * */
  onAction?: () => void;
}

export interface FilterLabelValueInterface {
  /** Định danh của giá trị trong filter */
  key: string;
  /** Tiêu đề của giá trị */
  label: string;
  /** Callback khi giá trị bị xóa */
  onRemove: () => void;
}

export interface AppliedFilterInterface {
  /** Định danh của filter */
  key: string;
  /** Tiêu đề của filter */
  label: string;
  /** Callback khi filter bị xóa */
  onRemove(key: string): void;
}
