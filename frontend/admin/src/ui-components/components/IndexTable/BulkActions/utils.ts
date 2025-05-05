import type { ActionListSection, MenuGroupDescriptor } from "../../../types";
import type { BulkAction, BulkActionListSection, BulkActionsProps } from "../types";

export function instanceOfMenuGroupDescriptor(action: MenuGroupDescriptor | BulkAction): action is MenuGroupDescriptor {
  return "title" in action && "actions" in action;
}

export function getVisibleAndHiddenActionsIndices(
  promotedActions: any[] = [],
  disclosureWidth: number,
  actionsWidths: number[],
  containerWidth: number,
  forceDisclosure?: boolean
) {
  const sumTabWidths = actionsWidths.reduce((sum, width) => sum + width, 0);
  const arrayOfPromotedActionsIndices = promotedActions.map((_, index) => {
    return index;
  });

  const visiblePromotedActions: number[] = [];
  const hiddenPromotedActions: number[] = [];

  if (containerWidth > sumTabWidths + (forceDisclosure ? disclosureWidth : 0)) {
    visiblePromotedActions.push(...arrayOfPromotedActionsIndices);
  } else {
    let accumulatedWidth = 0;
    let hasReturned = false;

    arrayOfPromotedActionsIndices.forEach((currentPromotedActionsIndex) => {
      const currentActionsWidth = actionsWidths[currentPromotedActionsIndex];
      const notEnoughSpace = accumulatedWidth + currentActionsWidth >= containerWidth - disclosureWidth;

      if (notEnoughSpace || hasReturned) {
        hiddenPromotedActions.push(currentPromotedActionsIndex);
        hasReturned = true;
        return;
      }

      visiblePromotedActions.push(currentPromotedActionsIndex);
      accumulatedWidth += currentActionsWidth;
    });
  }

  return {
    visiblePromotedActions,
    hiddenPromotedActions,
  };
}

export function instanceOfBulkActionListSection(
  action: BulkAction | BulkActionListSection
): action is BulkActionListSection {
  return "items" in action;
}

export function getActionSections(actions: BulkActionsProps["actions"]): BulkActionListSection[] | undefined {
  if (!actions || actions.length === 0) {
    return;
  }

  if (instanceOfBulkActionListSectionArray(actions)) {
    return actions;
  }

  if (instanceOfBulkActionArray(actions)) {
    return [
      {
        items: actions,
      },
    ];
  }
}

function instanceOfBulkActionListSectionArray(
  actions: (BulkAction | ActionListSection)[]
): actions is ActionListSection[] {
  const validList = actions.filter((action: any) => {
    return action.items;
  });

  return actions.length === validList.length;
}

function instanceOfBulkActionArray(actions: (BulkAction | BulkActionListSection)[]): actions is BulkAction[] {
  const validList = actions.filter((action: any) => {
    return !action.items;
  });

  return actions.length === validList.length;
}
