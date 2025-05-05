/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useRef } from "react";
import styled from "@emotion/styled";

import { useEventListener } from "../../../utils/useEventListener";

import { BulkActionButton } from "./BulkActionButton";
import type { BulkActionsProps } from "./BulkActions";
import { instanceOfMenuGroupDescriptor } from "./utils";

export interface ActionsMeasurements {
  containerWidth: number;
  disclosureWidth: number;
  hiddenActionsWidths: number[];
}

export interface ActionsMeasurerProps {
  promotedActions?: BulkActionsProps["promotedActions"];
  disabled?: BulkActionsProps["disabled"];
  activatorLabel: string;
  handleMeasurement(measurements: ActionsMeasurements): void;
}

const ACTION_SPACING = 16;

export function BulkActionsMeasurer({
  promotedActions = [],
  disabled,
  activatorLabel,
  handleMeasurement: handleMeasurementProp,
}: ActionsMeasurerProps) {
  const containerNode = useRef<HTMLDivElement>(null);

  const activator = <BulkActionButton isMoreAction disclosure content={activatorLabel} />;

  const handleMeasurement = useCallback(() => {
    if (!containerNode.current) {
      return;
    }

    const containerWidth = containerNode.current.offsetWidth;
    const hiddenActionNodes = containerNode.current.children;
    const hiddenActionNodesArray = Array.from(hiddenActionNodes);
    const hiddenActionsWidths = hiddenActionNodesArray.map((node) => {
      const buttonWidth = Math.ceil(node.getBoundingClientRect().width);
      return buttonWidth + ACTION_SPACING;
    });
    const disclosureWidth = hiddenActionsWidths.pop() || 0;

    handleMeasurementProp({
      containerWidth,
      disclosureWidth,
      hiddenActionsWidths,
    });
  }, [handleMeasurementProp]);

  useEffect(() => {
    handleMeasurement();
  }, [handleMeasurement, promotedActions]);

  const promotedActionsMarkup = promotedActions.map((action, index) => {
    if (instanceOfMenuGroupDescriptor(action)) {
      return <BulkActionButton key={index} disclosure content={action.title} />;
    }
    return <BulkActionButton key={index} disabled={disabled} {...action} />;
  });

  useEventListener("resize", handleMeasurement);

  return (
    <StyledBulkActionsMeasurerLayout ref={containerNode}>
      {promotedActionsMarkup}
      {activator}
    </StyledBulkActionsMeasurerLayout>
  );
}

const StyledBulkActionsMeasurerLayout = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 auto;
  gap: 0;
  padding: 0;
  visibility: hidden;
  height: 0;
  width: 100%;

  > * {
    flex: 0 0 auto;
  }
`;
