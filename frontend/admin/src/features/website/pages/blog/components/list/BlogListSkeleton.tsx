import styled from "@emotion/styled";
import { Card, Loading, SkeletonDisplayText, SkeletonPage, SkeletonTabs } from "@/ui-components";

import { SkeletonTable } from "app/components/SkeletonTable";

export const BlogListSkeleton = () => {
  return (
    <SkeletonPage primaryAction fullWidth backAction>
      <Loading />
      <Card>
        <Card.Section>
          <SkeletonTabs />
          <StyledPageAction>
            <SkeletonDisplayText />
          </StyledPageAction>
          <SkeletonTable />
        </Card.Section>
      </Card>
    </SkeletonPage>
  );
};

const StyledPageAction = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: ${(p) => p.theme.spacing(4, 0)};
  > :first-child {
    max-width: 100%;
    width: 100%;
  }
`;
