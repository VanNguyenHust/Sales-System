import React, { forwardRef, memo } from "react";

import { LinkLikeComponentProps } from "../../types";

import { useLink } from "./context";

export interface UnstyledLinkProps extends LinkLikeComponentProps {}

/**
 * Đối tượng link
 */
export const UnstyledLink = memo(
  forwardRef<any, UnstyledLinkProps>(function UnstyledLink(props, ref) {
    const LinkComponent = useLink();
    if (LinkComponent) {
      return <LinkComponent {...props} url={props.url} ref={ref} />;
    }

    const { external, url, ...rest } = props;
    const target = external ? "_blank" : undefined;
    const rel = external ? "noopener noreferrer" : undefined;
    return <a target={target} {...rest} href={url} rel={rel} ref={ref} />;
  })
);
