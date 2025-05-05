import React, { useCallback } from "react";
import styled from "@emotion/styled";

import { useI18n } from "../../utils/i18n";
import { visuallyHidden } from "../../utils/styles";

export interface FormProps {
  /** Chỉ định bộ ký tự được chấp nhận của form như "UTF-8", "ISO-8859-1", ... */
  acceptCharset?: string;
  /** chỉ định URL mà form sẽ được gửi đến khi click "submit" */
  action?: string;
  /** Cho phép auto complete bởi trình duyệt của TextField */
  autoComplete?: boolean;
  /** Nội dung bên trong của form */
  children?: React.ReactNode;
  /** Chỉ định loại dữ liệu được khi gửi form */
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data" | "text/plain";
  /** Tự động gửi form khi ấn enter */
  implicitSubmit?: boolean;
  /** Method của form */
  method?: "post" | "get";
  /** Tên form */
  name?: string;
  /** set noValidate cho form */
  noValidate?: boolean;
  /** Chặn hành động mặc định của form */
  preventDefault?: boolean;
  /** Chỉ định nơi mà kết quả của form sẽ hiển thị sau khi được gửi đi. */
  target?: string;
  /** Callback khi click submit */
  onSubmit(event: React.FormEvent<HTMLFormElement>): void;
}

/**
 * Xử lý với form
 */
export function Form({
  acceptCharset,
  target,
  preventDefault = true,
  method = "post",
  autoComplete,
  encType,
  implicitSubmit = true,
  onSubmit,
  name,
  noValidate,
  children,
  action,
}: FormProps) {
  const i18n = useI18n();
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (!preventDefault) {
        return;
      }

      event.preventDefault();
      onSubmit(event);
    },
    [onSubmit, preventDefault]
  );

  const autoCompleteInputs = normalizeAutoComplete(autoComplete);

  const submitMarkup = implicitSubmit ? (
    <StyledTextSubmit>
      <button type="submit" aria-hidden="true" tabIndex={-1}>
        {i18n.translate("UI.Common.submit")}
      </button>
    </StyledTextSubmit>
  ) : null;

  return (
    <StyledForm
      acceptCharset={acceptCharset}
      action={action}
      autoComplete={autoCompleteInputs}
      encType={encType}
      method={method}
      name={name}
      noValidate={noValidate}
      target={target}
      onSubmit={handleSubmit}
    >
      {submitMarkup}
      {children}
    </StyledForm>
  );
}

const StyledForm = styled.form``;

const StyledTextSubmit = styled.span`
  ${visuallyHidden}
`;

function normalizeAutoComplete(autoComplete?: boolean) {
  if (autoComplete === null || autoComplete === undefined) {
    return autoComplete;
  }

  return autoComplete ? "on" : "off";
}
