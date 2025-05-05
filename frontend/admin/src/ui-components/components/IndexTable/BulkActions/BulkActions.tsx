/* eslint-disable react/no-array-index-key */
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { MenuGroupDescriptor } from "../../../types";
import { useI18n } from "../../../utils/i18n";
import { ActionList } from "../../ActionList";
import { Checkbox } from "../../Checkbox";
import { Popover } from "../../Popover";
import { BulkAction, BulkActionListSection, BulkActionsProps as UIBulkActionsProps } from "../types";

import { BulkActionButton } from "./BulkActionButton";
import { BulkActionMenu } from "./BulkActionMenu";
import { ActionsMeasurements, BulkActionsMeasurer } from "./BulkActionsMeasurer";
import {
  getActionSections,
  getVisibleAndHiddenActionsIndices,
  instanceOfBulkActionListSection,
  instanceOfMenuGroupDescriptor,
} from "./utils";

export interface BulkActionsProps {
  label?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  selected?: boolean | "indeterminate";
  selectMode?: boolean;
  disabled?: boolean;
  actions?: UIBulkActionsProps["actions"];
  promotedActions?: UIBulkActionsProps["promotedActions"];
  onMoreActionPopoverToggle?(active: boolean): void;
  onToggleAll?(): void;
}

interface BulkActionsState {
  visiblePromotedActions: number[];
  hiddenPromotedActions: number[];
  actionsWidths: number[];
  containerWidth: number;
  disclosureWidth: number;
  hasMeasured: boolean;
}

export const BulkActions = ({
  label,
  prefix,
  suffix,
  selected,
  selectMode,
  disabled,
  actions = [],
  promotedActions = [],
  onMoreActionPopoverToggle,
  onToggleAll,
}: BulkActionsProps) => {
  const i18n = useI18n();
  const nodeRef = useRef<HTMLDivElement>(null);
  const [popoverActive, setPopoverActive] = useState(false);

  const [state, setState] = useReducer(
    (data: BulkActionsState, partialData: Partial<BulkActionsState>): BulkActionsState => {
      return { ...data, ...partialData };
    },
    {
      disclosureWidth: 0,
      containerWidth: Infinity,
      actionsWidths: [],
      visiblePromotedActions: [],
      hiddenPromotedActions: [],
      hasMeasured: false,
    }
  );

  const forceDisclosure = actions.length > 0;

  const { visiblePromotedActions, hiddenPromotedActions, containerWidth, disclosureWidth, actionsWidths, hasMeasured } =
    state;

  useEffect(() => {
    if (containerWidth === 0 || !promotedActions || promotedActions.length === 0) {
      return;
    }
    const { visiblePromotedActions, hiddenPromotedActions } = getVisibleAndHiddenActionsIndices(
      promotedActions,
      disclosureWidth,
      actionsWidths,
      containerWidth,
      forceDisclosure
    );
    setState({
      visiblePromotedActions,
      hiddenPromotedActions,
      hasMeasured: containerWidth !== Infinity,
    });
  }, [containerWidth, disclosureWidth, promotedActions, actionsWidths, forceDisclosure]);

  const handleMeasurement = useCallback(
    ({ hiddenActionsWidths: actionsWidths, containerWidth, disclosureWidth }: ActionsMeasurements) => {
      if (!promotedActions || promotedActions.length === 0) {
        setState({
          hasMeasured: true,
        });
        return;
      }

      const { visiblePromotedActions, hiddenPromotedActions } = getVisibleAndHiddenActionsIndices(
        promotedActions,
        disclosureWidth,
        actionsWidths,
        containerWidth,
        forceDisclosure
      );
      setState({
        visiblePromotedActions,
        hiddenPromotedActions,
        actionsWidths,
        containerWidth,
        disclosureWidth,
        hasMeasured: true,
      });
    },
    [promotedActions, forceDisclosure]
  );

  const togglePopover = useCallback(() => {
    onMoreActionPopoverToggle?.(popoverActive);
    setPopoverActive((popoverActive) => !popoverActive);
  }, [onMoreActionPopoverToggle, popoverActive]);

  const actionSections = getActionSections(actions);
  const promotedActionsMarkup = promotedActions
    ? promotedActions
        .filter((_, index) => visiblePromotedActions.includes(index))
        .map((action, index) => {
          if (instanceOfMenuGroupDescriptor(action)) {
            return <BulkActionMenu key={index} {...action} />;
          }
          return <BulkActionButton key={index} disabled={disabled} {...action} />;
        })
    : null;
  const moreActionLabel = promotedActions.length
    ? i18n.translate("UI.IndexTable.bulkActionDisclosureMore")
    : i18n.translate("UI.IndexTable.bulkActionDisclosure");

  const hiddenPromotedActionObjects = hiddenPromotedActions.map((index) => promotedActions?.[index]);

  const mergedHiddenPromotedActions = hiddenPromotedActionObjects.reduce((memo, action) => {
    if (!action) return memo;
    if (instanceOfMenuGroupDescriptor(action)) {
      return memo.concat(action.actions);
    }
    return memo.concat(action);
  }, [] as (BulkAction | MenuGroupDescriptor)[]);

  const hiddenPromotedSection = {
    items: mergedHiddenPromotedActions,
  };

  const allHiddenActions = useMemo(() => {
    if (actionSections) {
      return actionSections;
    }
    if (!actions) {
      return [];
    }
    let isAFlatArray = true;
    return actions
      .filter((action) => action)
      .reduce((memo: BulkActionListSection[], action: BulkAction | BulkActionListSection): BulkActionListSection[] => {
        if (instanceOfBulkActionListSection(action)) {
          isAFlatArray = false;
          return memo.concat(action);
        }
        if (isAFlatArray) {
          if (memo.length === 0) {
            return [{ items: [action] }];
          }
          const lastItem = memo[memo.length - 1];
          memo.splice(memo.length - 1, 1, {
            items: [...lastItem.items, action],
          });
          return memo;
        }

        isAFlatArray = true;

        return memo.concat({ items: [action] });
      }, []);
  }, [actions, actionSections]);

  const activator = (
    <BulkActionButton
      disclosure
      isMoreAction
      moreActionPressed={popoverActive}
      onAction={togglePopover}
      content={moreActionLabel}
      disabled={disabled}
    />
  );

  const actionsMarkup =
    allHiddenActions.length > 0 || hiddenPromotedSection.items.length > 0 ? (
      <Popover active={popoverActive} activator={activator} onClose={togglePopover}>
        <ActionList
          sections={
            hiddenPromotedSection.items.length > 0 ? [hiddenPromotedSection, ...allHiddenActions] : allHiddenActions
          }
          onActionAnyItem={togglePopover}
        />
      </Popover>
    ) : null;

  const measurerMarkup = (
    <BulkActionsMeasurer
      activatorLabel={moreActionLabel}
      promotedActions={promotedActions}
      disabled={disabled}
      handleMeasurement={handleMeasurement}
    />
  );
  const checkboxMarkup = <Checkbox label={label} disabled={disabled} checked={selected} onChange={onToggleAll} />;

  const prefixMarkup =
    prefix || suffix ? (
      <StyledPrefixWrapper>
        {prefix}
        {checkboxMarkup}
        {suffix}
      </StyledPrefixWrapper>
    ) : (
      checkboxMarkup
    );

  return selectMode ? (
    <StyledBulkActions ref={nodeRef}>
      {prefixMarkup}
      {(promotedActions.length > 0 || actions.length > 0) && (
        <StyledBulkActionsPromotedActionsWrapper>
          <StyledBulkActionsOuterLayout>
            {measurerMarkup}
            <StyledBulkActionsLayout measuring={process.env.NODE_ENV === "test" ? false : !hasMeasured}>
              {promotedActionsMarkup}
              {actionsMarkup}
            </StyledBulkActionsLayout>
          </StyledBulkActionsOuterLayout>
        </StyledBulkActionsPromotedActionsWrapper>
      )}
    </StyledBulkActions>
  ) : null;
};

const StyledPrefixWrapper = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(4)};
  align-items: center;
`;

const StyledBulkActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(8)};
  align-items: center;
  will-change: opacity;
  padding: calc(${(p) => p.theme.spacing(1)} + ${(p) => p.theme.spacing(0.5)}) 0;
  min-height: ${(p) => p.theme.spacing(12)};
`;

const StyledBulkActionsPromotedActionsWrapper = styled.div`
  flex: 1;
`;

const StyledBulkActionsOuterLayout = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
`;

const StyledBulkActionsLayout = styled.div<{
  measuring: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 1 1 auto;
  gap: ${(p) => p.theme.spacing(4)};

  > * {
    flex: 0 0 auto;
  }
  ${(p) =>
    p.measuring &&
    css`
      visibility: hidden;
      height: 0;
    `}
`;
