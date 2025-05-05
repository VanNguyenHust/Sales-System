import { ComplexAction } from "../../types";

export interface CallbackAction {
  /** id của action */
  id?: string;
  /** Callback của action */
  onAction?(): void;
}

export interface LinkAction {
  /** id của action */
  id?: string;
  /** Đích link của action */
  url?: string;
}

export interface PaginationProps {
  /** Có trang tiếp theo để show */
  hasNext?: boolean;
  /** Có trang trước đó để show */
  hasPrevious?: boolean;
  /** Callback của next action */
  onNext?(): void;
  /** Callback của previous action */
  onPrevious?(): void;
}

export interface PrimaryAction extends ComplexAction {}
