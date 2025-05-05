import React, { isValidElement } from "react";
import type { JSX } from "react";

/**
 * wrap element with Wrapper component, return element if element is type of Wrapper component
 */
export function wrapWithComponent<TProps extends React.PropsWithChildren>(
  element: React.ReactNode | null | undefined,
  WrapperComponent: React.ComponentType<TProps>,
  props: TProps & JSX.IntrinsicAttributes
): React.ReactNode {
  if (element === null) {
    return null;
  }

  return isElementOfType(element, WrapperComponent) ? (
    element
  ) : (
    <WrapperComponent {...props} key={props.key}>
      {element}
    </WrapperComponent>
  );
}

/**
 * Checks whether `element` is a React element of type `Component` (or one of the passed components, if `Component` is an array of React components).
 * */
export function isElementOfType<TProps>(
  element: React.ReactNode | null | undefined,
  Component: React.ComponentType<TProps> | React.ComponentType<TProps>[]
): boolean {
  if (element === null || !isValidElement(element) || typeof element.type === "string") {
    return false;
  }

  const { type: defaultType } = element;
  const overrideType = (element.props as { __type__?: any }).__type__;
  const type = overrideType || defaultType;
  const Components = Array.isArray(Component) ? Component : [Component];

  return Components.some((AComponent) => typeof type !== "string" && AComponent === type);
}

export function isInterface<T>(x: T | React.ReactNode): x is T {
  return !isValidElement(x) && x !== undefined;
}
