export interface StrictOption {
  /** giá trị của option, sẽ được truyền vào trong 'onChange' */
  value: string;
  /** Text sẽ hiển thị trong option */
  label: string;
  /** Vô hiệu hóa option */
  disabled?: boolean;
}

export interface HideableStrictOption extends StrictOption {
  hidden?: boolean;
}

export interface StrictGroup {
  /** Tiêu đề của group */
  title: string;
  /** Danh sách các option */
  options: StrictOption[];
}

export type SelectOption = string | StrictOption;

export interface SelectGroup {
  /** Tiêu đề của group */
  title: string;
  /** Danh sách các option */
  options: SelectOption[];
}
