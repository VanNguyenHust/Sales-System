import React, { useEffect } from "react";
import { Navigate, type RouteObject } from "react-router-dom";

import { RouteDescriptor, RouteMetadata } from "src/types/routes";

import { ValidateParam } from "./ValidateParam";
import withAccessService from "./withAccessService";

export function createReactRouterRoutes(routes: RouteDescriptor[]): RouteObject[] {
  const result: RouteObject[] = [];
  for (const {
    component: Component,
    navigate,
    authorities,
    canActivate,
    children,
    index,
    element: elementProp,
    validateParams,
    fallback,
    requiredFeatureFlags,
    ...rest
  } of routes) {
    if (navigate !== undefined) {
      result.push({
        ...rest,
        element: <Navigate to={navigate} />,
      });
    } else {
      let element: React.ReactNode;
      if (authorities !== undefined || canActivate !== undefined || requiredFeatureFlags !== undefined) {
        const routeMetadata: RouteMetadata = {
          authorities: authorities ?? [],
          canActivate: canActivate ?? [],
          requiredFeatureFlags: requiredFeatureFlags ?? [],
        };
        if (Component !== undefined) {
          const ProtectedComponent = withAccessService(Component);
          element = <ProtectedComponent {...routeMetadata} />;
        } else {
          throw new Error(
            `Only React.ComponentType can be use "authorities" and "canActivate" feature. Using "component" instead of "element", Route={path=${rest.path}}`
          );
        }
      } else {
        if (Component !== undefined) {
          element = <Component />;
        } else {
          element = elementProp;
        }
      }
      if (element && validateParams) {
        element = <ValidateParam validateParams={validateParams}>{element}</ValidateParam>;
      }
      if (element && fallback) {
        element = <React.Suspense fallback={<Fallback>{fallback}</Fallback>}>{element}</React.Suspense>;
      }
      if (index) {
        result.push({
          ...rest,
          index,
          element,
        });
      } else {
        result.push({
          ...rest,
          element,
          children: createReactRouterRoutes(children || []),
        });
      }
    }
  }
  return result;
}

// workaround for issue portal suspense: https://github.com/facebook/react/issues/26612
function Fallback({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const node = document.getElementById("UIPortalsContainer");
    if (node) {
      node.style.display = "none";
    }
    return () => {
      if (node) {
        node.style.display = "";
      }
    };
  }, []);
  return children;
}
