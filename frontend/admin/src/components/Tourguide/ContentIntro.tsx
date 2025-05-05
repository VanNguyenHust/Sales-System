import styled from "@emotion/styled";

type ContentIntroProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};

export const ContentIntro = (props: ContentIntroProps) => {
  return (
    <StyledContentIntro>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledContent>{props.children}</StyledContent>
    </StyledContentIntro>
  );
};

const StyledContentIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledTitle = styled.div`
  color: ${(p) => p.theme.colors.surface};
`;

const StyledContent = styled.div`
  color: ${(p) => p.theme.colors.surface};
`;
