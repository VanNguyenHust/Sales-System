export interface TabDescriptor {
  /** id của tab */
  id: string;
  /** Đường dẫn cho tab */
  url?: string;
  /** nội dung tab */
  content: React.ReactNode;
  /** Id của panel */
  panelID?: string;
  /** Có thể xóa tab hay không */
  canDelete?: boolean;
}
