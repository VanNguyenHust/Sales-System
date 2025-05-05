import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Text } from "@/ui-components";
import { ArrowChevronBigLeftIcon } from "@/ui-icons";

type Props = {
  onBack?: () => void;
  title?: React.ReactNode;
  isShowBackButton?: boolean;
  titleAlignCenter?: boolean;
};

export const CustomModalTitle = ({ onBack, title, isShowBackButton, titleAlignCenter }: Props) => {
  return (
    <StyledContainer>
      {isShowBackButton && (
        <>
          <StyledBackButton onClick={onBack}>
            <ArrowChevronBigLeftIcon height="16px" className="back-button" />
          </StyledBackButton>
          &nbsp;&nbsp;
        </>
      )}
      <StyledTitle alignCenter={titleAlignCenter}>
        <Text as="span" variant="headingLg" fontWeight="medium">
          {title}
        </Text>
      </StyledTitle>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
`;
const StyledBackButton = styled.span`
  color: ${(p) => p.theme.colors.textPlaceholder};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")} !important;
  cursor: pointer;
  width: 36px;
  height: 36px;
  padding: ${(p) => p.theme.spacing(2)};
  margin-left: -8px;
  svg {
    width: ${(p) => p.theme.spacing(5)};
    height: ${(p) => p.theme.spacing(5)};
  }
  &:hover {
    background: ${(p) => p.theme.colors.surfaceNeutralInfo} !important;
    box-shadow: none !important;
    color: ${(p) => p.theme.colors.textSubdued};
  }
`;
const StyledTitle = styled.div<{ alignCenter?: boolean }>`
  ${(p) =>
    p.alignCenter
      ? css`
          width: 100%;
          text-align: center;
        `
      : css``};
`;
