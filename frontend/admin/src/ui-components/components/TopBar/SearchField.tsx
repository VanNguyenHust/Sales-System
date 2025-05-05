import React, { useCallback } from "react";
import styled from "@emotion/styled";
import { SearchIcon } from "@/ui-icons";

import { useUniqueId } from "../../utils/uniqueId";
import { Icon } from "../Icon";
import { TextField } from "../TextField";

export interface SearchFieldProps {
  /** Giá trị ban đầu của input */
  value: string;
  /** Placeholder của input */
  placeholder?: string;
  /** Buộc focus vào input */
  focused?: boolean;
  /** prefix */
  prefix?: React.ReactNode;
  /** suffix */
  suffix?: React.ReactNode;
  /** Hàm gọi lại khi thay đổi query tìm kiếm */
  onChange(value: string): void;
  /** Hàm gọi lại khi focus vào input */
  onFocus?(): void;
  /** Hàm gọi lại khi bỏ focus ra khỏi input */
  onBlur?(): void;
  /** Hàm gọi lại khi ấn nút clear input */
  onCancel?(): void;
}

export function SearchField({
  value,
  placeholder,
  focused,
  prefix,
  suffix,
  onChange,
  onBlur,
  onFocus,
  onCancel,
}: SearchFieldProps) {
  const searchId = useUniqueId("SearchField");

  const handleClear = useCallback(() => {
    onCancel && onCancel();
    onChange("");
  }, [onCancel, onChange]);

  const prefixMarkup = prefix ? prefix : <Icon source={SearchIcon} color="base" />;

  return (
    <StyledSearchField>
      <TextField
        value={value}
        type="search"
        prefix={prefixMarkup}
        suffix={suffix}
        focused={focused}
        placeholder={placeholder}
        name={searchId}
        id={searchId}
        onFocus={onFocus}
        clearButton
        autoComplete="off"
        onClearButtonClick={handleClear}
        onChange={onChange}
        onBlur={onBlur}
      />
    </StyledSearchField>
  );
}

const StyledSearchField = styled.div`
  position: relative;
  z-index: ${(p) => p.theme.zIndex(3)};
`;
