import React, { HTMLAttributes } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Stack, Text } from "@/ui-components";
import {
  ArrowChevronDuoDownIcon,
  ArrowChevronDuoRightIcon,
  GridVerticalRoundIcon,
  PenLineIcon,
  PlusCircleOutlineIcon,
  TrashFullIcon,
} from "@/ui-icons";

import { ConfirmModal } from "app/components/ConfirmModal";
import { TruncatedText2 } from "app/components/TruncatedText2";
import { useToggle } from "app/utils/useToggle";

import { FlattenedItem } from "../../type";
import { MAX_DEPTH_LINK } from "../../utils/contants";
import { flattenTree } from "../../utils/tree";

import { TooltipButton } from "./TooltipButton";

export interface Props extends Omit<HTMLAttributes<HTMLDivElement>, "id"> {
  clone?: boolean;
  depth: number;
  isDragging?: boolean;
  handleProps?: any;
  indentationWidth: number;
  data: FlattenedItem;
  onCollapse?: () => void;
  onRemove?: () => void;
  onAddChild?: () => void;
  onEdit?: () => void;
  contentBtnAdd?: string;
  wrapperRef?: (node: HTMLDivElement) => void;
}

export const TreeItem = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      clone,
      depth,
      isDragging,
      handleProps,
      indentationWidth,
      onCollapse,
      onRemove,
      onAddChild,
      onEdit,
      style,
      data,
      contentBtnAdd,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    const { value: isOpenDeleteModal, toggle: toggleDeleteModal } = useToggle(false);
    const countChild = flattenTree(data.children).filter((item) => !item.isButtonAdd).length;

    if (data.isButtonAdd) {
      return (
        <StyledWrapperButtonAdd
          ref={wrapperRef}
          style={
            {
              "--spacing": data.depth === 0 ? "0px" : `${56 + indentationWidth * (data.depth - 1)}px`,
              borderRadius: data.depth === 0 ? 6 : 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            } as React.CSSProperties
          }
          {...props}
        >
          <div
            ref={ref}
            style={{
              ...style,
            }}
          >
            <StyledButtonAdd>
              <Button icon={PlusCircleOutlineIcon} plain onClick={onAddChild}>
                Thêm liên kết{data.parent_id ? ` cho "${contentBtnAdd}"` : ""}
              </Button>
            </StyledButtonAdd>
          </div>
        </StyledWrapperButtonAdd>
      );
    }

    return (
      <StyledTreeItemWrapper
        ref={wrapperRef}
        style={
          {
            "--spacing":
              !clone && depth > 0 ? (depth === 1 ? `56px` : `${56 + indentationWidth * (depth - 1)}px`) : "0px",
          } as React.CSSProperties
        }
        clone={clone}
        {...props}
      >
        <div
          ref={ref}
          style={{
            ...style,
            zIndex: isDragging ? "9" : "",
            position: isDragging ? "relative" : "static",
          }}
        >
          {isDragging ? <StyledPositionBar /> : null}
          {!isDragging || clone ? (
            <StyledTreeItem
              isDragging={isDragging}
              clone={clone}
              style={{ borderLeft: depth > 0 ? "1px solid #e8eaeb" : "" }}
            >
              {clone && countChild > 0 ? (
                <StyledCountChild>
                  <Text as="span" variant="bodySm" fontWeight="medium">
                    {countChild}
                  </Text>
                </StyledCountChild>
              ) : null}
              <StyledCell>
                <StyledIconDrag {...handleProps}>
                  <GridVerticalRoundIcon />
                </StyledIconDrag>
                {onCollapse && depth < MAX_DEPTH_LINK ? (
                  <StyledIconShowChild>
                    {data.collapsed ? (
                      <ArrowChevronDuoDownIcon onClick={onCollapse} width={24} height={24} />
                    ) : (
                      <ArrowChevronDuoRightIcon onClick={onCollapse} width={24} height={24} />
                    )}
                  </StyledIconShowChild>
                ) : null}
                <Stack vertical spacing="none">
                  <TruncatedText2 lineClamp={1} as="span">
                    {data.title}
                  </TruncatedText2>
                  {data.alias ? (
                    <TruncatedText2 as="span" lineClamp={1} color="subdued" variant="bodySm">
                      {data.alias}
                    </TruncatedText2>
                  ) : null}
                </Stack>
              </StyledCell>
              {!clone && (
                <StyledCell>
                  <StyledActions>
                    {onEdit ? <TooltipButton icon={PenLineIcon} tooltip="Sửa liên kết" onClick={onEdit} /> : null}
                    {onRemove ? (
                      <TooltipButton icon={TrashFullIcon} tooltip="Xóa liên kết" onClick={toggleDeleteModal} />
                    ) : null}
                  </StyledActions>
                </StyledCell>
              )}
            </StyledTreeItem>
          ) : null}
          {isOpenDeleteModal ? (
            <ConfirmModal
              title="Xóa liên kết"
              body={
                <>
                  Bạn có chắc chắn muốn xóa liên kết <strong>{data.title}</strong>
                  {countChild > 0 ? (
                    <>
                      {" "}
                      và <strong>{countChild}</strong> liên kết con
                    </>
                  ) : null}
                  ?
                </>
              }
              open
              onDismiss={toggleDeleteModal}
              confirmAction={{
                destructive: true,
                content: "Xóa liên kết",
                onAction: onRemove,
              }}
            />
          ) : null}
        </div>
      </StyledTreeItemWrapper>
    );
  }
);

TreeItem.displayName = "TreeItem";

const StyledCell = styled.div`
  padding: ${(p) => `calc(${p.theme.spacing(3)} - ${p.theme.spacing(0.5)}) 0`};
  min-height: ${(p) => `calc(${p.theme.spacing(12)} + ${p.theme.spacing(2)})`};
  display: flex;
  gap: ${(p) => p.theme.spacing(3)};
  align-items: center;
`;

const StyledIconShowChild = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  width: ${(p) => p.theme.spacing(6)};
  height: ${(p) => p.theme.spacing(6)};
  &:hover,
  &:active {
    background-color: #ececec;
  }
  svg {
    width: ${(p) => p.theme.spacing(6)};
    height: ${(p) => p.theme.spacing(6)};
    color: ${(p) => p.theme.colors.icon};
  }
`;

const StyledIconDrag = styled(StyledIconShowChild)`
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const StyledTreeItem = styled.div<{ isDragging?: boolean; clone?: boolean }>`
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  gap: ${(p) => p.theme.spacing(4)};
  border-top: 1px solid #e8eaeb;
  ${(p) =>
    !p.clone
      ? css`
          ${StyledCell} {
            &:first-child {
              padding-left: ${p.theme.spacing(5)};
              ${p.theme.breakpoints.down("sm")} {
                padding-left: ${p.theme.spacing(4)};
              }
              flex: 1;
            }
            &:last-child {
              padding-right: ${p.theme.spacing(5)};
              ${p.theme.breakpoints.down("sm")} {
                padding-right: ${p.theme.spacing(4)};
              }
              justify-content: flex-end;
            }
          }
        `
      : css`
          position: relative;
          ${StyledCell} {
            padding: ${p.theme.spacing(4, 5)};
          }
          ${StyledIconDrag} {
            background-color: #ececec;
          }
        `}
  ${(p) =>
    p.isDragging &&
    css`
      &:not(.indicator) {
        opacity: 0.5;
      }
    `}
`;

const StyledTreeItemWrapper = styled.div<{ clone?: boolean }>`
  padding-left: var(--spacing);
  ${(p) =>
    p.clone &&
    css`
      display: flex;
      ${StyledTreeItem} {
        border: 1px solid #e8eaeb;

        ${StyledCell} {
          &:first-child {
            min-width: 200px;
            padding-right: ${p.theme.spacing(5)};
            width: 100%;
            max-width: initial;
          }
        }
      }
    `}
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};
  button {
    margin: 0;
    padding: 0;
    min-width: ${(p) => p.theme.spacing(8)};
    min-height: ${(p) => p.theme.spacing(8)};
  }
`;

const StyledCountChild = styled.span`
  position: absolute;
  right: 0%;
  border-radius: 50%;
  width: ${(p) => p.theme.spacing(6)};
  height: ${(p) => p.theme.spacing(6)};
  transform: translate(50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(p) => p.theme.colors.surface};
  background: ${(p) => p.theme.colors.textPrimary};
`;

const StyledPositionBar = styled.div`
  background: ${(p) => p.theme.colors.textPrimary};
  height: 2px;
  position: relative;
  ::before {
    width: 10px;
    height: 10px;
    content: "";
    border: 2px solid ${(p) => p.theme.colors.textPrimary};
    position: fixed;
    top: 2px;
    left: 0;
    transform: translate(-50%, calc(-50% - 1px));
    border-radius: 50%;
    background: ${(p) => p.theme.colors.surface};
    z-index: 1;
  }
`;

const StyledWrapperButtonAdd = styled.div`
  padding-left: var(--spacing);
`;

const StyledButtonAdd = styled.div`
  border-top: 1px solid ${(p) => p.theme.colors.borderDisabled};
  border-bottom: 1px solid ${(p) => p.theme.colors.borderDisabled};
  margin-bottom: -1px;
  border-left: 1px solid ${(p) => p.theme.colors.borderDisabled};
  background: ${(p) => p.theme.components.indexTable.headerBackgroundColor};
  padding: ${(p) => p.theme.spacing(3, 5)};
  overflow: hidden;
  position: relative;
  button {
    margin: 0;
    padding: 0;
  }
`;
