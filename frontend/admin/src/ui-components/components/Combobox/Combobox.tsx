import React, { Children, useCallback, useContext, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";

import { wrapWithComponent } from "../../utils/components";
import { FilterItemContext } from "../Filters/context";
import { ListboxProps } from "../Listbox";
import { Popover, PopoverProps } from "../Popover";
import { TextFieldProps } from "../TextField";

import {
  ComboboxHeaderContext,
  ComboboxHeaderType,
  ComboboxListboxContext,
  ComboboxListboxOptionContext,
  ComboboxListboxOptionType,
  ComboboxListboxType,
  ComboboxTextFieldContext,
  ComboboxTextFieldType,
} from "./context";
import { Header, HeaderProps } from "./Header";
import { HeaderCheckbox } from "./HeaderCheckbox";
import { HeaderItem } from "./HeaderItem";
import { HeaderSearch } from "./HeaderSearch";
import { Select, SelectProps } from "./Select";
import { TextField } from "./TextField";

export interface ComboboxProps {
  /** TextField hoặc Select component để kích hoạt Popover */
  activator: React.ReactElement<TextFieldProps | SelectProps>;
  /** Cho phép chọn nhiều option */
  allowMultiple?: boolean;
  /** Nội dung hiển thị trong popover */
  children?: React.ReactElement<ListboxProps> | null;
  /**
   * Vị trí hiển thị mong muốn khi mở popover
   * @default "below"
   * */
  preferredPosition?: PopoverProps["preferredPosition"];
  /** Xác định còn nhiều option có thể load khi scroll tới dưới listbox */
  willLoadMoreOptions?: boolean;
  /** Custom header của popover */
  header?: React.ReactNode;
  /** Chiều cao của Popover Pane. */
  height?: string;
  /** Callback khi scroll listbox tới cuối. Thường được dùng để lazy load khi listbox được phân trang */
  onScrolledToBottom?(): void;
  /** Callback khi đóng popover */
  onClose?(): void;
}

/**
 * Input field cho phép chủ shop lọc một danh sách và chọn một hoặc nhiều giá trị
 */
export const Combobox: React.FC<ComboboxProps> & {
  TextField: typeof TextField;
  Select: typeof Select;
  Header: typeof Header;
  HeaderItem: typeof HeaderItem;
  HeaderCheckbox: typeof HeaderCheckbox;
  HeaderSearch: typeof HeaderSearch;
} = ({
  activator,
  allowMultiple,
  children,
  header,
  height,
  preferredPosition = "below",
  willLoadMoreOptions,
  onScrolledToBottom,
  onClose,
}: ComboboxProps) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [activeOptionId, setActiveOptionId] = useState<string>();
  const [textFieldLabelId, setTextFieldLabelId] = useState<string>();
  const [listboxId, setListboxId] = useState<string>();
  const [textFieldFocused, setTextFieldFocused] = useState<boolean>(false);
  const [textFieldFocusedIn, setTextFieldFocusedIn] = useState<boolean>(false);
  const hasHeader = !!header;
  const popoverActiveWithChildrenOrHeader = popoverActive && (Children.count(children) > 0 || hasHeader);
  const shouldOpen = !popoverActive && (Children.count(children) > 0 || hasHeader);
  const headerRef = useRef<HTMLDivElement>(null);
  const handleCountRef = useRef<number>(0);
  const inFilterItem = useContext(FilterItemContext) !== undefined;

  const handleClose = useCallback(() => {
    setPopoverActive(false);
    setTextFieldFocusedIn(false);
    onClose?.();

    setActiveOptionId(undefined);
  }, [onClose]);

  const handleOpen = useCallback(() => {
    setPopoverActive(true);
    setActiveOptionId(undefined);
  }, []);

  const onOptionSelected = useCallback(() => {
    if (!allowMultiple) {
      handleClose();
      setActiveOptionId(undefined);
      return;
    }
  }, [allowMultiple, handleClose]);

  const handleClick: ComboboxTextFieldType["onTextFieldClick"] = useCallback(
    (type, keyboard) => {
      if (type === "select") {
        if (inFilterItem) {
          if (handleCountRef.current === 1) {
            handleCountRef.current = 2;
            return;
          }
        }
        if (popoverActive && !keyboard) {
          handleClose();
        } else if (shouldOpen) {
          handleOpen();
        }
        setTextFieldFocusedIn(true);
      }
    },
    [handleClose, handleOpen, inFilterItem, popoverActive, shouldOpen]
  );

  const handleFocus: ComboboxTextFieldType["onTextFieldFocus"] = useCallback(
    (type) => {
      if (type === "textfield") {
        if (shouldOpen) {
          handleOpen();
        }
        setTextFieldFocused(true);
      } else if (type === "select") {
        setTextFieldFocusedIn(true);
        if (inFilterItem) {
          if (handleCountRef.current === 0) {
            if (!popoverActive && shouldOpen) {
              handleOpen();
            }
            handleCountRef.current = 1;
          } else if (handleCountRef.current === 1) {
            handleCountRef.current = 2;
          }
        }
      }
    },
    [shouldOpen, handleOpen, inFilterItem, popoverActive]
  );

  const handleBlur: ComboboxTextFieldType["onTextFieldBlur"] = useCallback(
    (type, event) => {
      if (type === "textfield") {
        if (popoverActive) {
          if (hasHeader) {
            if (headerRef.current && !headerRef.current.contains(event.relatedTarget as Element)) {
              handleClose();
            }
          } else {
            handleClose();
          }
        }
        setTextFieldFocused(false);
      } else if (type === "select") {
        if (popoverActive) {
          if (hasHeader) {
            if (headerRef.current && !headerRef.current.contains(event.relatedTarget as Element)) {
              handleClose();
            }
          } else {
            handleClose();
          }
        } else {
          setTextFieldFocusedIn(false);
        }
      }
    },
    [popoverActive, hasHeader, handleClose]
  );

  const handleChange = useCallback(() => {
    if (shouldOpen) {
      handleOpen();
    }
  }, [shouldOpen, handleOpen]);

  const textFieldContextValue = useMemo(
    (): ComboboxTextFieldType => ({
      activeOptionId,
      listboxId,
      textFieldFocusedIn,
      setTextFieldLabelId,
      onTextFieldClick: handleClick,
      onTextFieldFocus: handleFocus,
      onTextFieldChange: handleChange,
      onTextFieldBlur: handleBlur,
    }),
    [activeOptionId, listboxId, textFieldFocusedIn, handleClick, handleFocus, handleChange, handleBlur]
  );

  const listboxOptionContextValue = useMemo(
    (): ComboboxListboxOptionType => ({
      allowMultiple,
    }),
    [allowMultiple]
  );

  const listboxContextValue = useMemo(
    (): ComboboxListboxType => ({
      listboxId,
      textFieldLabelId,
      textFieldFocused,
      textFieldFocusedIn,
      willLoadMoreOptions,
      onOptionSelected,
      setActiveOptionId,
      setListboxId,
      onKeyToBottom: onScrolledToBottom,
    }),
    [
      listboxId,
      textFieldLabelId,
      textFieldFocused,
      textFieldFocusedIn,
      willLoadMoreOptions,
      onOptionSelected,
      onScrolledToBottom,
    ]
  );

  const headerContextValue = useMemo(
    (): ComboboxHeaderType => ({
      setTextFieldFocusedIn,
    }),
    []
  );

  const headerMarkup = header ? (
    <Popover.Pane fixed>
      <ComboboxHeaderContext.Provider value={headerContextValue}>
        <div ref={headerRef}>{wrapWithComponent(header, Header, {} as HeaderProps)}</div>
      </ComboboxHeaderContext.Provider>
    </Popover.Pane>
  ) : null;

  return (
    <Popover
      fullWidth
      active={popoverActiveWithChildrenOrHeader}
      activator={
        <ComboboxTextFieldContext.Provider value={textFieldContextValue}>{activator}</ComboboxTextFieldContext.Provider>
      }
      onClose={handleClose}
      autofocusTarget="none"
      preferInputActivator={false}
      preferredPosition={preferredPosition}
    >
      {headerMarkup}
      {Children.count(children) > 0 ? (
        <Popover.Pane onScrolledToBottom={onScrolledToBottom} height={height}>
          <ComboboxListboxContext.Provider value={listboxContextValue}>
            <ComboboxListboxOptionContext.Provider value={listboxOptionContextValue}>
              <StyledListbox>{children}</StyledListbox>
            </ComboboxListboxOptionContext.Provider>
          </ComboboxListboxContext.Provider>
        </Popover.Pane>
      ) : null}
    </Popover>
  );
};

Combobox.TextField = TextField;
Combobox.Select = Select;
Combobox.Header = Header;
Combobox.HeaderItem = HeaderItem;
Combobox.HeaderCheckbox = HeaderCheckbox;
Combobox.HeaderSearch = HeaderSearch;

const StyledListbox = styled.div`
  padding: ${(p) => p.theme.spacing(1, 0)};
  overflow: visible;
`;
