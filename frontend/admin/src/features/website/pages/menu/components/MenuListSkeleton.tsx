import { Card, Loading, SkeletonPage } from "@/ui-components";

import { SkeletonTable } from "app/components/SkeletonTable";

export const MenuListSkeleton = () => {
  return (
    <SkeletonPage primaryAction>
      <Loading />
      <Card sectioned>
        <SkeletonTable selectable={false} headings={2} />
      </Card>
    </SkeletonPage>
  );
};
