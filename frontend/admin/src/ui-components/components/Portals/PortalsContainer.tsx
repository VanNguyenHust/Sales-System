import React, { forwardRef, JSX, Ref } from "react";

export interface PolarisContainerProps {}

function PortalsContainerComponent(_props: PolarisContainerProps, ref: Ref<HTMLDivElement>): JSX.Element | null {
  return <div id="UIPortalsContainer" ref={ref} />;
}

export const PortalsContainer = forwardRef(PortalsContainerComponent);
