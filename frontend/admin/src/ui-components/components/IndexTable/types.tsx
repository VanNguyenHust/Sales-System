import React from "react";

import { ActionListSection, DisableableAction, MenuGroupDescriptor } from "../../types";
import { TooltipProps } from "../Tooltip";

export const SCROLL_BAR_PADDING = 4;
export const SCROLL_BAR_DEBOUNCE_PERIOD = 300;

export type Range = [number, number];

export enum SelectionType {
  All = "all",
  Page = "page",
  Multi = "multi",
  Single = "single",
}

export interface IndexProviderProps {
  children?: React.ReactNode;
  /**
   * Các item trong IndexTable có thể chọn
   * @default true
   * */
  selectable?: boolean;
  /** Số item trong IndexTable */
  itemCount: number;
  /** Số item đang được chọn trong IndexTable */
  selectedItemsCount?: number | "All";
  /** Tên tài nguyên đang dùng trong IndexTable (dùng cho i18n) */
  resourceName?: {
    singular: string;
    plural: string;
  };
  /** Trạng thái loading của IndexTable */
  loading?: boolean;
  /** IndexTable có thể có nhiều item hơn */
  hasMoreItems?: boolean;
  /** Trạng thái biểu diễn cô đọng IndexTable */
  condensed?: boolean;
  /** Callback khi thay đổi lựa chọn item */
  onSelectionChange?(selectionType: SelectionType, toggleType: boolean, selection?: string | Range): void;
}

type NonEmptyArray<T> = [T, ...T[]];

interface IndexTableHeadingBase {
  /** Căn chỉnh vị trí của heading theo chiều ngang */
  alignment?: "start" | "center" | "end";
  /** Bỏ padding mặc định */
  flush?: boolean;
  /** Ẩn heading */
  hidden?: boolean;
  /** Tooltip của heading */
  tooltipContent?: React.ReactNode;
  /** Chiều rộng tooltip của heading */
  tooltipWidth?: TooltipProps["width"];
  /** Không tự động ẩn tooltip khi click heading */
  tooltipPersistsOnClick?: boolean;
}

interface IndexTableHeadingTitleNode extends IndexTableHeadingBase {
  /** Tiêu đề của heading */
  title: React.ReactNode;
  /** Id của heading */
  id: string;
}

interface IndexTableHeadingTitleString extends IndexTableHeadingBase {
  /** Tiêu đề của heading */
  title: string;
}

export type IndexTableHeading = IndexTableHeadingTitleString | IndexTableHeadingTitleNode;

export type IndexTableSortDirection = "ascending" | "descending";
type IndexTableSortToggleLabel = {
  [key in IndexTableSortDirection]: string;
};
interface IndexTableSortToggleLabels {
  [key: number]: IndexTableSortToggleLabel;
}

export type BulkAction = DisableableAction;

export type BulkActionListSection = ActionListSection;

export interface BulkActionsProps {
  actions?: (BulkAction | BulkActionListSection)[];
  promotedActions?: (BulkAction | MenuGroupDescriptor)[];
}

export interface IndexTableBaseProps {
  /** Phần tử đằng trước heading của IndexTable */
  headingPrefix?: React.ReactNode;
  /** Định nghĩa heading của IndexTable */
  headings: NonEmptyArray<IndexTableHeading>;
  /** Bulk action của IndexTable */
  bulkActions?: BulkActionsProps["actions"];
  /** Bulk action được promote (ưu tiên hiển thị bên ngoài) của IndexTable */
  promotedBulkActions?: BulkActionsProps["promotedActions"];
  /** Danh sách các item của IndexTable */
  children?: React.ReactNode;
  /** Nội dung của IndexTable khi không có item nào */
  emptyState?: React.ReactNode;
  /** Phần tử sort của IndexTable trong chế độ condensed */
  sort?: React.ReactNode;
  /** Cho phép cột cuối là sticky */
  lastColumnSticky?: boolean; //TODO: implement me
  /**
   * Cho phép sticky header
   * @default true
   * */
  stickyHeader?: boolean;
  /**
   * Các item trong IndexTable có thể chọn
   * @default true
   * */
  selectable?: boolean;
  /** Mảng boolean định nghĩa cột nào có thể sắp xếp, cột nào không. Mặc định là false cho tất cả các cột.  */
  sortable?: boolean[];
  /**
   * Hướng sắp xếp mặc định trong IndexTable khi lần đầu click vào cột
   * @default descending
   * */
  defaultSortDirection?: IndexTableSortDirection;
  /** Hướng sắp xếp hiện tại trong IndexTable */
  sortDirection?: IndexTableSortDirection;
  /** Chỉ số của cột đang dùng để sắp xếp */
  sortColumnIndex?: number;
  /** Callback khi click để sắp xếp cột. */
  onSort?(headingIndex: number, direction: IndexTableSortDirection): void;
  /**
   * Tùy chọn mảng tooltip hiển thị thông tin sắp xếp cho từng cột theo hướng sắp xếp với key là chỉ số của cột.
   * @example
   * {0: {ascending: "Sắp xếp id tăng dần", descending: "Sắp xếp id giảm dần"}}
   * */
  sortToggleLabels?: IndexTableSortToggleLabels;
}

export interface IndexTableProps extends IndexTableBaseProps, IndexProviderProps {}

export interface TableHeadingRect {
  offsetWidth: number;
  offsetLeft: number;
}
