import React, { ReactNode, useContext, useEffect, useRef } from "react";

import { ScrollableContext } from "./context";

export interface ScrollToProps {
  /** Phần tử được đánh dấu */
  children?: ReactNode;
}

export const ScrollTo: React.FC<ScrollToProps> = ({ children }: ScrollToProps) => {
  const anchorNode = useRef<HTMLAnchorElement>(null);
  const scrollToPosition = useContext(ScrollableContext);

  useEffect(() => {
    if (!scrollToPosition || !anchorNode.current) {
      return;
    }

    scrollToPosition(anchorNode.current.offsetTop);
  }, [scrollToPosition]);

  const id = Math.random().toString(36).substring(3, 9);
  return (
    <>
      <a id={id} ref={anchorNode} />
      {children}
    </>
  );
};
