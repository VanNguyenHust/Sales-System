import { useCallback, useEffect, useRef, useState } from "react";

import { arraysAreEqual } from "../../utils/arrays";

import { TabDescriptor } from "./types";

export interface TabMeasurements {
  container: number;
  disclosure: number;
  tabs: number[];
}

export function measureTab(tabs: TabDescriptor[], selected: number, measurement: TabMeasurements) {
  const sumTabWidths = measurement.tabs.reduce((sum, width) => sum + width, 0);
  const arrayOfTabIndices = tabs.map((_, index) => {
    return index;
  });

  const visibleTabs: number[] = [];
  const hiddenTabs: number[] = [];

  if (measurement.container >= sumTabWidths) {
    visibleTabs.push(...arrayOfTabIndices);
  } else {
    visibleTabs.push(selected);

    let tabListWidth = measurement.tabs[selected];

    arrayOfTabIndices.forEach((currentTabIndex) => {
      if (currentTabIndex !== selected) {
        const currentTabWidth = measurement.tabs[currentTabIndex];

        if (tabListWidth + currentTabWidth >= measurement.container - measurement.disclosure) {
          hiddenTabs.push(currentTabIndex);
          return;
        }

        visibleTabs.push(currentTabIndex);
        tabListWidth += currentTabWidth;
      }
    });
  }

  return {
    visibleTabs,
    hiddenTabs,
  };
}

interface State {
  visibleTabs: number[];
  hiddenTabs: number[];
}

export function useTab(tabs: TabDescriptor[], selected: number) {
  const [state, setState] = useState<State>({
    visibleTabs: [],
    hiddenTabs: [],
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);

  const handleMeasurement = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    animationFrame.current = requestAnimationFrame(() => {
      if (!containerRef.current) {
        return;
      }

      const tabWidths = Array.from(containerRef.current.children).map((node) =>
        Math.ceil(node.getBoundingClientRect().width)
      );
      const disclosureWidth = tabWidths.pop() || 0;

      const measurement: TabMeasurements = {
        container: containerRef.current.offsetWidth,
        disclosure: disclosureWidth,
        tabs: tabWidths,
      };
      const { visibleTabs, hiddenTabs } = measureTab(tabs, selected, measurement);
      setState((state) =>
        !arraysAreEqual(visibleTabs, state.visibleTabs)
          ? {
              hiddenTabs,
              visibleTabs,
            }
          : state
      );
    });
  }, [selected, tabs]);

  useEffect(() => {
    handleMeasurement();
    window.addEventListener("resize", handleMeasurement);
    return () => {
      window.removeEventListener("resize", handleMeasurement);
    };
  }, [handleMeasurement, tabs]);

  return {
    measurementContainerRef: containerRef,
    ...state,
  };
}
