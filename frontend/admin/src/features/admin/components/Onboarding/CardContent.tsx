import styled from "@emotion/styled";
import { Text } from "@/ui-components";

export const CardContent = ({
  title,
  description,
  children,
  flushContent,
}: {
  title: string;
  description: React.ReactNode;
  children: React.ReactNode;
  flushContent?: boolean;
}) => {
  return (
    <StyledCardContent>
      <StyledTitle>
        <Text as="p" fontWeight="medium">
          {title}
        </Text>
        <StyledDescription>{description}</StyledDescription>
      </StyledTitle>
      <StyledContent flushContent={flushContent}>{children}</StyledContent>
    </StyledCardContent>
  );
};

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${(p) => p.theme.spacing(4)};
  overflow: hidden;
`;

const StyledTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(1)};
  flex-shrink: 0;
  ${(p) => p.theme.breakpoints.down("md")} {
    padding-right: 0;
  }
`;

const StyledContent = styled.div<{ flushContent?: boolean }>`
  padding: ${(p) => (!p.flushContent ? p.theme.spacing(5) : p.theme.spacing(0))};
  background: #f4f4f5;
  border-radius: ${(p) =>
    !p.flushContent ? `calc(${`${p.theme.shape.borderRadius(2)} + ${p.theme.shape.borderRadius(0.5)}`})` : "0"};
  overflow: auto;
  flex-grow: 1;
  ${(p) => p.theme.breakpoints.down("md")} {
    padding: ${(p) => (!p.flushContent ? p.theme.spacing(4) : p.theme.spacing(0))};
  }
`;

const StyledDescription = styled.span`
  color: ${(p) => p.theme.colors.iconPressed};
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(4)};
`;
