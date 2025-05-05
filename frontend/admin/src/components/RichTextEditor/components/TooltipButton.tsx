import React, { useState } from "react";
import { Tooltip } from "@/ui-components";

type Props = {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
};

export const TooltipButton = ({ children, content, disabled }: Props) => {
  const [active, setActive] = useState<boolean | undefined>(undefined);
  if (disabled) {
    return <div>{children}</div>;
  }
  return (
    <Tooltip content={content} active={active} dismissOnMouseOut activatorWrapper="div">
      <div
        onMouseLeave={() => {
          setActive(undefined);
        }}
        onMouseDown={() => {
          setActive(false);
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};
