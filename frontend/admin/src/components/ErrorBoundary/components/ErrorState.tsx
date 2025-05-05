import styled from "@emotion/styled";
import { Card, EmptyState, type EmptyStateProps } from "@/ui-components";

import { DocumentTitle } from "app/components/DocumentTitle";

export function ErrorState(props: EmptyStateProps) {
  return (
    <StyledWrapper>
      {props.heading && <DocumentTitle title={props.heading} />}
      <Card>
        <StyledContainer>
          <EmptyState {...props} />
        </StyledContainer>
      </Card>
    </StyledWrapper>
  );
}

const StyledContainer = styled.div`
  min-height: calc(
    100vh - ${(p) => p.theme.components.topBar.height} - ${(p) => p.theme.spacing(8)} - ${(p) => p.theme.spacing(8)}
  );
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledWrapper = styled.div`
  padding: ${(p) => p.theme.spacing(8, 0)};
  ${(p) => p.theme.breakpoints.up("md")} {
    padding: ${(p) => p.theme.spacing(8)};
  }
`;
