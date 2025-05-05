import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { Theme } from "../../themes/types";
import { IconSource } from "../../types";

export interface IconProps {
  /** Nội dung SVG để hiển thị icon */
  source: IconSource;
  /** Màu để fill SVG */
  color?: "base" | "subdued" | "critical" | "interactive" | "warning" | "highlight" | "success" | "primary";
}

export function Icon({ source, color }: IconProps) {
  let sourceType: "function" | "placeholder" | "external";
  if (typeof source === "function") {
    sourceType = "function";
  } else if (source === "placeholder") {
    sourceType = "placeholder";
  } else {
    sourceType = "external";
  }

  if (color && sourceType === "external" && process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.warn("Không hỗ trợ color attribute với external SVG.");
  }

  const SourceComponent = source;
  const contentMarkup = {
    function: <SourceComponent focusable="false" aria-hidden="true" />,
    placeholder: <StyledPlaceholder />,
    external: <img src={`data:image/svg+xml;utf8,${source}`} alt="" aria-hidden="true" />,
  };

  return <StyledIcon $color={color}>{contentMarkup[sourceType]}</StyledIcon>;
}

const StyledIcon = styled.span<{ $color?: IconProps["color"] }>`
  display: block;
  height: ${(p) => p.theme.spacing(5)};
  width: ${(p) => p.theme.spacing(5)};
  max-height: 100%;
  max-width: 100%;
  margin: auto;
  svg,
  img {
    position: relative;
    display: block;
    width: 100%;
    max-width: 100%;
    max-height: 100%;
  }
  ${(p) =>
    p.$color &&
    css`
      color: ${color(p.theme, p.$color)};
      svg {
        fill: ${color(p.theme, p.$color)};
      }
    `}
`;

function color(theme: Theme, color: IconProps["color"]) {
  switch (color) {
    case "base":
      return theme.colors.icon;
    case "interactive":
      return theme.colors.interactive;
    case "subdued":
      return theme.colors.iconSubdued;
    case "primary":
      return theme.colors.actionPrimary;
    case "success":
      return theme.colors.iconSuccess;
    case "warning":
      return theme.colors.iconWarning;
    case "critical":
      return theme.colors.iconCritical;
    case "highlight":
      return theme.colors.iconHighlight;
  }
}

const StyledPlaceholder = styled.div`
  padding-bottom: 100%;
  background: transparent;
`;
