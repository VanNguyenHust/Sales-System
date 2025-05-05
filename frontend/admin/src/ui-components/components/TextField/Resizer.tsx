import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";

import { useEventListener } from "../../utils/useEventListener";

interface Props {
  contents?: string;
  currentHeight?: number | null;
  minimumLines?: number;
  onHeightChange(height: number): void;
}

export function Resizer({ contents, currentHeight: currentHeightProp = null, minimumLines, onHeightChange }: Props) {
  const contentNode = useRef<HTMLDivElement>(null);
  const minimumLinesNode = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | undefined>(undefined);
  const currentHeight = useRef<number | null>(currentHeightProp);

  if (currentHeightProp !== currentHeight.current) {
    currentHeight.current = currentHeightProp;
  }

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  const handleHeightCheck = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      if (!contentNode.current || !minimumLinesNode.current) {
        return;
      }

      const newHeight = Math.max(contentNode.current.offsetHeight, minimumLinesNode.current.offsetHeight);

      if (newHeight !== currentHeight.current) {
        onHeightChange(newHeight);
      }
    });
  }, [onHeightChange]);

  useLayoutEffect(() => {
    handleHeightCheck();
  });

  useEventListener("resize", handleHeightCheck);

  const minimumLinesMarkup = minimumLines ? (
    <StyledDummyInput
      ref={minimumLinesNode}
      dangerouslySetInnerHTML={{
        __html: getContentsForMinimumLines(minimumLines),
      }}
    />
  ) : null;

  return (
    <StyledResizer aria-hidden>
      <StyledDummyInput ref={contentNode} dangerouslySetInnerHTML={{ __html: getFinalContents(contents) }} />
      {minimumLinesMarkup}
    </StyledResizer>
  );
}

//TODO: review XSS, see: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

const ENTITIES_TO_REPLACE: { [key: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "\n": "<br>",
  "\r": "",
};

const REPLACE_REGEX = new RegExp(`[${Object.keys(ENTITIES_TO_REPLACE).join()}]`, "g");

function replaceEntity(entity: keyof typeof ENTITIES_TO_REPLACE) {
  return ENTITIES_TO_REPLACE[entity];
}

function getContentsForMinimumLines(minimumLines: number) {
  let content = "";

  for (let line = 0; line < minimumLines; line++) {
    content += "<br>";
  }

  return content;
}

function getFinalContents(contents?: string) {
  return contents ? `${contents.replace(REPLACE_REGEX, replaceEntity)}<br>` : "<br>";
}

const StyledResizer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  visibility: hidden;
  overflow: hidden;
`;

const StyledDummyInput = styled.div`
  font-size: ${(p) => p.theme.typography.fontSize200};
  ${(p) => p.theme.breakpoints.up("md")} {
    font-size: ${(p) => p.theme.typography.fontSize100};
  }
  font-weight: ${(p) => p.theme.typography.fontWeightRegular};
  line-height: ${(p) => p.theme.typography.fontLineHeight2};
  border: ${(p) => p.theme.shape.borderTransparent};
  min-height: ${(p) => p.theme.components.form.controlHeight};
  padding: ${(p) =>
    `calc((${p.theme.components.form.controlHeight} - ${p.theme.typography.fontLineHeight3} - ${p.theme.spacing(
      0.5
    )})/2) ${p.theme.spacing(3)}`};
  letter-spacing: initial;
  word-wrap: break-word;
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;
