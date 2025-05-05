import React, { useCallback, useEffect, useRef } from "react";
import styled from "@emotion/styled";

import { MenuActionDescriptor, MenuGroupDescriptor } from "../../../types";
import { useI18n } from "../../../utils/i18n";
import { useEventListener } from "../../../utils/useEventListener";

import { SecondaryAction } from "./SecondaryAction";

export interface ActionsMeasurements {
  containerWidth: number;
  disclosureWidth: number;
  hiddenActionsWidths: number[];
}

export interface ActionsMeasurerProps {
  actions?: MenuActionDescriptor[];
  groups?: MenuGroupDescriptor[];
  handleMeasurement(measurements: ActionsMeasurements): void;
}

const ACTION_SPACING = 8;

export function ActionsMeasurer({
  actions = [],
  groups = [],
  handleMeasurement: handleMeasurementProp,
}: ActionsMeasurerProps) {
  const i18n = useI18n();
  const containerNode = useRef<HTMLDivElement>(null);

  const defaultRollupGroup: MenuGroupDescriptor = {
    title: i18n.translate("UI.Page.Actions.moreActions"),
    actions: [],
  };

  const activator = <SecondaryAction disclosure>{defaultRollupGroup.title}</SecondaryAction>;

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
  }, [handleMeasurement, actions, groups]);

  // we using icon "placeholder" to workaround for svg id conflict issue
  // see: https://github.com/gregberge/svgr/issues/322
  const actionsMarkup = actions.map(({ content, onAction, icon, ...rest }) => (
    <SecondaryAction key={content} onClick={onAction} {...rest} icon={icon ? "placeholder" : undefined}>
      {content}
    </SecondaryAction>
  ));

  const groupsMarkup = groups.map(({ title, icon }) => (
    <SecondaryAction key={title} disclosure icon={icon ? "placeholder" : undefined}>
      {title}
    </SecondaryAction>
  ));

  useEventListener("resize", handleMeasurement);

  return (
    <StyledActionsLayoutMeasurer ref={containerNode}>
      {actionsMarkup}
      {groupsMarkup}
      {activator}
    </StyledActionsLayoutMeasurer>
  );
}

const StyledActionsLayoutMeasurer = styled.div`
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 auto;
  gap: 0;
  padding: 0;
  visibility: hidden;
  height: 0;

  > * {
    flex: 0 0 auto;
  }
`;
