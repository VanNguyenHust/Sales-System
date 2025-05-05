import { useState } from "react";
import styled from "@emotion/styled";
import {
  ActionList,
  Button,
  Checkbox,
  Icon,
  Modal,
  Popover,
  Spinner,
  Stack,
  Tag,
  Text,
  TextField,
} from "@/ui-components";
import { ArrowSort1Icon, PlusCircleOutlineIcon, SearchIcon } from "@/ui-icons";

import EmptyLoupeIcon from "app/assets/icon/empty-loupe.svg";
import { useToggle } from "app/utils/useToggle";

import { EmptySearchResult } from "../EmptySearchResult";

import { EmptyState } from "./EmptyState";

export type SortBy = "popularity" | "alphabetically";

export interface TagPickerModalProps {
  /** @default "Danh sách tag" */
  title?: string;
  open: boolean;
  /** Khi so sánh tag sử dụng string case sensitive */
  tagCaseSensitive?: boolean;
  /** tag được chọn lúc khởi tạo */
  initialSelectedTags?: string[];
  /** Danh sách tag khả dụng */
  availableTags: string[];
  query: string;
  /** @default "alphabetically" */
  sort?: SortBy;
  loading?: boolean;
  hideSort?: boolean;
  hideCreate?: boolean;
  selectAction: {
    /** @default "Xác nhận" */
    content?: string;
    disableWhenNoSelect?: boolean;
    disableWhenNoChange?: boolean;
    loading?: boolean;
    onAction: (selectedTags: string[]) => void;
  };
  onClose(): void;
  onQueryChange(value: string): void;
  onSortChange?(value: SortBy): void;
  onLoadMoreResults?(): void;
}

export function TagPickerModal({
  title = "Danh sách tag",
  open,
  query,
  sort = "alphabetically",
  availableTags,
  tagCaseSensitive,
  initialSelectedTags,
  loading,
  hideSort,
  hideCreate,
  onClose,
  selectAction,
  onSortChange,
  onQueryChange,
  onLoadMoreResults,
}: TagPickerModalProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialSelectedTags || []);
  const pendingTag = query.trim();
  const pendingTagIsNew =
    pendingTag && !isContainTag(availableTags, pendingTag) && !isContainTag(selectedTags, pendingTag);
  const isEmptyState = !loading && availableTags.length === 0;
  const isChange =
    initialSelectedTags?.length !== selectedTags.length ||
    !!selectedTags.find((tag) => !initialSelectedTags?.includes(tag));
  function isEqualTag(tag: string, other: string) {
    if (tagCaseSensitive) {
      return tag === other;
    }
    return tag.toLocaleLowerCase() === other.toLocaleLowerCase();
  }

  function isContainTag(tags: string[], tag: string) {
    return tags.some((t) => isEqualTag(t, tag));
  }

  const toggleTag = (tag: string) => {
    if (isContainTag(selectedTags, tag)) {
      setSelectedTags((tags) => tags.filter((t) => !isEqualTag(t, tag)));
    } else {
      setSelectedTags((tags) => [...tags, tag]);
    }
  };

  const addTag = (tag: string) => {
    if (!isContainTag(selectedTags, tag)) {
      setSelectedTags((tags) => [...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    if (isContainTag(selectedTags, tag)) {
      setSelectedTags((tags) => tags.filter((t) => !isEqualTag(t, tag)));
    }
  };

  const submitTag = () => {
    if (pendingTagIsNew && !hideCreate) {
      addTag(pendingTag);
      onQueryChange("");
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitTag();
    }
  };

  const handleScrolledToBottom = () => {
    if (!isEmptyState) {
      onLoadMoreResults?.();
    }
  };

  let availableTagsMarkup: JSX.Element;
  if (isEmptyState) {
    availableTagsMarkup = query ? (
      <EmptySearchResult />
    ) : (
      <EmptyState
        image={EmptyLoupeIcon}
        heading="Cửa hàng của bạn chưa có tag nào"
        description="Thêm mới tag để quản lý danh sách tag của bạn"
      />
    );
  } else {
    availableTagsMarkup = (
      <>
        {availableTags.map((tag) => (
          <Checkbox
            checked={selectedTags.includes(tag)}
            key={tag}
            label={
              <Text as="span" breakWord>
                {tag}
              </Text>
            }
            onChange={() => toggleTag(tag)}
          />
        ))}
        {loading && (
          <Stack distribution="center">
            <Spinner size="small" />
          </Stack>
        )}
      </>
    );
  }

  const selectedTagsMarkup = selectedTags.length ? (
    <StyledSection>
      <Text as="p" fontWeight="medium">
        Những tag được chọn
      </Text>
      <Stack spacing="tight">
        {selectedTags.map((tag) => (
          <Tag key={tag} onRemove={() => removeTag(tag)}>
            {tag}
          </Tag>
        ))}
      </Stack>
    </StyledSection>
  ) : null;

  const filterMarkup = (
    <Stack vertical spacing="tight">
      <span onKeyDown={handleInputKeyDown}>
        <TextField
          autoFocus
          value={query}
          onChange={onQueryChange}
          prefix={<Icon source={SearchIcon} color="base" />}
          placeholder={hideCreate ? "Tìm kiếm" : "Tìm kiếm hoặc thêm mới"}
          clearButton
          onClearButtonClick={() => onQueryChange("")}
          connectedSegmented={false}
          connectedRight={!hideSort && onSortChange ? <SortSelect value={sort} onChange={onSortChange} /> : undefined}
        />
      </span>
      {!hideCreate && pendingTagIsNew ? (
        <Stack spacing="extraTight">
          <Button plain icon={PlusCircleOutlineIcon} onClick={submitTag}>
            Thêm
          </Button>
          <Text as="span" fontWeight="medium" breakWord>
            {pendingTag}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  );

  return (
    <Modal
      title={title}
      open={open}
      onClose={onClose}
      primaryAction={{
        content: selectAction.content ?? "Xác nhận",
        loading: selectAction.loading,
        disabled:
          selectedTags.length === 0 &&
          (selectAction.disableWhenNoSelect ||
            (selectAction.disableWhenNoChange && !isChange) ||
            (!query && isEmptyState)),
        onAction: () => selectAction.onAction(selectedTags),
      }}
      sectioned
      secondaryActions={[{ content: "Hủy", disabled: selectAction.loading, onAction: onClose }]}
      onScrolledToBottom={handleScrolledToBottom}
    >
      {filterMarkup}
      {selectedTagsMarkup}
      <StyledSection>
        <StyledTagsList>{availableTagsMarkup}</StyledTagsList>
      </StyledSection>
    </Modal>
  );
}

type SortSelectProps = {
  value: SortBy;
  onChange(value: SortBy): void;
};

function SortSelect({ value, onChange }: SortSelectProps) {
  const { value: isActive, toggle, setFalse } = useToggle(false);
  return (
    <Popover
      active={isActive}
      onClose={setFalse}
      activator={
        <Button disclosure={isActive ? "up" : "down"} icon={ArrowSort1Icon} onClick={toggle}>
          {value === "alphabetically" ? "A-Z" : "Phổ biến"}
        </Button>
      }
    >
      <ActionList
        onActionAnyItem={setFalse}
        items={[
          {
            content: "Phổ biến",
            active: value === "popularity",
            onAction: () => onChange("popularity"),
          },
          {
            content: "A-Z",
            active: value === "alphabetically",
            onAction: () => onChange("alphabetically"),
          },
        ]}
      />
    </Popover>
  );
}

const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(2)};
  padding: ${(p) => p.theme.spacing(4, 0)};
  border-bottom: ${(p) => p.theme.shape.borderDivider};
  &:last-child {
    border-bottom: none;
  }
`;

const StyledTagsList = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(1)};
  flex-direction: column;
  max-height: 300px;
  height: 300px;
`;
