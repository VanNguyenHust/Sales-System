import { SkeletonPage as UISkeletonPage, type SkeletonPageProps } from "@/ui-components";

import { isSapoMobileBridge } from "app/utils/mobile";

/**
 * Extend SkeletonPage component with mobile bridge aware
 */
export function SkeletonPage(props: SkeletonPageProps) {
  if (isSapoMobileBridge) {
    const { title, backAction, primaryAction, ...restProps } = props;
    return <UISkeletonPage {...restProps} />;
  }
  return <UISkeletonPage {...props} />;
}
