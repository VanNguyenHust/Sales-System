import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

import { ActionListItemDescriptor, ActionListSection, MenuActionDescriptor, MenuGroupDescriptor } from "../../../types";
import { useI18n } from "../../../utils/i18n";

import { ActionsMeasurements, ActionsMeasurer } from "./ActionsMeasurer";
import { MenuGroup } from "./MenuGroup";
import { SecondaryAction } from "./SecondaryAction";
import { getVisibleAndHiddenActionsIndices } from "./utils";

interface Props {
  actions?: MenuActionDescriptor[];
  groups?: MenuGroupDescriptor[];
  onActionRollup?(hasRolledUp: boolean): void;
}
interface ActionsState {
  visibleActions: number[];
  hiddenActions: number[];
  visibleGroups: number[];
  hiddenGroups: number[];
  actionsWidths: number[];
  containerWidth: number;
  disclosureWidth: number;
  hasMeasured: boolean;
}

export function Actions({ actions, groups, onActionRollup }: Props) {
  const i18n = useI18n();
  const rollupActiveRef = useRef<boolean | null>(null);
  const [activeMenuGroup, setActiveMenuGroup] = useState<string | undefined>(undefined);

  const [state, setState] = useReducer(
    (data: ActionsState, partialData: Partial<ActionsState>): ActionsState => {
      return { ...data, ...partialData };
    },
    {
      disclosureWidth: 0,
      containerWidth: Infinity,
      actionsWidths: [],
      visibleActions: [],
      hiddenActions: [],
      visibleGroups: [],
      hiddenGroups: [],
      hasMeasured: false,
    }
  );

  const {
    visibleActions,
    hiddenActions,
    visibleGroups,
    hiddenGroups,
    containerWidth,
    disclosureWidth,
    actionsWidths,
    hasMeasured,
  } = state;

  const defaultRollupGroup: MenuGroupDescriptor = {
    title: i18n.translate("UI.Page.Actions.moreActions"),
    actions: [],
  };

  const handleMenuGroupToggle = useCallback(
    (group: string) => setActiveMenuGroup(activeMenuGroup ? undefined : group),
    [activeMenuGroup]
  );

  const handleMenuGroupClose = useCallback(() => setActiveMenuGroup(undefined), []);

  useEffect(() => {
    if (containerWidth === 0) {
      return;
    }
    const { visibleActions, visibleGroups, hiddenActions, hiddenGroups } = getVisibleAndHiddenActionsIndices(
      actions,
      groups,
      disclosureWidth,
      actionsWidths,
      containerWidth
    );
    setState({
      visibleActions,
      visibleGroups,
      hiddenActions,
      hiddenGroups,
      hasMeasured: containerWidth !== Infinity,
    });
  }, [containerWidth, disclosureWidth, actions, groups, actionsWidths, setState]);

  const actionsOrDefault = useMemo(() => actions ?? [], [actions]);
  const groupsOrDefault = useMemo(() => groups ?? [], [groups]);

  const actionsMarkup = actionsOrDefault
    .filter((_, index) => {
      if (!visibleActions.includes(index)) {
        return false;
      }

      return true;
    })
    .map((action) => {
      const { content, onAction, ...rest } = action;

      return (
        <SecondaryAction key={content} onClick={onAction} {...rest}>
          {content}
        </SecondaryAction>
      );
    });

  const hiddenActionObjects = hiddenActions.map((index) => actionsOrDefault[index]).filter(Boolean);
  const hiddenGroupObjects = hiddenGroups.map((index) => groupsOrDefault[index]).filter(Boolean);

  const groupsToFilter =
    (hiddenGroups.length > 0 || hiddenActions.length > 0) &&
    !groupsOrDefault.some((group) => group.title === defaultRollupGroup.title)
      ? [...groupsOrDefault, defaultRollupGroup]
      : [...groupsOrDefault];

  const filteredGroups = groupsToFilter.filter((group, index) => {
    const hasNoGroupsProp = groupsOrDefault.length === 0;
    const isVisibleGroup = visibleGroups.includes(index);
    const isDefaultGroup = group.title === defaultRollupGroup.title;

    if (hasNoGroupsProp) {
      return hiddenActions.length > 0;
    }

    if (isDefaultGroup) {
      return true;
    }

    return isVisibleGroup;
  });

  const groupsMarkup = filteredGroups.map((group) => {
    const { title, actions: groupActions, ...rest } = group;
    const hasDefaultGroupInHidden = hiddenGroupObjects.some((item) => item.title === title);
    const isDefaultGroup = group.title === defaultRollupGroup.title;

    const allHiddenItems = [...hiddenActionObjects, ...hiddenGroupObjects];
    if (!isDefaultGroup) {
      // Render a normal MenuGroup with just its actions
      return (
        <MenuGroup
          key={title}
          title={title}
          active={title === activeMenuGroup}
          actions={groupActions}
          {...rest}
          onOpen={handleMenuGroupToggle}
          onClose={handleMenuGroupClose}
        />
      );
    }
    const [finalRolledUpActions, finalRolledUpSectionGroups] = allHiddenItems.reduce(
      ([actions, sections], action) => {
        if (isMenuGroup(action)) {
          sections.push({
            title: action.title,
            items: action.actions.map((sectionAction) => ({
              ...sectionAction,
              disabled: action.disabled || sectionAction.disabled,
            })),
          });
        } else {
          actions.push(action);
        }

        return [actions, sections];
      },
      [[] as ActionListItemDescriptor[], [] as ActionListSection[]]
    );

    let additionGroupActions = hasDefaultGroupInHidden ? [] : groupActions;
    if (finalRolledUpSectionGroups.length === 0 && finalRolledUpActions.length > 0) {
      finalRolledUpSectionGroups.push({
        title,
        items: groupActions.map((action) => ({
          ...action,
          disabled: action.disabled || rest.disabled,
        })),
      });
      additionGroupActions = [];
    }

    return (
      <MenuGroup
        key={title}
        title={title}
        active={title === activeMenuGroup}
        actions={[...finalRolledUpActions, ...additionGroupActions]}
        sections={finalRolledUpSectionGroups}
        {...rest}
        onOpen={handleMenuGroupToggle}
        onClose={handleMenuGroupClose}
      />
    );
  });

  const handleMeasurement = useCallback(
    (measurements: ActionsMeasurements) => {
      const { hiddenActionsWidths: actionsWidths, containerWidth, disclosureWidth } = measurements;

      const { visibleActions, hiddenActions, visibleGroups, hiddenGroups } = getVisibleAndHiddenActionsIndices(
        actionsOrDefault,
        groupsOrDefault,
        disclosureWidth,
        actionsWidths,
        containerWidth
      );

      if (onActionRollup) {
        const isRollupActive = hiddenActions.length > 0 || hiddenGroups.length > 0;
        if (rollupActiveRef.current !== isRollupActive) {
          onActionRollup(isRollupActive);
          rollupActiveRef.current = isRollupActive;
        }
      }
      setState({
        visibleActions,
        hiddenActions,
        visibleGroups,
        hiddenGroups,
        actionsWidths,
        containerWidth,
        disclosureWidth,
        hasMeasured: true,
      });
    },
    [actionsOrDefault, groupsOrDefault, onActionRollup]
  );

  const actionsMeasurer = <ActionsMeasurer actions={actions} groups={groups} handleMeasurement={handleMeasurement} />;

  return (
    <StyledActionsLayoutOuter>
      {actionsMeasurer}
      <StyledActionsLayout measuring={process.env.NODE_ENV === "test" ? false : !hasMeasured}>
        {actionsMarkup}
        {groupsMarkup}
      </StyledActionsLayout>
    </StyledActionsLayoutOuter>
  );
}

function isMenuGroup(
  actionOrMenuGroup: MenuGroupDescriptor | MenuActionDescriptor
): actionOrMenuGroup is MenuGroupDescriptor {
  return "title" in actionOrMenuGroup;
}

const StyledActionsLayoutOuter = styled.div`
  position: relative;
  width: 100%;
`;

const StyledActionsLayout = styled.div<{
  measuring?: boolean;
}>`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 auto;
  gap: ${(p) => p.theme.spacing(2)};

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
