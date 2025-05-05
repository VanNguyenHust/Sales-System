import { RootState } from "src/store/configureStore";
import { RouteMetadata } from "src/types/routes";

import { hasSomePermissions } from "./utils";

export const userRouteAccessService = () => {
  return {
    canActivate(routeMetadata: RouteMetadata, state: RootState): boolean {
      const hasAnyAuthorities = routeMetadata.authorities;
      if (hasAnyAuthorities && hasAnyAuthorities.length > 0) {
        return hasSomePermissions(state.auth.account.permissions, hasAnyAuthorities);
      }
      return true;
    },
  };
};
