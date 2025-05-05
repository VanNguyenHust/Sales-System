import type { UniqueIdentifier } from "@dnd-kit/core";
import { type AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Props as TreeItemProps, TreeItem } from "./TreeItem";

interface Props extends TreeItemProps {
  id: UniqueIdentifier;
}

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

export const SortableTreeItem = ({ id, depth, ...props }: Props) => {
  const { attributes, isDragging, listeners, setDraggableNodeRef, setDroppableNodeRef, transform, transition } =
    useSortable({
      id,
      animateLayoutChanges,
    });

  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      depth={depth}
      isDragging={isDragging}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
};
