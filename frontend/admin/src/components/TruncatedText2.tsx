import { useCallback, useEffect, useRef, useState } from "react";
import { Text, type TextProps, Tooltip, useEventListener } from "@/ui-components";

type Props = Without<TextProps, "truncate" | "breakWord"> & {
  maxWidth?: number;
};

/**
 * Extend Text component with capability show content as tooltip when truncated
 */
export const TruncatedText2 = (props: Props) => {
  const { maxWidth, children, ...restProps } = props;
  const [isShowTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [innerText, setInnerText] = useState<string>(wrapperRef.current?.innerText || "");
  const handleShowTooltip = useCallback(() => {
    const textElement = wrapperRef.current?.children?.[0] as HTMLElement;
    if (
      textElement &&
      (textElement.scrollWidth > textElement.clientWidth || textElement.scrollHeight > textElement.clientHeight)
    ) {
      setInnerText(wrapperRef.current?.innerText || "");
      setShowTooltip(true);
    } else setShowTooltip(false);
  }, []);

  // check when init or props change
  useEffect(handleShowTooltip, [handleShowTooltip, restProps]);

  useEventListener("resize", handleShowTooltip);

  const contextMarkup = (
    <div ref={wrapperRef} style={{ maxWidth }}>
      <Text {...restProps} truncate>
        {children}
      </Text>
    </div>
  );

  return isShowTooltip ? (
    <Tooltip hoverDelay={200} dismissOnMouseOut content={innerText}>
      {contextMarkup}
    </Tooltip>
  ) : (
    contextMarkup
  );
};
