import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Icon } from "@/ui-components";
import { TickSmallMinorIcon } from "@/ui-icons";

import { TypographyElement } from "../types";

type Props = {
  selected?: TypographyElement;
  options: { key: TypographyElement; label: string }[];
  onSelect(type: TypographyElement): void;
};

export const HeadingList = ({ options, selected, onSelect }: Props) => {
  return (
    <StyledList>
      {options.map((option) => (
        <StyledOption key={option.key}>
          <StyledButton onClick={() => onSelect(option.key)} format={option.key}>
            {selected === option.key && (
              <StyledCheck>
                <Icon source={TickSmallMinorIcon} />
              </StyledCheck>
            )}
            {option.label}
          </StyledButton>
        </StyledOption>
      ))}
    </StyledList>
  );
};

const StyledList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledOption = styled.li`
  margin: 0;
  & + & {
    border-top: ${(p) => p.theme.shape.borderDivider};
  }
`;

const StyledCheck = styled.div`
  align-items: center;
  display: flex;
  height: 100%;
  left: 0.75rem;
  position: absolute;
  top: 0;
`;

const StyledButton = styled.button<{
  format: TypographyElement;
}>`
  height: 3rem;
  width: 100%;
  margin: 0;
  padding: ${(p) => p.theme.spacing(2, 4, 2, 8)};
  color: ${(p) => p.theme.colors.text};
  border: 0;
  background: transparent;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  position: relative;
  &:hover {
    background-color: ${(p) => p.theme.colors.surfaceHovered};
  }

  ${(p) => {
    switch (p.format) {
      case TypographyElement.Heading1:
        return css`
          font-size: ${p.theme.typography.fontSize500};
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      case TypographyElement.Heading2:
        return css`
          font-size: 1.375rem;
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      case TypographyElement.Heading3:
        return css`
          font-size: 1.125rem;
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      case TypographyElement.Heading4:
        return css`
          font-size: 0.9375rem;
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      case TypographyElement.Heading5:
        return css`
          font-size: 0.8125rem;
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      case TypographyElement.Heading6:
        return css`
          font-size: 0.625rem;
          font-weight: ${p.theme.typography.fontWeightBold};
          line-height: ${p.theme.typography.fontLineHeight7};
        `;
      default:
        return css`
          font-size: 1rem;
          font-weight: ${p.theme.typography.fontWeightRegular};
          line-height: ${p.theme.typography.fontLineHeight5};
        `;
    }
  }}
`;
