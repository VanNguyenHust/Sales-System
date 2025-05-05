import { ComponentType } from "react";

import { AccessDeniedPage, UnSupportPackagePage } from "src/components/ErrorBoundary";
import { useSelector } from "src/types";
import { RouteMetadata } from "src/types/routes";
import { FeatureFlag, useFeatureFlag } from "src/utils/useFeatureFlag";

// eslint-disable-next-line react/display-name
const withAccessService = (Component: ComponentType) => (routeMetadata: RouteMetadata) => {
  const auth = useSelector((state) => state.auth);
  const { isEnabledFeature, hasFeatureValue } = useFeatureFlag();
  let canAccessFeature = false;
  if (routeMetadata.requiredFeatureFlags) {
    if (routeMetadata.requiredFeatureFlags instanceof Array) {
      canAccessFeature = routeMetadata.requiredFeatureFlags.every((key) => isEnabledFeature(key));
    } else {
      for (const key in routeMetadata.requiredFeatureFlags) {
        const flagKey = key as FeatureFlag;
        canAccessFeature = hasFeatureValue(flagKey, routeMetadata.requiredFeatureFlags[flagKey] as boolean);

        if (!canAccessFeature) {
          break;
        }
      }
    }
  }
  if (!canAccessFeature) {
    return <UnSupportPackagePage />;
  }

  let canActivate = true;
  if (routeMetadata.canActivate.length) {
    canActivate = routeMetadata.canActivate.every((accessService) =>
      accessService.canActivate(routeMetadata, { auth })
    );
  }
  if (!canActivate && !auth.isLoading) {
    return <AccessDeniedPage />;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <Component {...routeMetadata} />;
};

export default withAccessService;
