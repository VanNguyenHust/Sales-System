import styled from "@emotion/styled";
import { Card, Layout, Loading, SkeletonBodyText, SkeletonDisplayText, SkeletonPage } from "@/ui-components";

export const BlogManagerSkeleton = () => {
  return (
    <SkeletonPage title="" backAction>
      <Loading />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText lines={18} />
          </Card>
          <Card sectioned>
            <SkeletonBodyText lines={3} />
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <SkeletonBodyText lines={6} />
          </Card>
          <Card sectioned>
            <SkeletonBodyText lines={3} />
          </Card>
          <Card sectioned>
            <SkeletonBodyText lines={3} />
          </Card>
        </Layout.Section>
      </Layout>
      <StyledPageAction>
        <SkeletonDisplayText size="small" />
      </StyledPageAction>
    </SkeletonPage>
  );
};

const StyledPageAction = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${(p) => p.theme.spacing(4)};
  > :first-child {
    width: 120px;
  }
`;
