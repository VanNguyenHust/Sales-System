import type { MutableRefObject } from "react";

import { LinkChange } from "../../types";

export type TreeItem = Omit<LinkChange, "id" | "parent_id"> & {
  id: number;
  collapsed?: boolean;
  parent_id?: number;
  children: TreeItem[];
  isButtonAdd?: boolean;
};

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  depth: number;
  index: number;
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[];
  offset: number;
}>;
