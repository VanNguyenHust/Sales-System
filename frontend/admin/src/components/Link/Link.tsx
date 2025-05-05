import { type LinkProps as ReactRouterLinkProps } from "react-router-dom";
import { Link as UILink, type LinkProps as UILinkProps } from "@/ui-components";

import { LinkComponent } from "../LinkComponent";

export interface LinkProps extends Omit<UILinkProps, "url">, Pick<ReactRouterLinkProps, "replace" | "state"> {
  url?: ReactRouterLinkProps["to"];
}

/**
 * Customize UI Link components for some behavior from react-router-dom
 *
 * @deprecated using Link, UnstyledLink from ui component
 */
export function Link({ url, dataPrimaryLink, ...rest }: LinkProps) {
  if (url) {
    return <LinkComponent url={url} {...rest} data-primary-link={dataPrimaryLink} />;
  }
  // fallback to UI Link button
  const { replace, state, ...restButtonLinkProps } = rest;
  return <UILink dataPrimaryLink={dataPrimaryLink} {...restButtonLinkProps} />;
}
