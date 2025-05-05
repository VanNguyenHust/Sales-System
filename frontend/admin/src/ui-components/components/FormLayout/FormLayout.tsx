import React, { memo, NamedExoticComponent } from "react";
import styled from "@emotion/styled";

import { isElementOfType, wrapWithComponent } from "../../utils/components";

import { Group } from "./Group";
import { Item } from "./Item";

export interface FormLayoutProps {
  /** Nội dung của FormLayout */
  children?: React.ReactNode;
}

/**
 * Sử dụng FormLayout để sắp xếp bố cục các trường của form theo chiều dọc (mặt định) hoặc ngang
 */
export const FormLayout = memo(function FormLayout({ children }: FormLayoutProps) {
  return (
    <StyledFormLayout>
      {React.Children.map(children, (child, index) => {
        if (isElementOfType(child, Group)) {
          return child;
        }
        const props = { key: index };
        return wrapWithComponent(child, Item, props);
      })}
    </StyledFormLayout>
  );
}) as NamedExoticComponent<FormLayoutProps> & {
  Group: typeof Group;
};

FormLayout.Group = Group;

const StyledFormLayout = styled.div`
  margin-top: calc(-1 * ${(p) => p.theme.spacing(4)});
  margin-left: calc(-1 * ${(p) => p.theme.spacing(5)});
`;
