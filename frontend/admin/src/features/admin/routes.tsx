import { matchPath, Navigate } from "react-router-dom";
import { isArray } from "lodash-es";

import { AccessDeniedPage, NotFoundPage } from "src/components/ErrorBoundary";
import { LegacyPage } from "src/components/Legacy/LegacyPage";
import { routes as appRoutes } from "src/features/app/routes";
import { FeatureFlag, FeatureFlags, useFeatureFlag } from "src/utils/useFeatureFlag";

import { RouteDescriptor } from "@/types/routes";

/* Admin layout routes */

/**
 * Legacy route is route that be served by legacy frontend,
 * when refactor a feature with new frontend, remove that from legacy route
 */
/**
 * FeatureFlag required to access route
 * The string array value is shortcut of flags with true value
 * Ex: ["beta"] is equivalence to {beta: true}
 */

const legacyRoutes: {
  index?: boolean;
  path: string;
  excludePaths?: string[];
  requiredFeatureFlags?: FeatureFlags | FeatureFlag[];
}[] = [
  {
    path: "bar/*",
  },
  {
    path: "authorization/*",
    excludePaths: ["authorization/accessdenied"],
  },
  {
    path: "oauth/*",
  },
  {
    path: "api/auth",
  },
  {
    path: "bulk/*",
  },
  {
    path: "themes/*",
    requiredFeatureFlags: ["use_online_store_channel"],
  },
  {
    path: "data/themes/*",
    requiredFeatureFlags: ["use_online_store_channel"],
  },
  {
    path: "preferences",
    requiredFeatureFlags: ["use_online_store_channel"],
  },
  {
    path: "settings/domains",
    requiredFeatureFlags: ["use_online_store_channel"],
  },
  {
    path: "channels/*",
  },
  {
    path: "activestore/*",
  },
  {
    path: "charges/*",
  },
  {
    path: "apps/apporders",
  },
  {
    path: "api_permissions",
  },
  {
    path: "settings/plans/website",
  },
];

export const routes: RouteDescriptor[] = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "authorization/accessdenied",
    element: <AccessDeniedPage />,
  },
  ...websiteRoutes,
  ...legacyRoutes.map((route) => ({
    ...route,
    component: LegacyPage,
  })),
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export function isLegacyPath(path: string) {
  for (const route of legacyRoutes) {
    const match = matchPath(`/admin/${route.path}`, path);
    let exlcudeMatch = false;
    if (route.excludePaths) {
      exlcudeMatch = route.excludePaths.some((excludePath) => {
        return matchPath(`/admin/${excludePath}`, path);
      });
    }
    if (match && !exlcudeMatch) {
      return true;
    }
  }
  return false;
}

export function useLegacyPageFeatureFlag() {
  const { isEnabledFeature, hasFeatureValue } = useFeatureFlag();
  const isEnabledPath = (path: string) => {
    for (const route of legacyRoutes) {
      const match = matchPath(`/admin/${route.path}`, path);
      let exlcudeMatch = false;
      if (route.excludePaths) {
        exlcudeMatch = route.excludePaths.some((excludePath) => {
          return matchPath(`/admin/${excludePath}`, path);
        });
      }
      let isEnabled = true;
      if (match && !exlcudeMatch && route.requiredFeatureFlags) {
        if (isArray(route.requiredFeatureFlags)) {
          isEnabled = route.requiredFeatureFlags.every((key) => isEnabledFeature(key));
        } else {
          for (const key in route.requiredFeatureFlags) {
            const flagKey = key as FeatureFlag;
            isEnabled = hasFeatureValue(flagKey, route.requiredFeatureFlags[flagKey] as boolean);
            if (!isEnabled) {
              break;
            }
          }
        }
      }
      if (match && !exlcudeMatch && isEnabled) {
        return true;
      }
    }
    return false;
  };
  return { isEnabledPath };
}
