import { useMemo } from "react";

export const ELLIPSIS = -1;
export const usePaging = (numberOfPages: number, currentPage: number) => {
  return useMemo(() => {
    let items: number[];

    const maxNumberAppear = 7;
    if (numberOfPages <= maxNumberAppear) {
      items = getPageItems(1, numberOfPages);
    } else {
      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, numberOfPages - 1);

      const leftEllipsis = leftSiblingIndex > 2;
      const rightEllipsis = rightSiblingIndex < numberOfPages - 1;

      if (!leftEllipsis && rightEllipsis) {
        const leftNumbers = getPageItems(1, 5);
        items = [...leftNumbers, ELLIPSIS, numberOfPages];
      } else if (leftEllipsis && !rightEllipsis) {
        const rightNumbers = getPageItems(numberOfPages - 4, numberOfPages);
        items = [1, ELLIPSIS, ...rightNumbers];
      } else if (leftEllipsis && rightEllipsis) {
        items = [1, ELLIPSIS];
        const middleNumbers = getPageItems(leftSiblingIndex, rightSiblingIndex);
        items = [...items, ...middleNumbers, ELLIPSIS, numberOfPages];
      } else {
        items = getPageItems(1, numberOfPages);
      }
    }
    return {
      items: items.map((item) => ({
        active: item === currentPage,
        blank: item === ELLIPSIS,
        page: item,
      })),
      hasNext: currentPage < numberOfPages,
      hasPrevious: currentPage > 1,
    };
  }, [numberOfPages, currentPage]);
};

const getPageItems = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};
