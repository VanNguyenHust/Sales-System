import { useCallback, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { type LinkLikeComponentProps, type LinkProps } from "@/ui-components";

import { MobileBridgeContext } from "app/features/mobile-bridge/context";
import { dispatchRedirect } from "app/features/mobile-bridge/util/dispatchRedirect";
import { isSapoMobileBridge } from "app/utils/mobile";

interface LinkComponentProps
  extends Omit<LinkLikeComponentProps, "url">,
    Pick<LinkProps, "dataPrimaryLink" | "removeUnderline"> {}

/**
 * This component for customize all link in UI components. It will replace all link with Link's react-router-dom
 *
 * Dont't use this, use Link component instead, this exists only for customize purpose
 * */
export function LinkComponent({
  url: urlProp,
  external,
  children,
  removeUnderline,
  ref,
  className,
  onClick,
  ...rest
}: LinkComponentProps) {
  const stateLocation = useLocation();
  const mobileBridge = useContext(MobileBridgeContext);
  const target = external ? "_blank" : undefined;
  const rel = external ? "noopener noreferrer" : undefined;

  const { url, state } = useMemo(() => {
    const isSaveLocation = typeof urlProp === "string" && urlProp.startsWith("backLink:");
    return {
      url: isSaveLocation ? urlProp.replace("backLink:", "") : urlProp,
      state: isSaveLocation ? { backLink: `${stateLocation.pathname}${stateLocation.search}` } : undefined,
    };
  }, [urlProp, stateLocation.pathname, stateLocation.search]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isSapoMobileBridge && mobileBridge && url) {
        e.preventDefault();
        dispatchRedirect(mobileBridge, url);
        onClick?.(e);
        return false;
      }
      onClick?.(e);
    },
    [mobileBridge, onClick, url]
  );

  if (className) {
    // Other UI component using UnstyledLink component already styled
    return (
      <Link to={url} rel={rel} target={target} state={state} className={className} {...rest} onClick={handleClick}>
        {children}
      </Link>
    );
  }

  return (
    <StyledLink
      to={url}
      removeUnderline={removeUnderline}
      rel={rel}
      target={target}
      state={state}
      {...rest}
      onClick={handleClick}
    >
      {children}
    </StyledLink>
  );
}

// same as Link UI
const StyledLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "removeUnderline",
})<{
  removeUnderline?: boolean;
}>`
  appearance: none;
  display: inline;
  text-align: inherit;
  padding: 0;
  background: none;
  border: 0;
  font-size: inherit;
  font-weight: inherit;
  color: ${(p) => p.theme.colors.interactive};
  cursor: pointer;
  text-decoration: ${(p) => (p.removeUnderline ? "none" : "underline")};
  &:hover {
    color: ${(p) => p.theme.colors.interactiveHovered};
    text-decoration: ${(p) => (p.removeUnderline ? "underline" : "none")};
  }
  &:focus:not(:active) {
    outline: ${(p) => p.theme.colors.focused} auto ${(p) => p.theme.shape.borderRadius(1)};
  }

  &:active {
    position: relative;
    color: ${(p) => p.theme.colors.interactivePressed};
  }
`;
