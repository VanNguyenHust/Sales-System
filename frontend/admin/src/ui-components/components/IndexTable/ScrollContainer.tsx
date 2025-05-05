import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { debounce } from "lodash-es";

import { ScrollContext, ScrollContextType, scrollDefaultContext } from "./context";

interface ScrollContainerProps {
  children: React.ReactNode;
  scrollableContainerRef: React.RefObject<HTMLDivElement>;
  onScroll(canScrollLeft: boolean, canScrollRight: boolean): void;
}

export function ScrollContainer({ children, scrollableContainerRef, onScroll }: ScrollContainerProps) {
  const [containerScroll, setContainerScroll] = useState<ScrollContextType>(scrollDefaultContext);
  useEffect(() => {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.dispatchEvent(new Event("scroll"));
    }
  }, [scrollableContainerRef]);

  const handleScroll = debounce(
    () => {
      if (!scrollableContainerRef.current) {
        return;
      }

      const availableScrollAmount =
        scrollableContainerRef.current.scrollWidth - scrollableContainerRef.current.offsetWidth;

      const canScrollLeft = scrollableContainerRef.current.scrollLeft > 0;
      const canScrollRight = scrollableContainerRef.current.scrollLeft < availableScrollAmount;
      onScroll(canScrollLeft, canScrollRight);
      setContainerScroll({
        scrollableContainer: scrollableContainerRef.current,
        canScrollLeft,
        canScrollRight,
      });
    },
    40,
    { trailing: true, leading: true, maxWait: 40 }
  );

  return (
    <ScrollContext.Provider value={containerScroll}>
      <StyledScrollContainer ref={scrollableContainerRef} onScroll={handleScroll}>
        {children}
      </StyledScrollContainer>
    </ScrollContext.Provider>
  );
}

export const StyledScrollContainer = styled.div`
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -ms-overflow-style: none;
  scrollbar-width: none;
  border-radius: inherit;
  &::-webkit-scrollbar {
    display: none;
  }
`;
