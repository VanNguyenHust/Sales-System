import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash-es";

import { useEventListener } from "../../utils/useEventListener";

interface ComputedProperty {
  [key: string]: number;
}

interface State {
  availableWidth: number;
  measurementButtonsWidth: ComputedProperty;
}

interface UseFilterControlMeasurementReturn extends State {
  refs: {
    container: React.RefObject<HTMLDivElement | null>;
    filterControl: React.RefObject<HTMLDivElement | null>;
    moreFilters: React.RefObject<HTMLDivElement | null>;
  };
}

const FILTER_FIELD_MIN_WIDTH = 150;

export function useFilterControlMeasurement(queryFieldHidden: boolean): UseFilterControlMeasurementReturn {
  const [availableWidth, setAvailableWidth] = useState<number>(0);
  const [measurementButtonsWidth, setMeasurementButtonsWidth] = useState<ComputedProperty>({});
  const measurementContainerRef = useRef<HTMLDivElement>(null);
  const filterControlRef = useRef<HTMLDivElement>(null);
  const moreFiltersContainerRef = useRef<HTMLDivElement>(null);

  const handleResize = useCallback(() => {
    if (measurementContainerRef.current) {
      const measurementButtonsWidth: ComputedProperty = {};
      // this number is magical, but tweaking it solved the problem of items overlapping
      const tolerance = 10;
      Array.from(measurementContainerRef.current.children).forEach((element: Element) => {
        const buttonWidth = element.getBoundingClientRect().width + tolerance;
        const buttonKey = element instanceof HTMLElement && element.dataset.key;
        if (buttonKey) {
          measurementButtonsWidth[buttonKey] = buttonWidth;
        }
      });
      setMeasurementButtonsWidth(measurementButtonsWidth);
    }

    if (filterControlRef.current && moreFiltersContainerRef.current) {
      const filterControlWidth = filterControlRef.current.getBoundingClientRect().width;
      const moreFiltersButtonWidth = moreFiltersContainerRef.current.getBoundingClientRect().width;

      const filterFieldMinWidth = queryFieldHidden ? 0 : FILTER_FIELD_MIN_WIDTH;

      const availableWidth = filterControlWidth - filterFieldMinWidth - moreFiltersButtonWidth;

      setAvailableWidth(availableWidth);
    }
  }, [queryFieldHidden]);

  const debouncedHandleResize = useMemo(() => debounce(handleResize), [handleResize]);

  useLayoutEffect(() => {
    handleResize();
  }, [handleResize]);

  useEventListener("resize", debouncedHandleResize);

  return {
    availableWidth,
    measurementButtonsWidth,
    refs: {
      container: measurementContainerRef,
      filterControl: filterControlRef,
      moreFilters: moreFiltersContainerRef,
    },
  };
}
