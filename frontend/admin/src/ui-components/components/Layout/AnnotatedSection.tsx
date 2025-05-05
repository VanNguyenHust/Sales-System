import React from "react";
import styled from "@emotion/styled";

import { Text } from "../Text";
import { TextContainer } from "../TextContainer";

export interface AnnotatedSectionProps {
  /** Id của annotated section */
  id?: string;
  /** Tiêu đề của mô tả section */
  title?: React.ReactNode;
  /** Nội dung của mô tả section */
  description?: React.ReactNode;
  /**  Nội dung section */
  children?: React.ReactNode;
}

export function AnnotatedSection({ children, id, title, description }: AnnotatedSectionProps) {
  const descriptionMarkup = typeof description === "string" ? <p>{description}</p> : description;
  return (
    <StyledAnnotatedSection>
      <StyledAnnotationWrapper>
        <StyledAnnotation>
          <TextContainer>
            <Text id={id} variant="headingMd" as="h2">
              {title}
            </Text>
            {descriptionMarkup && <StyledAnnotationDescription>{descriptionMarkup}</StyledAnnotationDescription>}
          </TextContainer>
        </StyledAnnotation>
        <StyledAnnotationContent>{children}</StyledAnnotationContent>
      </StyledAnnotationWrapper>
    </StyledAnnotatedSection>
  );
}

const StyledAnnotationWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: calc(-1 * ${(p) => p.theme.spacing(4)});
  margin-left: calc(-1 * ${(p) => p.theme.spacing(4)});
`;
const StyledAnnotation = styled.div``;
const StyledAnnotationContent = styled.div``;

const StyledAnnotationDescription = styled.div`
  color: ${(p) => p.theme.colors.textSubdued};
`;

const StyledAnnotatedSection = styled.div`
  flex: 1 1 100%;
  min-width: 0;
  max-width: calc(100% - ${(p) => p.theme.spacing(4)});
  margin-top: ${(p) => p.theme.spacing(4)};
  margin-left: ${(p) => p.theme.spacing(4)};
  ${StyledAnnotation} {
    flex: 1 1 ${(p) => p.theme.components.layout.widthSecondary};
    padding: ${(p) => p.theme.spacing(4, 4, 0)};
    ${(p) => p.theme.breakpoints.up("sm")} {
      padding: ${(p) => p.theme.spacing(4, 0, 0)};
    }

    ${(p) => p.theme.breakpoints.up("md")} {
      padding: ${(p) => p.theme.spacing(4, 4, 4, 0)};
    }
  }
  ${StyledAnnotation},${StyledAnnotationContent} {
    min-width: 0;
    max-width: calc(100% - ${(p) => p.theme.spacing(4)});
    margin-top: ${(p) => p.theme.spacing(4)};
    margin-left: ${(p) => p.theme.spacing(4)};
  }
  ${StyledAnnotationContent} {
    flex: ${(p) => {
      const layout = p.theme.components.layout;
      const ratio = parseFloat(layout.widthPrimary) / parseFloat(layout.widthSecondary);
      return `${ratio} ${ratio} ${layout.widthPrimary}`;
    }};
  }
`;
