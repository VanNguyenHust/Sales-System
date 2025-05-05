import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Card, Text } from "@/ui-components";
import { BoxOpenIcon, PlusCircleOutlineIcon } from "@/ui-icons";

import { FlattenedItem, TreeItem, TreeItems } from "../type";
import { MAX_DEPTH_LINK, MIN_ID_BTN_ADD } from "../utils/contants";
import { buildTree, flattenTree } from "../utils/tree";

import { CreateOrEditLink, CreateOrEditLinkModal } from "./CreateOrEditLinkModal";
import { SortableTree } from "./SortableTree";

interface Props {
  treeItems: TreeItems;
  onUpdate: (treeItems: TreeItems) => void;
}

export const MenuTableList = ({ treeItems, onUpdate }: Props) => {
  const [openCreateEditModal, setOpenCreateEditModal] = useState<{
    open: boolean;
    data?: CreateOrEditLink;
  }>({
    open: false,
  });

  const [createId, setCreateId] = useState<number>(-1);

  const linksFirstScreen = (
    <StyledFirstScreen>
      <BoxOpenIcon />
      <Text as="p" color="subdued">
        Menu này chưa có liên kết nào
      </Text>
      <Button
        primary
        onClick={() =>
          setOpenCreateEditModal({
            open: true,
            data: {
              createId,
            },
          })
        }
        icon={PlusCircleOutlineIcon}
      >
        Thêm liên kết
      </Button>
    </StyledFirstScreen>
  );

  const handleAddOrEdit = (treeItem: TreeItem) => {
    const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(treeItems)));
    if (openCreateEditModal.data?.parentId) {
      const indexParent = clonedItems.findIndex((item) => item.id === openCreateEditModal.data?.parentId);
      const countChildParent = clonedItems.filter(
        (item) => item.parent_id === openCreateEditModal.data?.parentId && !item.isButtonAdd
      ).length;

      if (indexParent > -1) {
        const indexButtonAdd = clonedItems.findIndex(
          (item) => item.isButtonAdd && item.parent_id === openCreateEditModal.data?.parentId
        );
        clonedItems.splice(indexButtonAdd - 1, 0, {
          ...treeItem,
          collapsed: true,
          depth: clonedItems[indexParent].depth + 1,
          parent_id: openCreateEditModal.data?.parentId,
          index: countChildParent,
          id: createId,
          action: "create",
        });

        if (clonedItems[indexParent].depth + 1 <= MAX_DEPTH_LINK) {
          clonedItems.push({
            isButtonAdd: true,
            id: MIN_ID_BTN_ADD + createId,
            depth: clonedItems[indexParent].depth + 2,
            index: countChildParent + 1,
            children: [],
            parent_id: createId,
          });
        }

        if (clonedItems[indexParent].collapsed) {
          clonedItems[indexParent].collapsed = false;
        }

        setCreateId(createId - 1);
      }
    } else if (openCreateEditModal.data?.flattenedItem) {
      const indexItem = clonedItems.findIndex((item) => item.id === treeItem.id);
      if (indexItem > -1) {
        clonedItems[indexItem].alias = treeItem.alias;
        clonedItems[indexItem].subject = treeItem.subject;
        clonedItems[indexItem].subject_id = treeItem.subject_id;
        clonedItems[indexItem].subject_param = treeItem.subject_param;
        clonedItems[indexItem].title = treeItem.title;
        clonedItems[indexItem].type = treeItem.type;
        if (clonedItems[indexItem].action !== "create") {
          clonedItems[indexItem].action = "update";
        }
      }
    } else {
      clonedItems.splice(clonedItems.length - 1, 0, {
        ...treeItem,
        collapsed: true,
        depth: 0,
        index: 0,
        action: "create",
        id: createId,
      });

      clonedItems.push({
        isButtonAdd: true,
        id: MIN_ID_BTN_ADD + createId,
        depth: 0,
        index: 0,
        children: [],
        parent_id: createId,
      });
      setCreateId(createId - 1);
    }

    onUpdate(buildTree(clonedItems));
    setOpenCreateEditModal({ open: false });
  };

  return (
    <>
      <Card title="Danh sách liên kết">
        {treeItems.length === 0 ? (
          linksFirstScreen
        ) : (
          <StyledWrapper>
            <StyledListMenu>
              <SortableTree
                onChange={onUpdate}
                items={treeItems}
                onAddOrEdit={({ parentId, item, previousSiblingId }) =>
                  setOpenCreateEditModal({
                    open: true,
                    data: {
                      parentId,
                      flattenedItem: item,
                      previousSiblingId,
                      createId,
                    },
                  })
                }
              />
            </StyledListMenu>
          </StyledWrapper>
        )}
      </Card>
      {openCreateEditModal.open ? (
        <CreateOrEditLinkModal
          onClose={() =>
            setOpenCreateEditModal({
              open: false,
            })
          }
          onSubmitModal={handleAddOrEdit}
          data={openCreateEditModal.data}
        />
      ) : null}
    </>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${(p) => p.theme.spacing(4)};
`;

const StyledCell = styled.div`
  padding: ${(p) => p.theme.spacing(4, 0)};
  display: flex;
  gap: ${(p) => p.theme.spacing(3)};
  align-items: center;
`;

const StyledRow = styled.div`
  display: block;
`;

const StyledRowWrapper = styled.div`
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  gap: ${(p) => p.theme.spacing(4)};
  border-top: 1px solid ${(p) => p.theme.colors.borderDisabled};
  ${StyledCell} {
    &:first-child {
      padding-left: ${(p) => p.theme.spacing(5)};
      min-width: 200px;
      width: 100%;
    }
    &:nth-child(2) {
      min-width: 252px;
      max-width: 252px;
    }
    &:last-child {
      min-width: 132px;
      max-width: 132px;
      padding-right: ${(p) => p.theme.spacing(5)};
    }
  }
`;

const StyledListMenu = styled.div`
  margin: 0;
  padding: 0;
  background: #f6f6f6;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  ${StyledRowWrapper} + div {
    margin-left: ${(p) => `calc(${p.theme.spacing(12)} + ${p.theme.spacing(2)})`};
    ${StyledRow} {
      &:first-child {
        border-top: 0;
      }
    }
    ${StyledRowWrapper} + div {
      margin-left: ${(p) => `calc(${p.theme.spacing(8)} + ${p.theme.spacing(1)})`};
    }
  }
`;

const StyledFirstScreen = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${(p) => p.theme.spacing(8, 4)};
  align-items: center;
  gap: ${(p) => p.theme.spacing(2)};
  & > svg {
    width: 80px;
    height: 80px;
    color: ${(p) => p.theme.colors.iconSubdued};
  }
  button {
    margin-top: ${(p) => p.theme.spacing(2)};
  }
`;
