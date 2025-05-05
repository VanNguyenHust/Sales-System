import { useEffect, useMemo, useRef, useState } from "react";
import {
  type Announcements,
  closestCenter,
  defaultDropAnimation,
  DndContext,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  type DropAnimation,
  MeasuringStrategy,
  type Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styled from "@emotion/styled";
import { Portal } from "@/ui-components";
import { isEqual } from "lodash-es";

import { FlattenedItem, SensorContext, TreeItems } from "../../type";
import {
  buildTree,
  flattenTree,
  getOverIndex,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "../../utils/tree";

import { SortableTreeItem } from "./SortableTreeItem";

const dropAnimationConfig: DropAnimation = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

interface Props {
  items?: TreeItems;
  indentationWidth?: number;
  onAddOrEdit: ({ parentId, item }: { parentId?: number; item?: FlattenedItem; previousSiblingId?: number }) => void;
  onChange: (items: TreeItems) => void;
}

export const SortableTree = ({ items = [], onAddOrEdit, onChange, indentationWidth = 36 }: Props) => {
  const [activeId, setActiveId] = useState<number>();
  const [overId, setOverId] = useState<number>();
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<{
    parentId?: number;
    overId?: number;
  } | null>(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce<number[]>(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
      []
    );
    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems);
  }, [activeId, items]);

  const projected =
    activeId && overId ? getProjection(flattenedItems, offsetLeft, indentationWidth, activeId, overId) : null;
  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const sensors = useSensors(useSensor(PointerSensor));

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems]);
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const announcements: Announcements = {
    onDragStart({ active }) {
      return `Picked up ${active.id}.`;
    },
    onDragMove({ active, over }) {
      return getMovementAnnouncement("onDragMove", Number(active.id), over?.id ? Number(over?.id) : undefined);
    },
    onDragOver({ active, over }) {
      return getMovementAnnouncement("onDragOver", Number(active.id), over?.id ? Number(over?.id) : undefined);
    },
    onDragEnd({ active, over }) {
      return getMovementAnnouncement("onDragEnd", Number(active.id), over?.id ? Number(over?.id) : undefined);
    },
    onDragCancel({ active }) {
      return `Moving was cancelled. ${active.id} was dropped in its original position.`;
    },
  };

  const handleDragStart = ({ active: { id: activeId } }: DragStartEvent) => {
    setActiveId(Number(activeId));
    setOverId(Number(activeId));

    const activeItem = flattenedItems.find(({ id }) => id === activeId);
    if (activeItem) {
      setCurrentPosition({
        parentId: activeItem.parent_id,
        overId: Number(activeId),
      });
    }
    document.body.style.setProperty("cursor", "grabbing");
  };

  const handleDragMove = ({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setOverId(over?.id ? Number(over?.id) : undefined);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();
    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)));
      const parent = flattenedItems.find((item) => item.id === parentId);
      let overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      if (parent?.isButtonAdd) {
        return;
      } else {
        overIndex = getOverIndex(
          clonedItems,
          clonedItems.findIndex(({ id }) => id === over.id),
          depth
        );
      }

      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];
      clonedItems[activeIndex] = {
        ...activeTreeItem,
        depth,
        parent_id: parentId,
      };

      if (
        isEqual(
          flattenedItems.filter((item) => !item.isButtonAdd),
          clonedItems.filter((item) => !item.isButtonAdd)
        )
      ) {
        return;
      }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const indexNew = sortedItems.findIndex(({ id }) => id === over.id);
      if (indexNew === overIndex && parentId === activeTreeItem.parent_id) {
        return;
      }

      if (sortedItems[overIndex].action !== "create") {
        sortedItems[overIndex].action = "update";
      }
      const newItems = buildTree(sortedItems);

      if (parentId) {
        onChange(
          setProperty(newItems, parentId, "collapsed", () => {
            return false;
          })
        );
      } else {
        onChange(newItems);
      }
    }
  };

  const handleDragCancel = () => {
    resetState();
  };

  const resetState = () => {
    setOverId(undefined);
    setActiveId(undefined);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty("cursor", "");
  };

  const handleRemove = (id: number) => {
    onChange(removeItem(items, id));
  };

  const handleCollapse = (id: number) => {
    onChange(
      setProperty(items, id, "collapsed", (value) => {
        return !value;
      })
    );
  };

  const getMovementAnnouncement = (eventName: string, activeId: number, overId?: number) => {
    if (overId && projected) {
      if (eventName !== "onDragEnd") {
        if (currentPosition && projected.parentId === currentPosition.parentId && overId === currentPosition.overId) {
          return;
        } else {
          setCurrentPosition({
            parentId: projected.parentId,
            overId,
          });
        }
      }

      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === overId);
      const activeIndex = clonedItems.findIndex(({ id }) => id === activeId);
      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

      const previousItem = sortedItems[overIndex - 1];

      let announcement;
      const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
      const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

      if (!previousItem) {
        const nextItem = sortedItems[overIndex + 1];
        announcement = `${activeId} was ${movedVerb} before ${nextItem.id}.`;
      } else {
        if (projected.depth > previousItem.depth) {
          announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
        } else {
          let previousSibling: FlattenedItem | undefined = previousItem;
          while (previousSibling && projected.depth < previousSibling.depth) {
            previousSibling = sortedItems.find(({ id }) => previousSibling && id === previousSibling.parent_id);
          }

          if (previousSibling) {
            announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
          }
        }
      }
      return announcement;
    }
    return;
  };

  const adjustTranslate: Modifier = ({ transform }) => {
    return {
      ...transform,
      y: transform.y - 25,
    };
  };

  return (
    <DndContext
      accessibility={{ announcements }}
      sensors={sensors}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.Always,
        },
      }}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      autoScroll={false}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map((item, index) => {
          let contentBtnAdd = "";
          if (item.isButtonAdd) {
            contentBtnAdd = item.parent_id
              ? flattenedItems.find((flatItem) => flatItem.id === item.parent_id)?.title || ""
              : "";
          }
          return (
            <StyledWrapper key={item.id}>
              <SortableTreeItem
                id={item.id}
                data={item}
                depth={item.id === activeId && projected ? projected.depth : item.depth}
                indentationWidth={indentationWidth}
                onCollapse={() => handleCollapse(item.id)}
                onRemove={() => handleRemove(item.id)}
                onAddChild={() => {
                  onAddOrEdit({
                    parentId: item.parent_id,
                    previousSiblingId: index > 0 ? flattenedItems[index - 1].id : undefined,
                  });
                }}
                contentBtnAdd={contentBtnAdd}
                onEdit={() => onAddOrEdit({ item })}
              />
            </StyledWrapper>
          );
        })}
        <Portal idPrefix="dragdrop">
          <DragOverlay dropAnimation={dropAnimationConfig} modifiers={[adjustTranslate]}>
            {activeId && activeItem ? (
              <SortableTreeItem
                id={activeId}
                depth={activeItem.depth}
                indentationWidth={indentationWidth}
                data={activeItem}
                clone
              />
            ) : null}
          </DragOverlay>
        </Portal>
      </SortableContext>
    </DndContext>
  );
};

const StyledWrapper = styled.div``;
