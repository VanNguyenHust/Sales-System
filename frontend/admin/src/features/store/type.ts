import { Permission } from "@/constants";

export interface PermissionColumn {
  key: Permission;
  label: string;
  labelTooltip?: string;
  selected: boolean;
  in_role: boolean;
  /**
   * danh sách permission sẽ được chọn nếu column này được chọn
   * nếu là mảng thì sẽ chọn element đầu tiên trong mảng nếu không có permission nào trong mảng được chọn
   */
  permissionRequired?: (Permission | Permission[])[];
  /**
   * danh sách permission sẽ bị disable nếu column này không được chọn
   */
  permissionDepend?: Permission[];
  /**
   * nếu 1 trong các dependGroup được chọn thì các permissionDepend sẽ không bị disable nếu column chính bị disable
   */
  dependGroup?: Permission[];
  children?: boolean;
}

export interface PermissionColumnGroup {
  groupName: string;
  value: string;
  index: number;
  columns: PermissionColumn[];
  open: boolean;
  help: boolean;
}

export type MetafieldRules = {
  formatDate?: string;
  formatDateTime?: string;
  min?: string | number;
  max?: string | number;
  maxPrecision?: number;
  listMin?: number;
  listMax?: number;
  regex?: string;
  choices?: string[];
  allowedDomains?: string[];
  fileTypeOptions?: string[];
  schema?: string;
};
