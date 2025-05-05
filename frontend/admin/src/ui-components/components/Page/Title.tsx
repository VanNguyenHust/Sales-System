import React from "react";
import styled from "@emotion/styled";

export interface TitleProps {
  /** Tiêu đề trang */
  title?: string;
  /** Tiêu đề phụ của trang */
  subtitle?: string;
  /** Thông tin metadata của tiêu đề */
  titleMetadata?: React.ReactNode;
}

export function Title({ title, subtitle, titleMetadata }: TitleProps) {
  const titleMarkup = title ? <StyledTitle>{title}</StyledTitle> : null;
  const subtitleMarkup = subtitle ? (
    <StyledSubtitle>
      <p>{subtitle}</p>
    </StyledSubtitle>
  ) : null;

  const titleMetadataMarkup = titleMetadata ? <StyledTitleMetadata>{titleMetadata}</StyledTitleMetadata> : null;

  if (titleMetadataMarkup) {
    return (
      <>
        <StyledTitleWithMetadataWrapper>
          {titleMarkup}
          {titleMetadataMarkup}
        </StyledTitleWithMetadataWrapper>
        {subtitleMarkup}
      </>
    );
  }

  return (
    <>
      {titleMarkup}
      {subtitleMarkup}
    </>
  );
}

const StyledTitle = styled.h1`
  word-break: break-word;
  overflow-wrap: break-word;
  font-weight: ${(p) => p.theme.typography.fontWeightMedium};
  font-size: ${(p) => p.theme.typography.fontSize300};
  line-height: ${(p) => p.theme.typography.fontLineHeight3};
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize350};
    line-height: ${(p) => p.theme.typography.fontLineHeight4};
  }
`;

const StyledSubtitle = styled.div`
  margin-top: ${(p) => p.theme.spacing(1)};
  color: ${(p) => p.theme.colors.textSubdued};
`;

const StyledTitleMetadata = styled.div`
  margin-top: 0;
  vertical-align: bottom;
`;

const StyledTitleWithMetadataWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: ${(p) => p.theme.spacing(2)};

  ${StyledTitle} {
    display: inline;
    margin-right: ${(p) => p.theme.spacing(2)};
  }

  ${StyledTitleMetadata} {
    margin-top: 0;
    vertical-align: bottom;
  }
`;
