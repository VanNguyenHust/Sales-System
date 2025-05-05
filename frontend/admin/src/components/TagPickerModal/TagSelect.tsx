import { Dispatch, SetStateAction, useCallback } from "react";
import styled from "@emotion/styled";
import { Autocomplete, type AutocompleteProps, Icon, Stack, type TextFieldProps } from "@/ui-components";
import { PlusCircleOutlineIcon } from "@/ui-icons";

import { useToggle } from "app/utils/useToggle";

import { SelectEmptyState } from "../SelectEmptyState";

import { TagList } from "./TagList";

interface Props {
  label?: string;
  labelAction?: TextFieldProps["labelAction"];
  listTitle?: string;
  suggestTags: string[];
  placeholder?: string;
  isPending?: boolean;
  isFetching?: boolean;
  hasMore?: boolean;
  selected: string[];
  query: string;
  /** Khi so sánh tag sử dụng string case sensitive */
  tagCaseSensitive?: boolean;
  onQueryChange(value: string): void;
  onFocus?(): void;
  onPageChange?: Dispatch<SetStateAction<number>>;
  onSelect: (tags: string[]) => void;
  readonly?: boolean;
  visibleType?: "select" | "input";
  hideAddNewTag?: boolean;
  error?: string;
}
export const TagSelect = ({
  label,
  labelAction,
  placeholder,
  selected,
  isPending,
  isFetching,
  hasMore: hasMoreProp,
  listTitle,
  suggestTags,
  query: pendingTag,
  tagCaseSensitive,
  onQueryChange: setPendingTag,
  onSelect,
  onPageChange: onChangePage,
  onFocus,
  readonly = false,
  visibleType = "input",
  hideAddNewTag,
  error,
}: Props) => {
  const { value: focused, setFalse: setFocusedFalse, setTrue: setFocusedTrue } = useToggle(false);
  const loading = isFetching || isPending;
  const hasMore = !isPending && hasMoreProp;

  const isEqualTag = useCallback(
    (tag: string, other: string) => {
      if (tagCaseSensitive) {
        return tag === other;
      }
      return tag.toLocaleLowerCase() === other.toLocaleLowerCase();
    },
    [tagCaseSensitive]
  );
  const pendingTagIsNew = pendingTag && (isFetching || suggestTags.every((t) => !isEqualTag(t, pendingTag)));

  const handleFocus = () => {
    setFocusedTrue();
    onFocus?.();
    visibleType === "select" && setPendingTag("");
  };

  const handleAddTag = useCallback(
    (tag: string) => {
      if (selected.some((t) => isEqualTag(t, tag))) {
        onSelect(selected);
      } else {
        onSelect(selected.concat(tag));
      }
    },
    [selected, isEqualTag, onSelect]
  );

  const handleInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!pendingTag) {
          return;
        }
        if (pendingTagIsNew) {
          setPendingTag("");
          handleAddTag(pendingTag);
        } else if (suggestTags.length > 0) {
          handleAddTag(suggestTags[0]);
        }
        setFocusedFalse();
      }
    },
    [handleAddTag, pendingTag, pendingTagIsNew, setFocusedFalse, setPendingTag, suggestTags]
  );

  const handleChangeQuery = (q: string) => {
    setPendingTag(q);
    onChangePage?.(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      onChangePage?.((page) => page + 1);
    }
  };

  const textField = (
    <span onKeyDown={handleInputKeyDown}>
      <Autocomplete.TextField
        disabled={readonly}
        label={label}
        labelAction={labelAction}
        value={pendingTag}
        placeholder={placeholder}
        onChange={handleChangeQuery}
        onFocus={handleFocus}
        onBlur={setFocusedFalse}
        focused={focused}
        error={error}
      />
    </span>
  );

  const selectField = (
    <Autocomplete.Select
      label={label}
      error={error}
      disabled={readonly}
      labelAction={labelAction}
      onFocus={handleFocus}
      onBlur={setFocusedFalse}
      placeholder={selected.length > 0 ? `Đã chọn ${selected.length} tag` : placeholder}
    />
  );

  const searchField =
    visibleType === "select" ? (
      <Autocomplete.HeaderSearch value={pendingTag} onChange={handleChangeQuery} />
    ) : undefined;

  const action: AutocompleteProps["actionBefore"] =
    !hideAddNewTag && pendingTagIsNew
      ? {
          prefix: (
            <StyledActionPrefix>
              <Icon source={PlusCircleOutlineIcon} />
              <span>Thêm</span>
            </StyledActionPrefix>
          ),
          content: `${pendingTag}`,
          onAction: () => {
            handleAddTag(pendingTag);
            setPendingTag("");
            setFocusedFalse();
          },
        }
      : undefined;

  const tagsMarkup =
    selected.length && visibleType === "input" ? (
      <TagList
        tags={selected}
        onRemove={!readonly ? (tag) => onSelect(selected.filter((t) => !isEqualTag(t, tag))) : undefined}
      />
    ) : null;

  return (
    <Stack vertical spacing="tight">
      <Autocomplete
        actionBefore={action}
        listTitle={!pendingTag && suggestTags.length ? listTitle : undefined}
        options={suggestTags.map((tag) => ({
          label: tag,
          value: tag,
        }))}
        selected={selected}
        onSelect={onSelect}
        textField={visibleType === "select" ? selectField : textField}
        header={searchField}
        loading={loading}
        allowMultiple
        emptyState={hideAddNewTag ? <SelectEmptyState /> : undefined}
        willLoadMoreResults={hasMore}
        onLoadMoreResults={loadMore}
      />
      {tagsMarkup}
    </Stack>
  );
};

const StyledActionPrefix = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(1)};
  color: ${(p) => p.theme.colors.interactive};
  svg {
    color: ${(p) => p.theme.colors.interactive} !important;
    fill: ${(p) => p.theme.colors.interactive} !important;
  }
`;
