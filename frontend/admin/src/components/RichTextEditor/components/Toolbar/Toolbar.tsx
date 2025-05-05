/* eslint-disable react/no-unused-prop-types */
import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { ActionList, OptionList, Popover, PopoverCloseSource, useBreakpoints } from "@/ui-components";
import {
  ArrowExpandIcon,
  ArrowShrinkIcon,
  BoldIcon,
  CodeIcon,
  Ic24FormatIndentDecreaseIcon,
  Ic24FormatIndentIncreaseIcon,
  ImageAltIcon,
  ItalicIcon,
  Link02Icon,
  ListOlIcon,
  ListUlIcon,
  MoreHorizontalIcon,
  PlayCircleOutlineIcon,
  StarMultipleIcon,
  StopIcon,
  TableIcon,
  TextColorIcon,
  UnderlineIcon,
} from "@/ui-icons";

import { RgbColorPicker } from "app/components/RgbColorPicker";
import { filterNonNull } from "app/utils/arrays";
import { useAIPermission } from "app/utils/useAIPermission";

import { useMeasureElements } from "../../../useMeasureElements";
import {
  Action,
  ExclusionType,
  fontSizeList,
  GroupAction,
  headingList,
  LinkSelectionTypes,
  ModalNames,
  PopoverActionType,
  textAligmentList,
  TextModifierTypes,
  TextStyleTypes,
  TypographyElement,
} from "../../types";
import { ActionButton } from "../ActionButton";
import { ActionSection, StyledOverflowContainer } from "../ActionSection";
import { RewriteList, RewriteSuggestPopoverContent, SuggestPopoverContent } from "../AISuggest";
import { useAIContext } from "../AISuggest/context";
import { HeadingList } from "../HeadingList";
import { TooltipButton } from "../TooltipButton";

type Props = {
  id: string;
  selectedBold?: boolean;
  selectedItalic?: boolean;
  selectedUnderline?: boolean;
  selectedTypographicElement?: TypographyElement;
  selectedFontSize?: string;
  selectedTextAligment?: string;
  selectedTextColor?: string;
  selectedBackgroundColor?: string;
  isShowHTML?: boolean;
  isReadOnly?: boolean;
  popoverVisible?: PopoverActionType;
  linkSelectionType?: LinkSelectionTypes;
  imageSelected?: boolean;
  selectedOrderedList?: boolean;
  selectedUnorderedList?: boolean;
  tableSelected?: boolean;
  overflowVisible: boolean;
  isFullscreen?: boolean;
  exclusions?: ExclusionType[];
  hasSelection?: boolean;
  onOpenPopover(type: PopoverActionType, overflow?: boolean): void;
  onClosePopover(): void;
  onNodeSelect(command: string): void;
  executeCommand(command: string, value?: string, options?: any): void;
  onToggleHTML(): void;
  onColorChange(colorType: string, colorValue: string): void;
  openModal(modalName: ModalNames): () => void;
  onToggleOverflow(): void;
  onToggleFullscreen(): void;
};

export type ToolbarRef = {
  remeasureElements(): void;
};

export const Toolbar = React.memo(
  React.forwardRef<ToolbarRef, Props>(function Toolbar(
    {
      id,
      selectedBold,
      selectedItalic,
      selectedUnderline,
      selectedTypographicElement,
      selectedFontSize,
      selectedTextAligment,
      selectedTextColor,
      selectedBackgroundColor,
      isShowHTML,
      isReadOnly,
      popoverVisible,
      linkSelectionType,
      imageSelected,
      selectedOrderedList,
      selectedUnorderedList,
      tableSelected,
      overflowVisible,
      isFullscreen,
      exclusions,
      hasSelection,
      onClosePopover,
      executeCommand,
      onNodeSelect,
      onOpenPopover,
      onToggleHTML,
      onColorChange,
      openModal,
      onToggleOverflow,
      onToggleFullscreen,
    },
    ref
  ) {
    const { extraContext, context } = useAIContext();
    const { lgUp } = useBreakpoints();
    const { hasAIPermission } = useAIPermission();
    const isDisabledAction = isShowHTML || isReadOnly;

    const containerNode = useRef<HTMLDivElement>(null);
    const measurerNode = useRef<HTMLDivElement>(null);

    const { childrenThatFit, remeasureElements } = useMeasureElements({
      containerNode,
      measurerNode,
      overflowOffsetWidth: 64,
    });

    useImperativeHandle(ref, () => ({
      remeasureElements,
    }));

    const createCommand =
      (command: string, value?: string, closePopover = true, skipFocus = false) =>
      () => {
        executeCommand(
          command,
          value,
          skipFocus
            ? {
                skip_focus: true,
              }
            : undefined
        );
        if (closePopover) {
          onClosePopover?.();
        }
      };

    const createTextModifierAction = (command: string) => () => {
      createCommand(command)();
      onNodeSelect(command);
    };

    const handleSelectTypographicAction = (element: TypographyElement) => {
      createCommand("formatBlock", element)();
    };

    const handleSelectFontSizeAction = (size: string) => {
      createCommand("FontSize", size)();
      onNodeSelect(TextStyleTypes.SelectNode);
    };

    const createSelectTextAligmentAction = (command: string) => () => {
      createCommand(command)();
      onNodeSelect(TextStyleTypes.SelectNode);
    };

    const createColorChangeAction = (colorType: string) => (colorValue: string) => {
      createCommand(colorType, colorValue, false)();
      onColorChange(colorType, colorValue);
    };

    const handleInsertTable = () => {
      onClosePopover();
      openModal(ModalNames.InsertTable)();
    };

    const handleCloseOverflow = (source: PopoverCloseSource) => {
      if (isFullscreen && source === PopoverCloseSource.ScrollOut) {
        return;
      }
      if (popoverVisible === undefined && overflowVisible) {
        onToggleOverflow();
      }
    };

    useEffect(() => {
      window.addEventListener("resize", remeasureElements);
      return () => {
        window.removeEventListener("resize", remeasureElements);
      };
    }, [remeasureElements]);

    useEffect(() => {
      remeasureElements();
    }, [isFullscreen, remeasureElements]);

    const createListStypeAction = (type: TextModifierTypes.UnorderedList | TextModifierTypes.OrderedList) =>
      type === TextModifierTypes.UnorderedList
        ? () => {
            selectedOrderedList && createTextModifierAction(TextModifierTypes.OrderedList)();
            createTextModifierAction(TextModifierTypes.UnorderedList)();
          }
        : () => {
            selectedUnorderedList && createTextModifierAction(TextModifierTypes.UnorderedList)();
            createTextModifierAction(TextModifierTypes.OrderedList)();
          };

    const formatSelectedLabel = headingList.find(({ key }) => key === selectedTypographicElement)?.label ?? "Đoạn";
    const selectedFontSizeLabel = fontSizeList.find(({ value }) => value === selectedFontSize)?.label ?? "14";
    const selectedTextAligmentIcon =
      textAligmentList.find(({ value }) => value === selectedTextAligment)?.icon ?? textAligmentList[0].icon;

    const exclusionsMap = useMemo(() => {
      const result = new Map<ExclusionType, boolean>();
      (exclusions || []).forEach((x) => {
        result.set(x, true);
      });
      return result;
    }, [exclusions]);

    let linkAction: Action;
    switch (linkSelectionType) {
      case LinkSelectionTypes.Insert: {
        linkAction = {
          label: "Chèn liên kết",
          icon: Link02Icon,
          onClick: openModal(ModalNames.UpdateLink),
          pressed: false,
          disabled: isDisabledAction,
        };
        break;
      }
      case LinkSelectionTypes.Edit: {
        linkAction = {
          label: "Sửa liên kết",
          icon: Link02Icon,
          onClick: openModal(ModalNames.UpdateLink),
          pressed: false,
          disabled: isDisabledAction,
        };
        break;
      }
      case LinkSelectionTypes.Empty:
      default: {
        linkAction = {
          label: "Sửa liên kết",
          icon: Link02Icon,
          onClick: openModal(ModalNames.UpdateLink),
          pressed: false,
          disabled: true,
        };
        break;
      }
    }

    const imageAction: Action = imageSelected
      ? {
          label: "Sửa ảnh",
          icon: ImageAltIcon,
          onClick: openModal(ModalNames.EditImage),
          pressed: false,
          disabled: isDisabledAction,
        }
      : {
          label: "Chèn ảnh",
          icon: ImageAltIcon,
          onClick: openModal(ModalNames.InsertImage),
          pressed: false,
          disabled: isDisabledAction,
        };

    const videoAction: Action | undefined = !exclusionsMap.has("video")
      ? {
          label: "Chèn video",
          icon: PlayCircleOutlineIcon,
          onClick: openModal(ModalNames.InsertVideo),
          pressed: false,
          disabled: isDisabledAction,
        }
      : undefined;

    const tableActionDisabled = !tableSelected;
    const tableAction: Action = {
      label: "Bảng",
      icon: TableIcon,
      pressed: popoverVisible === PopoverActionType.Table,
      disabled: isDisabledAction,
      popover: {
        key: PopoverActionType.Table,
        active: popoverVisible === PopoverActionType.Table,
        fullHeight: true,
        children: (
          <ActionList
            sections={[
              {
                items: [
                  {
                    content: "Chèn bảng",
                    onAction: handleInsertTable,
                  },
                ],
              },
              {
                items: [
                  {
                    content: "Chèn hàng lên trên",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableInsertRowBefore"),
                  },
                  {
                    content: "Chèn hàng xuống dưới",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableInsertRowAfter"),
                  },
                  {
                    content: "Chèn cột bên phải",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableInsertColBefore"),
                  },
                  {
                    content: "Chèn cột bên trái",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableInsertColAfter"),
                  },
                ],
              },
              {
                items: [
                  {
                    content: "Gộp hàng/cột",
                    onAction: createCommand("mceTableMergeCells"),
                    disabled: tableActionDisabled,
                  },
                  {
                    content: "Tách hàng/cột",
                    onAction: createCommand("mceTableSplitCells"),
                    disabled: tableActionDisabled,
                  },
                ],
              },
              {
                items: [
                  {
                    content: "Xóa hàng",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableDeleteRow"),
                  },
                  {
                    content: "Xóa cột",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableDeleteCol"),
                  },
                  {
                    content: "Xóa bảng",
                    disabled: tableActionDisabled,
                    onAction: createCommand("mceTableDelete"),
                  },
                ],
              },
            ]}
          />
        ),
      },
    };

    const groupActions = filterNonNull<GroupAction>([
      hasAIPermission && context
        ? {
            key: "ai",
            items: [
              hasSelection && !extraContext?.isShortContext
                ? {
                    label: "AI",
                    icon: StarMultipleIcon,
                    pressed:
                      popoverVisible === PopoverActionType.AIRewrite ||
                      popoverVisible === PopoverActionType.AIRewriteList,
                    disabled: isDisabledAction,
                    magic: true,
                    popover:
                      popoverVisible === PopoverActionType.AIRewrite
                        ? {
                            key: PopoverActionType.AIRewrite,
                            active: true,
                            children: <RewriteSuggestPopoverContent />,
                            fluidContent: true,
                            preferredAlignment: "left",
                          }
                        : {
                            key: PopoverActionType.AIRewriteList,
                            active: popoverVisible === PopoverActionType.AIRewriteList,
                            children: (
                              <RewriteList
                                onChange={() => {
                                  if (lgUp) {
                                    onOpenPopover(PopoverActionType.AIRewrite);
                                  } else {
                                    openModal(ModalNames.AIRewriteSuggest)();
                                    onClosePopover();
                                  }
                                }}
                              />
                            ),
                            fluidContent: true,
                            preferredAlignment: "left",
                          },
                  }
                : {
                    label: "AI",
                    icon: StarMultipleIcon,
                    pressed: popoverVisible === PopoverActionType.AISuggest,
                    disabled: isDisabledAction,
                    magic: true,
                    onClick: !lgUp ? openModal(ModalNames.AISuggest) : undefined,
                    popover: lgUp
                      ? {
                          key: PopoverActionType.AISuggest,
                          active: popoverVisible === PopoverActionType.AISuggest,
                          children: <SuggestPopoverContent />,
                          fluidContent: true,
                          preferredAlignment: "left",
                        }
                      : undefined,
                  },
            ],
          }
        : null,
      ...(!exclusionsMap.has("font-size")
        ? [
            {
              key: "code",
              items: [
                {
                  label: "Mã HTML",
                  icon: CodeIcon,
                  pressed: isShowHTML,
                  onClick: onToggleHTML,
                },
              ],
            },
          ]
        : []),
      {
        key: "formatting",
        items: [
          {
            label: "Định dạng",
            content: formatSelectedLabel,
            pressed: popoverVisible === PopoverActionType.Formatting,
            disabled: isDisabledAction,
            popover: {
              key: PopoverActionType.Formatting,
              active: popoverVisible === PopoverActionType.Formatting,
              fullHeight: true,
              children: (
                <HeadingList
                  selected={selectedTypographicElement}
                  options={headingList}
                  onSelect={handleSelectTypographicAction}
                />
              ),
            },
          },
        ],
      },
      {
        key: "text-modifiers",
        items: [
          ...(!exclusionsMap.has("font-size")
            ? [
                {
                  label: "Cỡ chữ",
                  content: selectedFontSizeLabel,
                  pressed: popoverVisible === PopoverActionType.FontSize,
                  disabled: isDisabledAction,
                  icon: "placeholder",
                  popover: {
                    key: PopoverActionType.FontSize,
                    active: popoverVisible === PopoverActionType.FontSize,
                    children: (
                      <OptionList
                        selected={selectedFontSize ? [selectedFontSize] : []}
                        options={fontSizeList}
                        onChange={(selected) => handleSelectFontSizeAction(selected[0])}
                      />
                    ),
                  },
                } satisfies Action,
              ]
            : []),
          {
            label: "In đậm",
            icon: BoldIcon,
            pressed: selectedBold,
            disabled: isDisabledAction,
            onClick: createTextModifierAction(TextModifierTypes.Bold),
          },
          {
            label: "Chữ nghiêng",
            icon: ItalicIcon,
            pressed: selectedItalic,
            disabled: isDisabledAction,
            onClick: createTextModifierAction(TextModifierTypes.Italic),
          },
          {
            label: "Gạch chân",
            icon: UnderlineIcon,
            pressed: selectedUnderline,
            disabled: isDisabledAction,
            onClick: createTextModifierAction(TextModifierTypes.Underline),
          },
          {
            label: "Màu sắc",
            icon: TextColorIcon,
            pressed: popoverVisible === PopoverActionType.Color,
            disabled: isDisabledAction,
            popover: {
              key: PopoverActionType.Color,
              active: popoverVisible === PopoverActionType.Color,
              fullHeight: true,
              children: (
                <RgbColorPicker
                  withBackground
                  textColor={selectedTextColor}
                  backgroundColor={selectedBackgroundColor}
                  onTextChange={createColorChangeAction(TextStyleTypes.TextColor)}
                  onBackgroundChange={createColorChangeAction(TextStyleTypes.BackgroundColor)}
                  onColorPresetSelection={onClosePopover}
                />
              ),
            },
          },
        ],
      },
      {
        key: "text-alignment",
        items: [
          {
            label: "Căn chỉnh",
            icon: selectedTextAligmentIcon,
            pressed: popoverVisible === PopoverActionType.Aligment,
            disabled: isDisabledAction,
            popover: {
              key: PopoverActionType.Aligment,
              active: popoverVisible === PopoverActionType.Aligment,
              children: (
                <StyledOverflowContainer>
                  {textAligmentList.map((align) => (
                    <TooltipButton key={align.command} content={align.label}>
                      <ActionButton icon={align.icon} onClick={createSelectTextAligmentAction(align.command)} />
                    </TooltipButton>
                  ))}
                </StyledOverflowContainer>
              ),
            },
          },
        ],
      },
      {
        key: "insert-controls",
        items: [
          linkAction,
          ...(!exclusionsMap.has("image") ? [imageAction] : []),
          ...(videoAction ? [videoAction] : []),
        ],
      },
      {
        key: "list-formatting",
        items: [
          {
            label: "Đánh dấu dòng",
            icon: ListUlIcon,
            onClick: createListStypeAction(TextModifierTypes.UnorderedList),
            pressed: selectedUnorderedList,
            disabled: isDisabledAction,
          },
          {
            label: "Đánh số dòng",
            icon: ListOlIcon,
            onClick: createListStypeAction(TextModifierTypes.OrderedList),
            pressed: selectedOrderedList,
            disabled: isDisabledAction,
          },
          {
            label: "Thụt lề",
            icon: Ic24FormatIndentDecreaseIcon,
            onClick: createCommand("outdent"),
            pressed: false,
            disabled: isDisabledAction,
          },
          {
            label: "Đẩy lề",
            icon: Ic24FormatIndentIncreaseIcon,
            onClick: createCommand("indent"),
            pressed: false,
            disabled: isDisabledAction,
          },
          ...(!exclusionsMap.has("table") ? [tableAction] : []),
        ],
      },
      ...(!exclusionsMap.has("clear-formatting")
        ? [
            {
              key: "clear-formatting",
              items: [
                {
                  label: "Xóa định dạng",
                  icon: StopIcon,
                  onClick: createCommand("removeformat"),
                  pressed: false,
                  disabled: isDisabledAction,
                },
              ],
            },
          ]
        : []),
    ]);

    const additionGroupAction: GroupAction = {
      key: "addition",
      items: [
        ...(!exclusionsMap.has("fullscreen")
          ? [
              {
                label: isFullscreen ? "Thu nhỏ" : "Toàn màn hình",
                icon: isFullscreen ? ArrowShrinkIcon : ArrowExpandIcon,
                pressed: false,
                onClick: onToggleFullscreen,
              },
            ]
          : []),
      ],
    };

    const visibleActionGroups = childrenThatFit > 0 ? groupActions.slice(0, childrenThatFit) : groupActions;

    const disclosureActionGroups =
      childrenThatFit < groupActions.length && groupActions.slice(childrenThatFit, groupActions.length);

    const moreActionMarkup = (
      <ActionButton
        icon={MoreHorizontalIcon}
        onClick={onToggleOverflow}
        pressed={overflowVisible}
        disabled={isDisabledAction}
      />
    );
    const disclosureActionGroupsMarkup = disclosureActionGroups && (
      <StyledOverflow>
        <Popover active={overflowVisible} onClose={handleCloseOverflow} activator={moreActionMarkup}>
          <StyledOverflowContainer>
            {disclosureActionGroups.map((section) => (
              <ActionSection
                key={section.key}
                overflow
                section={section}
                popoverVisible={popoverVisible}
                onOpenPopover={onOpenPopover}
                onClosePopover={onClosePopover}
              />
            ))}
          </StyledOverflowContainer>
        </Popover>
      </StyledOverflow>
    );
    const flattedSection = groupActions.map((group) => {
      const cloned = { ...group };
      cloned.items = group.items?.map(({ popover, ...rest }) => ({
        ...rest,
        ...(popover && {
          popover: {
            ...popover,
            active: false,
            children: null,
          },
        }),
      }));
      return cloned;
    });
    return (
      <StyledToolbar id={`richtexteditor_toolbar_${id}`} isFullscreen={isFullscreen}>
        <StyledLayout>
          <StyledControlsContainer ref={containerNode}>
            <StyledControls>
              {visibleActionGroups.map((group) => (
                <ActionSection
                  key={group.key}
                  section={group}
                  popoverVisible={popoverVisible}
                  onOpenPopover={onOpenPopover}
                  onClosePopover={onClosePopover}
                />
              ))}
            </StyledControls>
            {disclosureActionGroupsMarkup}
          </StyledControlsContainer>

          {additionGroupAction.items?.length ? (
            <StyledAdditionActionsContainer>
              <StyledControls>
                <ActionSection
                  key={additionGroupAction.key}
                  section={additionGroupAction}
                  popoverVisible={popoverVisible}
                  onOpenPopover={onOpenPopover}
                  onClosePopover={onClosePopover}
                />
              </StyledControls>
            </StyledAdditionActionsContainer>
          ) : null}
        </StyledLayout>
        <StyledMeasurer ref={measurerNode}>
          {flattedSection.map((section) => (
            <ActionSection
              key={section.key}
              section={section}
              popoverVisible={popoverVisible}
              onOpenPopover={onOpenPopover}
              onClosePopover={onClosePopover}
            />
          ))}
        </StyledMeasurer>
      </StyledToolbar>
    );
  })
);

const StyledToolbar = styled.div<{
  isFullscreen?: boolean;
}>`
  padding: 0.375rem ${(p) => p.theme.spacing(2)};
  border: none;
  border-radius: ${(p) => p.theme.shape.borderRadius("large")} ${(p) => p.theme.shape.borderRadius("large")} 0 0;
  background: ${(p) => p.theme.colors.background};
  ${(p) =>
    p.isFullscreen &&
    css`
      border-radius: 0;
    `}
`;
const StyledLayout = styled.div`
  display: flex;
  align-items: center;
`;
const StyledControlsContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 100%;
  max-width: 100%;
  min-width: 0;
`;

const StyledControls = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  min-width: 0;
  gap: ${(p) => p.theme.spacing(2)};
  overflow: hidden;
`;

const StyledMeasurer = styled.div`
  display: none;
`;

const StyledOverflow = styled.div`
  display: flex;
  align-items: center;
  &::before {
    content: "";
    display: block;
    height: 1.25rem;
    margin: 0 ${(p) => p.theme.spacing(1)};
    border-left: ${(p) => p.theme.shape.borderDivider};
  }

  > div {
    display: flex;
    align-items: center;
  }
`;

const StyledAdditionActionsContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: ${(p) => p.theme.spacing(1)};
  padding-left: ${(p) => p.theme.spacing(2)};
`;
