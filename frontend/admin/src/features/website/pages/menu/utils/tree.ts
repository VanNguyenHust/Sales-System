import { arrayMove } from "@dnd-kit/sortable";

import { Link, LinkChange } from "app/features/website/types";

import { FlattenedItem, TreeItem, TreeItems } from "../type";

import { MAX_DEPTH_LINK, MIN_ID_BTN_ADD } from "./contants";

const getDragDepth = (offset: number, indentationWidth: number) => {
  return Math.round(offset / indentationWidth);
};

export const getProjection = (
  items: FlattenedItem[],
  dragOffset: number,
  indentationWidth: number,
  activeId?: number,
  overId?: number
) => {
  const overItemIndex = items.findIndex(({ id }) => id === overId);
  const activeItemIndex = items.findIndex(({ id }) => id === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;
  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }
  const getParentId = () => {
    if (depth === 0 || !previousItem) {
      return undefined;
    }
    if (depth === previousItem.depth) {
      return previousItem.parent_id;
    }
    if (depth > previousItem.depth) {
      return previousItem.id;
    }
    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parent_id;
    return newParent ?? undefined;
  };
  return { depth, maxDepth, minDepth, parentId: getParentId() };
};

const getMaxDepth = ({ previousItem }: { previousItem: FlattenedItem }) => {
  let maxDepth = 0;
  if (previousItem) {
    maxDepth = previousItem.depth + 1;
  }
  return maxDepth > MAX_DEPTH_LINK ? MAX_DEPTH_LINK : maxDepth;
};

const getMinDepth = ({ nextItem }: { nextItem: FlattenedItem }) => {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
};

const flatten = (items: TreeItems, parentId: number | undefined = undefined, depth = 0): FlattenedItem[] => {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [...acc, { ...item, parent_id: parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)];
  }, []);
};

export const flattenTree = (items: TreeItems): FlattenedItem[] => {
  return flatten(items);
};

export const buildTree = (flattenedItems: FlattenedItem[]): TreeItems => {
  const root: TreeItem = { id: -999999999, children: [] };
  const nodes: Record<string, TreeItem> = { [root.id ?? ""]: root };
  const items = flattenedItems.map((item) => ({ ...item, children: [] }));

  for (const item of items) {
    const { id, children, parent_id } = item;
    const parentId = item.parent_id ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children, parent_id };
    if (item.action) {
      item.previous_sibling_id =
        parent.children.length === 0 ? undefined : parent.children[parent.children.length - 1].id;
    }
    parent.children.push(item);
  }

  if (root.children.length === 1 && !root.children[0].isButtonAdd) {
    root.children.push({
      isButtonAdd: true,
      id: MIN_ID_BTN_ADD,
      children: [],
      parent_id: undefined,
      collapsed: true,
    });
  }

  return root.children;
};

export const findItem = (items: TreeItem[], itemId: number) => {
  return items.find(({ id }) => id === itemId);
};

export const findItemDeep = (items: TreeItems, itemId: number): TreeItem | undefined => {
  for (const item of items) {
    const { id, children } = item;
    if (id === itemId) {
      return item;
    }
    if (children.length) {
      const child = findItemDeep(children, itemId);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
};

export const removeItem = (items: TreeItems, id: number) => {
  const newItems = [];
  for (const item of items) {
    if (item.id === id) {
      continue;
    }
    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }
    if (item.children.length === 0) {
      item.alias = "";
    }
    newItems.push(item);
  }
  if (newItems.length === 1 && newItems[0].isButtonAdd) {
    return [];
  }
  return newItems;
};

export const setProperty = <T extends keyof TreeItem>(
  items: TreeItems,
  id: number,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
) => {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }
    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }
  return [...items];
};

const countChildren = (items: TreeItem[], count = 0): number => {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }
    return acc + 1;
  }, count);
};

export const getChildCount = (items: TreeItems, id: number) => {
  const item = findItemDeep(items, id);
  return item ? countChildren(item.children) : 0;
};

export const removeChildrenOf = (items: FlattenedItem[], ids: number[]) => {
  const excludeParentIds = [...ids];
  return items.filter((item) => {
    if (item.parent_id && excludeParentIds.includes(item.parent_id)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }
    return true;
  });
};

export const initDataTree = (links: Link[], parent_id?: number, treeItemsOld?: TreeItems): TreeItems => {
  const flattenedItems = flatten(treeItemsOld || []);
  const treeItems: TreeItems = [];
  for (const [index, value] of links.entries()) {
    const children = initDataTree(value.links, value.id, flattenedItems);
    treeItems.push({
      id: value.id,
      type: value.type,
      title: value.title,
      alias: value.handle_customized ? value.handle : "",
      subject: value.subject,
      subject_id: value.subject_id,
      subject_param: value.subject_param,
      parent_id,
      children:
        children.length > 0
          ? children
          : [
              {
                isButtonAdd: true,
                id: MIN_ID_BTN_ADD + value.id,
                children: [],
                parent_id: value.id,
                collapsed: true,
              },
            ],
      collapsed: treeItemsOld?.find((treeItem) => treeItem.id === value.id)?.collapsed ?? true,
    } as TreeItem);
    if (index === links.length - 1 && !treeItems.some((item) => item.isButtonAdd)) {
      treeItems.push({
        isButtonAdd: true,
        id: parent_id ? MIN_ID_BTN_ADD + parent_id : MIN_ID_BTN_ADD,
        children: [],
        parent_id: parent_id ? parent_id : undefined,
        collapsed: true,
      });
    }
  }
  return treeItems;
};

export const tryParseNumber = (value: string) => {
  if (value === undefined || value === null || value === "" || isNaN(Number(value))) {
    return undefined;
  }
  return Number(value);
};

export const flattenLinks = (links: Link[]): Link[] => {
  return links.reduce<Link[]>((acc, item) => {
    return [...acc, { ...item }, ...flattenLinks(item.links ?? [])];
  }, []);
};

export const buildLinksChange = (treeItems: TreeItems, links: Link[]) => {
  const linksFlatten = flattenLinks(links);
  const treeItemsFlatten = flattenTree(treeItems);

  const listChange: LinkChange[] = [];
  const itemsDelete = linksFlatten
    .filter((item) => !treeItemsFlatten.some((itemNew) => itemNew.id === item.id))
    .reverse();
  for (const item of itemsDelete) {
    listChange.push({
      id: item.id,
      action: "delete",
    });
  }

  const listChangeAlias: LinkChange[] = [];

  for (const treeItem of treeItemsFlatten) {
    if (treeItem.action) {
      const itemOld = linksFlatten.find((link) => link.id === treeItem.id);

      const isUpdateAlias =
        (itemOld && treeItem.alias && treeItem.alias !== itemOld.handle) ||
        (treeItem.action === "create" && treeItem.alias);

      const linkChange = {
        id: treeItem.id,
        type: treeItem.type,
        title: treeItem.title,
        action: treeItem.action,
        alias: treeItem.alias,
        subject_id: treeItem.subject_id,
        subject_param: treeItem.subject_param,
        subject: treeItem.subject,
        parent_id: treeItem.parent_id,
        previous_sibling_id: treeItem.previous_sibling_id,
      };

      listChange.push(isUpdateAlias ? { ...linkChange, alias: itemOld?.handle || "" } : linkChange);

      if (isUpdateAlias) {
        listChangeAlias.push({ ...linkChange, action: "update" });
      }
    }
  }

  return [...listChange, ...listChangeAlias];
};

export const getOverIndex = (clonedItems: FlattenedItem[], overIndex: number, depth: number): number => {
  const overIndexTemp = overIndex;
  const itemOver = clonedItems[overIndex];
  const itemPrevious = clonedItems[overIndex - 1];
  if (itemOver.isButtonAdd && itemOver.depth === depth) {
    return getOverIndex(clonedItems, overIndex - 1, depth);
  }
  if (itemPrevious?.isButtonAdd && itemPrevious?.depth === depth) {
    return overIndex - 1;
  }
  return overIndexTemp;
};
