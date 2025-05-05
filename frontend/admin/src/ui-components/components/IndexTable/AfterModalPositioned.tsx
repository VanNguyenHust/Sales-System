import React, { ReactNode, useContext } from "react";

import { DialogPositionedContext } from "../Modal/context";

interface Props {
  children?: ReactNode;
}

export function AfterModalPositioned({ children }: Props) {
  const isPositioned = useContext(DialogPositionedContext);
  const content = isPositioned ? children : null;

  return <>{content}</>;
}
