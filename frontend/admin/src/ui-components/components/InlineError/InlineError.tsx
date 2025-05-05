import React from "react";
import styled from "@emotion/styled";
import { ErrorIcon } from "@/ui-icons";

import type { Error } from "../../types";
import { Icon } from "../Icon";

export interface InlineErrorProps {
  /** Nội dung tóm tắt giải thích cách sửa trường dữ liệu lỗi form */
  message: Error;
  /** Định danh của trường dữ liệu lỗi trong form đang được mô tả */
  fieldID: string;
  /** Có kèm icon minh họa */
  withIllustration?: boolean;
}

/**
 * Tóm tắt thông tin lỗi về một hay một nhóm các trường dữ liệu trong form để giúp chủ shop hiểu và có thể sửa cho phù hợp
 */
export function InlineError({ message, fieldID, withIllustration }: InlineErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <StyledInlineError id={`${fieldID}Error`}>
      {withIllustration && (
        <StyledIcon>
          <Icon source={ErrorIcon} />
        </StyledIcon>
      )}
      {message}
    </StyledInlineError>
  );
}

const StyledInlineError = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.textCritical};
  fill: ${(p) => p.theme.colors.iconCritical};
`;

const StyledIcon = styled.div`
  fill: currentColor;
  margin-left: calc(-1 * ${(p) => p.theme.spacing(0.5)});
  margin-right: calc(${(p) => p.theme.spacing(0.5)} + ${(p) => p.theme.spacing(1)});
`;
