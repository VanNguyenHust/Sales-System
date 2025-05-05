import { type RouteObject } from "react-router-dom";

import { Permission } from "app/constants";
import { FeatureFlag, FeatureFlags } from "app/utils/useFeatureFlag";

export declare interface CanActivate {
  canActivate: CanActivateFn;
}

export declare type CanActivateFn = (...args: any) => boolean;

export type RouteMetadata = {
  authorities: Permission[];
  canActivate: CanActivate[];
  /**
   * FeatureFlag required to access route
   * The string array value is shortcut of flags with true value
   * Ex: ["beta"] is equivalence to {beta: true}
   */
  requiredFeatureFlags?: FeatureFlags | FeatureFlag[];
};

export type ValidateParamOptions = { [key: string]: "id" };

export type RouteDescriptor = Pick<
  RouteObject,
  "id" | "caseSensitive" | "path" | "index" | "element" | "errorElement" | "ErrorBoundary"
> & {
  component?: React.ComponentType;
  /**
   * check param for rule, if one of rule not match, NotFoundPage component will be return.
   * Often use for check id param number before jump to component
   */
  validateParams?: ValidateParamOptions;
  navigate?: string;
  /* A fallback Suspense when route using lazy */
  fallback?: React.ReactNode;
  children?: RouteDescriptor[];
} & Partial<RouteMetadata>;
