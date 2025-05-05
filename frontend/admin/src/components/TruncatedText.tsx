import { useCallback, useEffect, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Tooltip, type TooltipProps, useEventListener } from "@/ui-components";

interface Props
  extends Pick<TooltipProps, "preferredPosition" | "children" | "hoverDelay" | "width" | "dismissOnMouseOut"> {
  /**Giới hạn số dòng được phép hiển thị */
  lineClamp?: number;
  /**Giới hạn độ rộng tối đa */
  maxWidth?: number;
  /**Giới hạn độ rộng tối thiểu */
  minWidth?: number;
}

/**
 * Show content as tooltip when truncated
 * @deprecated using TruncatedText2
 * */
export function TruncatedText({ children, lineClamp, maxWidth, minWidth, ...rest }: Props) {
  const textRef = useRef<HTMLDivElement>(null);

  const [currentWidth, setCurrentWidth] = useState<{ scrollWidth: number; offsetWidth: number }>({
    scrollWidth: 0,
    offsetWidth: 0,
  });
  const [currentHeight, setCurrentHeight] = useState<{ scrollHeight: number; offsetHeight: number }>({
    scrollHeight: 0,
    offsetHeight: 0,
  });

  const setDimension = useCallback(() => {
    setCurrentWidth({
      scrollWidth: textRef?.current?.scrollWidth ?? 0,
      offsetWidth: textRef?.current?.offsetWidth ?? 0,
    });
    setCurrentHeight({
      scrollHeight: textRef?.current?.scrollHeight ?? 0,
      offsetHeight: textRef?.current?.offsetHeight ?? 0,
    });
  }, []);

  useEffect(setDimension, [children, setDimension]);

  useEventListener("resize", setDimension);

  const text = (
    <StyledTooltipContent lineClamp={lineClamp} maxWidth={maxWidth} ref={textRef} minWidth={minWidth}>
      {children}
    </StyledTooltipContent>
  );

  const pad = 2;

  const shouldShowTooltip =
    currentWidth.scrollWidth > currentWidth.offsetWidth + pad ||
    (currentHeight.scrollHeight > currentHeight.offsetHeight + pad && lineClamp && lineClamp > 1);

  return shouldShowTooltip && textRef.current ? (
    <Tooltip hoverDelay={200} {...rest} content={textRef.current.innerText || ""}>
      {text}
    </Tooltip>
  ) : (
    <>{text}</>
  );
}
const StyledTooltipContent = styled.span<{ lineClamp?: number; maxWidth?: number; minWidth?: number }>`
  overflow: hidden;
  text-overflow: ellipsis;
  ${(p) =>
    p.maxWidth &&
    css`
      max-width: ${p.maxWidth}px;
    `};
  ${(p) =>
    p.minWidth &&
    css`
      min-width: ${p.minWidth}px;
    `};
  ${(p) =>
    p.lineClamp
      ? css`
          -webkit-line-clamp: ${p.lineClamp};
          display: -webkit-box;
          -webkit-box-orient: vertical;
          white-space: normal;
          overflow-wrap: anywhere;
        `
      : css`
          display: block;
          white-space: nowrap;
        `};
`;
