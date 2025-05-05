import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext, Draggable, Droppable, type DroppableProps } from "react-beautiful-dnd";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Card, Icon, Modal, OptionList, Scrollable, Tabs, Text, TextField, useBreakpoints } from "@/ui-components";
import { CloseBigIcon, SearchIcon } from "@/ui-icons";

import { isSearchTextMatch } from "app/utils/text";

export interface ColumnGroup {
  title?: string;
  columns: Column[];
}
export interface Column {
  key: string;
  label: string;
  disable?: boolean;
}
// TODO: sticky
export interface SettingColumnProps {
  open: boolean;
  onClose: () => void;
  settings: { [key: string]: boolean };
  defaultSetting: { [key: string]: boolean };
  onSubmit: (setting: { [key: string]: boolean }) => void;
  groups?: ColumnGroup[];
  columns?: Column[];
  title?: string;
  searchable?: boolean;
  sortable?: boolean;
  submitting?: boolean;
}
const SettingColumn = (props: SettingColumnProps) => {
  const {
    open,
    onClose,
    title = "Điều chỉnh cột hiển thị trên trang danh sách",
    groups,
    columns,
    searchable,
    sortable,
    onSubmit,
    defaultSetting,
    settings,
    submitting,
  } = props;
  const normalizeColumns = useMemo(() => createNormalizedColumns(columns, groups), [columns, groups]);
  const [columnSelected, setColumnSelected] = useState(getSelectedColumnsFromSettings(normalizeColumns, settings));
  const [query, setQuery] = useState("");
  const [selectedTab, setTab] = useState(0);

  const { mdUp } = useBreakpoints();

  const mapColumnToOptionList = useCallback(
    (columns: Column[]) => {
      return columns
        .map((item) => ({
          value: item.key,
          label: item.label,
          disabled: item.disable,
        }))
        .filter((item) => isSearchTextMatch(item.label, query, { vietnamese: true }));
    },
    [query]
  );

  const showColumns = useMemo(() => {
    return mapColumnToOptionList(columns || []);
  }, [columns, mapColumnToOptionList]);

  const showGroups = useMemo(() => {
    return (groups || []).map((item) => ({
      title: item.title,
      options: mapColumnToOptionList(item.columns),
    }));
  }, [groups, mapColumnToOptionList]);

  useEffect(() => {
    if (!open) {
      setColumnSelected(getSelectedColumnsFromSettings(normalizeColumns, settings));
      setQuery("");
    }
  }, [normalizeColumns, open, settings]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = reorder(columnSelected, result.source.index, result.destination.index);
    setColumnSelected(items);
  };

  const handleChangeOptionListColumn = useCallback(
    (newSelected: string[]) => {
      if (newSelected.length > columnSelected.length) {
        const newItemKey = newSelected.find((item) => columnSelected.find((m) => m.key !== item));
        const newItem = normalizeColumns.find((item) => item.key === newItemKey);
        if (newItem) setColumnSelected([...columnSelected, newItem]);
      } else {
        setColumnSelected(columnSelected.filter((i) => newSelected.includes(i.key)));
      }
    },
    [columnSelected, normalizeColumns]
  );

  const columnsSelectionMarkup = (
    <StyledWrapperColumns>
      {searchable && (
        <StyledWrapperSearchBox>
          <TextField
            prefix={<Icon source={SearchIcon} color="base" />}
            placeholder="Tìm kiếm cột hiển thị"
            clearButton
            onChange={setQuery}
            onClearButtonClick={() => setQuery("")}
          />
        </StyledWrapperSearchBox>
      )}
      <StyledWrapperOptionList>
        <OptionList
          selected={columnSelected.map((i) => i.key)}
          onChange={handleChangeOptionListColumn}
          allowMultiple
          options={showColumns}
          sections={showGroups}
        />
      </StyledWrapperOptionList>
    </StyledWrapperColumns>
  );

  const columnsResultMarkup = (
    <StyledWrapperColumns>
      <DragDropContext onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="droppable">
          {(provided: any, snapshot: any) => (
            <StyledDroppableItem
              ref={provided.innerRef}
              {...provided.droppableProps}
              active={sortable && snapshot.isDraggingOver}
            >
              {columnSelected.map((column, index) => (
                <Draggable key={column.key} draggableId={column.key} index={index} isDragDisabled={!sortable}>
                  {(provided: any, snapshot: any) => (
                    <StyledColumSelect
                      key={`column-${column.key}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      active={sortable && snapshot.isDragging}
                    >
                      <Text as="p">{column.label}</Text>
                      {!column.disable ? (
                        <StyledIconButton
                          onClick={() => setColumnSelected(columnSelected.filter((item) => item.key !== column.key))}
                        >
                          <Icon source={CloseBigIcon} />
                        </StyledIconButton>
                      ) : null}
                    </StyledColumSelect>
                  )}
                </Draggable>
              ))}
            </StyledDroppableItem>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </StyledWrapperColumns>
  );

  const contentMarkup = mdUp ? (
    <Container>
      <Card title="Thêm cột hiển thị" divider>
        {columnsSelectionMarkup}
      </Card>
      <Card title="Cột hiển thị" divider>
        {columnsResultMarkup}
      </Card>
    </Container>
  ) : (
    <Tabs
      selected={selectedTab}
      tabs={[
        {
          id: "selection",
          content: "Thêm cột hiển thị",
        },
        {
          id: "result",
          content: "Cột hiển thị",
        },
      ]}
      onSelect={setTab}
    >
      {selectedTab === 0 ? columnsSelectionMarkup : columnsResultMarkup}
    </Tabs>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="fullScreen"
      primaryAction={{
        content: "Lưu",
        onAction: () => {
          const cols = normalizeColumns.map((e) => e.key);
          const keys = columnSelected.filter((e) => !!e).map((e) => e.key);
          const listSetting: any = {};
          keys.forEach((key) => {
            listSetting[key] = true;
          });
          cols.forEach((keyDefault) => {
            if (Object.keys(listSetting).findIndex((m) => m === keyDefault) < 0) {
              listSetting[keyDefault] = false;
            }
          });
          onSubmit(listSetting);
        },
        loading: submitting,
      }}
      secondaryActions={[
        {
          content: "Quay về mặc định",
          disabled: submitting,
          onAction: () => {
            setColumnSelected(getSelectedColumnsFromSettings(normalizeColumns, defaultSetting));
          },
        },
        {
          content: "Hủy",
          disabled: submitting,
          onAction: onClose,
        },
      ]}
    >
      {contentMarkup}
    </Modal>
  );
};

const createNormalizedColumns = (columns: Column[] = [], groups: ColumnGroup[] = []): Column[] => {
  const columnFromGroup = groups
    .filter((i) => i.columns.length > 0)
    .map((i) => i.columns)
    .flat();
  return [...columns, ...columnFromGroup];
};

const getSelectedColumnsFromSettings = (normalizeColumns: Column[], settings: { [key: string]: boolean }) => {
  const columns: Column[] = [];
  Object.entries(settings).forEach(([key, value]) => {
    const column: Column = normalizeColumns.find((item) => item.key === key) as any;
    if (column && value) {
      columns.push(column);
    }
  });
  return columns;
};

const reorder = (list: Column[], startIndex: any, endIndex: any) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Container = styled.div`
  padding: 16px 24px;
  height: calc(100vh - 200px);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  & > * {
    width: calc(50% - 10px);
    margin-top: 0 !important;
    height: 100%;
  }
`;

const StyledWrapperColumns = styled(Scrollable)`
  height: calc(100% - 65px);
`;

const StyledWrapperSearchBox = styled.div`
  padding: 8px 20px;
`;

const StyledWrapperOptionList = styled.div`
  padding: 0 8px;
`;

const StyledDroppableItem = styled.div<{
  active: boolean;
}>`
  background: ${(p) => (p.active ? p.theme.colors.surfaceSelectedHovered : p.theme.colors.background)};
  cursor: ${(p) => (p.active ? "grabbing" : "default")};
`;

const StyledColumSelect = styled.div<{
  active: boolean;
}>`
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  box-sizing: border-box;
  &:not(:last-child) {
    border-bottom: ${(p) => p.theme.shape.borderDivider};
  }
  background: ${(p) => p.theme.colors.surface};
  &:hover {
    background: ${(p) => p.theme.colors.surfaceHovered};
  }
  ${(p) =>
    p.active &&
    css`
      user-select: none;
      background: ${p.theme.colors.surfaceSelectedHovered};
      cursor: grab;
    `}
`;

const StyledIconButton = styled.div`
  cursor: pointer;
  border-radius: 50%;
  padding: 3px;
  & svg {
    color: ${(p) => p.theme.colors.icon};
  }
  &:hover {
    background-color: ${(p) => p.theme.colors.backgroundHoverred};
  }
`;

export default React.memo(SettingColumn);

/*
  react-beautiful-dnd bị lỗi khi sử dụng strict mode
  issue: https://github.com/atlassian/react-beautiful-dnd/issues/2350
  fix: https://github.com/atlassian/react-beautiful-dnd/issues/2399
 */
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
