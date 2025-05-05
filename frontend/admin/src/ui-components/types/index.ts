export interface Action {
  /** id của action */
  id?: string;
  /** url của action */
  url?: string;
  /** Buộc mở link trong tab mới */
  external?: boolean;
  /** Action icon */
  icon?: IconSource;
  /** Nội dung của action */
  content?: string;
  /** Callback của action */
  onAction?(): void;
}

export interface LoadableAction extends Action {
  /** Action có đang loading */
  loading?: boolean;
}

export interface DisableableAction extends Action {
  /** Disable action */
  disabled?: boolean;
}

export interface DestructableAction extends Action {
  /** Destructive action */
  destructive?: boolean;
}
export interface ComplexAction extends DisableableAction, DestructableAction, LoadableAction {}

export interface ActionListItemDescriptor extends DisableableAction, DestructableAction {
  /** Nhãn hỗ trợ của hành động */
  accessibilityLabel?: string;
  /** Dòng mô tả của hành động */
  helpText?: React.ReactNode;
  /** Icon của hành động */
  icon?: IconSource;
  /** Phần từ đứng trước tên hành động */
  prefix?: React.ReactNode;
  /** Phần từ đứng sau tên hành động */
  suffix?: React.ReactNode;
  /** Thêm ellipsis vào tên hành động */
  ellipsis?: boolean;
  /** Hành động đang active */
  active?: boolean;
  /** role của hành động */
  role?: string;
  /** truncate nội dung */
  truncate?: boolean;
}

export interface ActionListSection {
  /** Tiêu để của nhóm hành động */
  title?: string;
  /** Danh sách các hành động */
  items: ActionListItemDescriptor[];
}

export type Error = string | React.ReactElement | (string | React.ReactElement)[];

export type PreferredPosition = "above" | "below" | "mostSpace";

export type PreferredAlignment = "left" | "center" | "right";

export interface ConnectedDisclosure {
  /** Nhãn ẩn cho nhóm hành động */
  accessibilityLabel?: string;
  /** Nhóm hành động bị vô hiệu hóa */
  disabled?: boolean;
  /** Danh sách hành động */
  actions: ActionListItemDescriptor[];
}

export interface ContextualSaveBarAction {
  /** id của action */
  id?: string;
  /** url của action */
  url?: string;
  /** Action có đang loading */
  loading?: boolean;
  /** Disable action */
  disabled?: boolean;
  /** Nội dung của action */
  content?: string;
  /** Callback của action */
  onAction?: () => void;
}

export interface ContextualSaveBarDiscardAction extends ContextualSaveBarAction {
  /** Có show confirm modal khi hủy */
  discardConfirmationModal?: boolean;
}

export interface MenuActionDescriptor extends ComplexAction {}

export interface MenuGroupDescriptor {
  /** Tiêu đề của menu group */
  title: string;
  /** Danh sách action */
  actions: ActionListItemDescriptor[];
  /** Action icon */
  icon?: any;
  /** Disable action */
  disabled?: boolean;
  /** Callback khi bất kì hành động nào diễn ra */
  onActionAnyItem?(): void;
  /** Gọi khi menu được click */
  onClick?(openActions: () => void): void;
}

export interface OptionDescriptor {
  /** Value của option */
  value: string;
  /** Label của option */
  label: React.ReactNode;
  /** Đánh dấu option là disabled */
  disabled?: boolean;
}

export interface SectionDescriptor {
  /** Một list option bên trong 1 section */
  options: OptionDescriptor[];
  /** Tiêu đề của section */
  title?: string;
}

export type IconSource = React.FunctionComponent<React.SVGProps<SVGSVGElement>> | "placeholder" | string;

export interface LinkLikeComponentProps extends React.HTMLProps<HTMLAnchorElement> {
  /** Url tới link */
  url: string;
  /**	Nội dung trong link */
  children?: React.ReactNode;
  /** Đánh dấu external link, mở new tab */
  external?: boolean;
  /**
   * Thuộc tính download của link. Sử dụng string nếu muốn override filename.
   *
   * Lưu ý thuộc tính này chỉ work với same-origin policy, {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attributes Chi tiết}
   */
  download?: boolean | string;
  [key: string]: any;
}

export type LinkLikeComponent = React.ComponentType<LinkLikeComponentProps>;
