import { useCallback, useLayoutEffect, useState } from "react";

type UseMeasureElementsOption = {
  containerNode: React.RefObject<HTMLElement>;
  measurerNode: React.RefObject<HTMLElement>;
  overflowOffsetWidth?: number;
};

type UseMeasureElementsReturn = {
  parentWidth: number;
  childWidths: number[];
  childrenThatFit: number;
  remeasureElements(): void;
};

export function useMeasureElements({
  containerNode,
  measurerNode,
  overflowOffsetWidth = 0,
}: UseMeasureElementsOption): UseMeasureElementsReturn {
  const [childrenThatFit, setChildrenThatFit] = useState(0);
  const [parentWidth, setParentWidth] = useState(0);
  const [childWidths, setChildWidths] = useState<number[]>([]);

  const remeasureElements = useCallback(() => {
    if (containerNode.current === null || measurerNode.current === null) {
      return;
    }
    setParentWidth(containerNode.current.offsetWidth);
    setChildWidths(getChildrenWidths(measurerNode.current));
  }, [containerNode, measurerNode]);

  useLayoutEffect(() => {
    if (!containerNode.current) {
      return;
    }
    let childIndex = 0;
    for (
      let width = 0;
      childIndex <= childWidths.length && width + childWidths[childIndex] + overflowOffsetWidth <= parentWidth;
      childIndex++
    ) {
      width += childWidths[childIndex];
    }
    setChildrenThatFit(childIndex);
  }, [childWidths, parentWidth, containerNode, overflowOffsetWidth]);

  useLayoutEffect(() => {
    remeasureElements();
  }, [remeasureElements]);

  return containerNode.current
    ? {
        parentWidth,
        childWidths,
        childrenThatFit,
        remeasureElements,
      }
    : {
        parentWidth: 0,
        childWidths: [],
        childrenThatFit: 0,
        remeasureElements: noop,
      };
}

function getChildrenWidths(measurerNode: HTMLElement) {
  const containerNode = document.createElement("div");
  containerNode.style.display = "inline-block";
  containerNode.style.position = "absolute";
  containerNode.style.visibility = "hidden";
  containerNode.style.zIndex = "-1";
  measurerNode.style.display = "flex";
  const clonedNode = measurerNode.cloneNode(true);
  measurerNode.style.display = "none";
  containerNode.appendChild(clonedNode);
  document.body.appendChild(containerNode);
  const result = Array.from((containerNode.firstChild as HTMLElement).children).map(
    (child) => (child as HTMLElement).offsetWidth
  );
  if (containerNode.parentNode) {
    containerNode.parentNode.removeChild(containerNode);
  }
  return result;
}

function noop() {}
