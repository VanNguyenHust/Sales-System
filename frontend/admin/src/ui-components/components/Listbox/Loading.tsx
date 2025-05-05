import React, { memo, useEffect } from "react";
import styled from "@emotion/styled";

import { useI18n } from "../../utils/i18n";
import { Spinner } from "../Spinner";

import { useListbox } from "./context";

export interface LoadingProps {
  /** Nội dung bên của phần tử */
  children?: React.ReactNode;
  /** label accessibility */
  accessibilityLabel?: string;
}

export const Loading = memo(function LoadingOption({ children, accessibilityLabel }: LoadingProps) {
  const i18n = useI18n();
  const { setLoading } = useListbox();
  const label = accessibilityLabel || i18n.translate("UI.Listbox.loadingAccessibilityLabel");

  useEffect(() => {
    setLoading(true);
    return () => {
      setLoading(false);
    };
  }, [setLoading]);

  return (
    <StyledLoading role="presentation">
      {children ? (
        children
      ) : (
        <StyledSpinner>
          <Spinner size="small" accessibilityLabel={label} />
        </StyledSpinner>
      )}
    </StyledLoading>
  );
});

const StyledLoading = styled.li`
  padding: 0;
  margin: 0;
`;

const StyledSpinner = styled.div`
  padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) ${(p) => p.theme.spacing(4)};
  display: grid;
  place-items: center;
`;
