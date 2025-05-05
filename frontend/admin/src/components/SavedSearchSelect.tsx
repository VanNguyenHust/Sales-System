import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Autocomplete, Button, Tag } from "@/ui-components";
import { toString } from "lodash-es";

import { useGetSavedSearchsQuery } from "app/api";
import { SavedSearchType } from "app/types";
import { isSearchTextMatch } from "app/utils/text";

import { SelectEmptyState } from "./SelectEmptyState";
import { StopPropagation } from "./StopPropagation";
import { useMeasureElements } from "./useMeasureElements";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  values?: number[];
  allowMultiple?: boolean;
  enableSelectAll?: boolean;
  width?: number;
  onChange?: (value: number[]) => void;
  savedSearchType: SavedSearchType;
  resourceName?: string;
  showTags?: boolean;
  tagRollupAfter?: number;
}

type Options = {
  label: string;
  value: string;
}[];

function noop() {}
export const SavedSearchSelect = ({
  placeholder = "Chọn bộ lọc",
  value = "",
  values = [],
  allowMultiple,
  enableSelectAll,
  width,
  onFocus,
  onChange,
  savedSearchType,
  resourceName = "bộ lọc",
  showTags,
  tagRollupAfter,
  ...selectRestProps
}: Props) => {
  const [query, setQuery] = useState("");
  const [isShowAllTags, setShowAllTags] = useState(false);

  const selectedTagNode = useRef<HTMLDivElement>(null);
  const selectedMeasureTagNode = useRef<HTMLDivElement>(null);

  const { data: savedSearchs, isLoading, isFetching } = useGetSavedSearchsQuery({ type: savedSearchType });

  const options = useMemo((): Options => {
    if (!savedSearchs) return [];
    return savedSearchs.map((item) => ({
      label: item.name || "",
      value: toString(item.id),
    }));
  }, [savedSearchs]);

  const selected = useMemo(() => {
    if (!values) return [];
    return options.filter((item) => values.includes(Number(item.value)));
  }, [values, options]);

  const { childrenThatFit, remeasureElements } = useMeasureElements({
    containerNode: selectedTagNode,
    measurerNode: selectedMeasureTagNode,
    overflowOffsetWidth: 100,
  });

  useEffect(() => {
    remeasureElements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    onFocus?.();
  };

  const handleChange = (selected: string[]) => {
    onChange?.(selected.map(Number));
  };

  const handleRemoveTag = (value: string) => {
    onChange?.(
      selected
        .filter((item) => item.value !== value)
        .map((item) => item.value)
        .map(Number)
    );
  };

  const handleSelectAll = useCallback(() => {
    if (selected?.length === options?.length) {
      onChange?.([]);
    } else {
      onChange?.(options.map((item) => item.value).map(Number));
    }
  }, [onChange, options, selected?.length]);

  const textField = (
    <Autocomplete.Select
      {...selectRestProps}
      value={selected.length > 0 ? `${selected[0].value}` : ""}
      placeholder={
        selected.length > 0
          ? allowMultiple
            ? `Đã chọn ${selected.length} ${resourceName}`
            : selected[0].label
          : placeholder
      }
      onFocus={handleSelectFocus}
    />
  );

  const filteredOptions = query ? options.filter((option) => isSearchTextMatch(option.label, query)) : options;

  const visibleSelectedTags = useMemo(() => {
    if (tagRollupAfter && tagRollupAfter > 1) {
      return !isShowAllTags ? selected.slice(0, tagRollupAfter) : selected;
    } else {
      return childrenThatFit > 0 && !isShowAllTags ? selected.slice(0, childrenThatFit) : selected;
    }
  }, [childrenThatFit, isShowAllTags, selected, tagRollupAfter]);

  return (
    <StyledContainer width={width}>
      <StopPropagation>
        <Autocomplete
          header={
            <Autocomplete.Header>
              <Autocomplete.HeaderSearch value={query} onChange={setQuery} placeholder={`Tìm ${resourceName}`} />
              {enableSelectAll && allowMultiple && (
                <Autocomplete.HeaderCheckbox
                  label="Chọn tất cả"
                  onChange={handleSelectAll}
                  checked={selected?.length === options.length ? true : selected?.length ? "indeterminate" : false}
                />
              )}
            </Autocomplete.Header>
          }
          options={filteredOptions}
          selected={allowMultiple ? values.map(String) : [value]}
          onSelect={handleChange}
          textField={textField}
          loading={isLoading || isFetching}
          emptyState={<SelectEmptyState />}
          allowMultiple={allowMultiple}
        />
      </StopPropagation>
      {showTags && (
        <>
          <StyledSelectedContainer ref={selectedTagNode}>
            {visibleSelectedTags.map((item) => (
              <Tag onRemove={selectRestProps.disabled ? undefined : () => handleRemoveTag(item.value)} key={item.value}>
                {item.label}
              </Tag>
            ))}
            {(visibleSelectedTags.length < selected.length || isShowAllTags) && (
              <Button onClick={() => setShowAllTags(!isShowAllTags)} plain>
                {isShowAllTags ? "Thu gọn" : "Xem thêm"}
              </Button>
            )}
          </StyledSelectedContainer>
          <StyledMeasure ref={selectedMeasureTagNode}>
            {selected.map((item) => (
              <Tag onRemove={selectRestProps.disabled ? undefined : noop} key={item.value}>
                {item.label}
              </Tag>
            ))}
          </StyledMeasure>
        </>
      )}
    </StyledContainer>
  );
};

const StyledSelectedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${(p) => p.theme.spacing(2)};
  gap: ${(p) => p.theme.spacing(2)};
`;

const StyledMeasure = styled.div`
  display: none;
`;

const StyledContainer = styled.span<{ width?: number }>`
  display: block;
  ${(p) =>
    p.width
      ? css`
          width: ${p.width}px;
        `
      : css``};
`;
