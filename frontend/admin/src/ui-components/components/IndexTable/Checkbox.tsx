import React, { Fragment, memo, useCallback, useContext, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { debounce, noop } from "lodash-es";

import { Checkbox as UICheckbox } from "../Checkbox";

import { StyledCellFirst } from "./Cell";
import { OffsetContext, RowContext, useIndexValue } from "./context";

export const Checkbox = memo(function Checkbox({ prefix }: { prefix?: boolean }) {
  const { condensed } = useIndexValue();
  const { itemId, selected, disabled, onInteraction } = useContext(RowContext);

  const Wrapper = condensed ? Fragment : CheckboxWrapper;

  return (
    <Wrapper>
      <StyledContentContainer>
        <StyledCheckboxWrapper onClick={onInteraction} onKeyUp={noop} $condensed={condensed} $prefix={prefix}>
          <UICheckbox id={itemId} checked={selected} disabled={disabled} />
        </StyledCheckboxWrapper>
      </StyledContentContainer>
    </Wrapper>
  );
});

const CheckboxWrapper = ({ children }: { children: React.ReactNode }) => {
  const { position } = useContext(RowContext);
  const { checkbox, prefix, onCheckboxChange } = useContext(OffsetContext);
  const checkboxNode = useRef<HTMLTableCellElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleResize = useCallback(
    debounce(() => {
      if (position === 0 && checkboxNode.current) {
        const { width } = checkboxNode.current.getBoundingClientRect();
        onCheckboxChange?.(`${width}px`);
      }
    }),
    [position]
  );

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    if (!checkboxNode.current) return;
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  const offset = prefix ? `calc(${prefix} + ${checkbox})` : checkbox;

  return (
    <StyledCellFirst ref={checkboxNode} $offset={offset}>
      {children}
    </StyledCellFirst>
  );
};

const StyledContentContainer = styled.div`
  display: flex;
  align-items: center;
`;

const StyledCheckboxWrapper = styled.div<{
  $condensed?: boolean;
  $prefix?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${(p) => p.theme.spacing(5)};
  padding-left: ${(p) => (p.$prefix ? 0 : p.theme.spacing(4))};
  ${(p) =>
    p.$condensed &&
    css`
      height: auto;
      padding-left: auto;
      min-width: ${p.theme.spacing(12)};
      min-height: ${p.theme.spacing(10)};
      margin-right: calc(-1 * ${p.theme.spacing(4)});
    `}
`;
