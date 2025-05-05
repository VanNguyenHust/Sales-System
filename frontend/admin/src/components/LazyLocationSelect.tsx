import { ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Autocomplete, Button, Tag } from "@/ui-components";
import { includes, toString } from "lodash-es";
import { useDebounce } from "use-debounce";

import { useCountLocationsQuery, useGetLocationsQuery, useGetLocationsWithInfiniteQuery } from "app/api";
import { LocationFilter } from "app/types";

import { SelectEmptyState } from "./SelectEmptyState";
import { StopPropagation } from "./StopPropagation";
import { useMeasureElements } from "./useMeasureElements";

interface Props extends ComponentProps<typeof Autocomplete.Select> {
  values?: number[];
  allowMultiple?: boolean;
  excludes?: number[];
  width?: number;
  showTags?: boolean;
  onChange?: (value: number[]) => void;
  tagRollupAfter?: number;
  filter?: Omit<LocationFilter, "query" | "page" | "limit">;
}

type Options = {
  label: string;
  value: string;
}[];

function noop() {}

export const LazyLocationSelect = ({
  placeholder = "Chọn chi nhánh",
  value = "",
  values = [],
  allowMultiple,
  excludes = [],
  width,
  onFocus,
  onChange,
  showTags,
  filter = {},
  tagRollupAfter,
  ...selectRestProps
}: Props) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [isShowAllTags, setShowAllTags] = useState(false);

  const selectedTagNode = useRef<HTMLDivElement>(null);
  const selectedMeasureTagNode = useRef<HTMLDivElement>(null);

  const [debounceQuery, { isPending }] = useDebounce(query, 300);
  const queryPending = isPending();

  const { data: selectedRes } = useGetLocationsQuery(
    {
      ids: allowMultiple ? values.join(",") : value,
      page: 0,
      limit: 0,
    },
    {
      skip: !value && !values.length,
    }
  );

  const { data: count, isLoading: isCounting } = useCountLocationsQuery({ ...filter, query: debounceQuery });
  const {
    data: locations,
    isLoading,
    isFetching,
  } = useGetLocationsWithInfiniteQuery({ ...filter, query: debounceQuery, page, limit: 15 });

  const { childrenThatFit, remeasureElements } = useMeasureElements({
    containerNode: selectedTagNode,
    measurerNode: selectedMeasureTagNode,
    overflowOffsetWidth: 100,
  });

  const selected = useMemo(() => {
    if (!selectedRes || (!value && !values.length)) {
      return [];
    }
    return selectedRes;
  }, [selectedRes, values, value]);

  const options = useMemo(
    (): Options =>
      (locations ?? [])
        .filter((item) => !includes(excludes, item.id))
        .map((item) => ({
          label: item.name || "",
          value: toString(item.id),
        })),
    [excludes, locations]
  );

  const hasMore = !queryPending && !isFetching && !isCounting && (count ?? 0) > (locations ?? []).length;

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

  const handleRemoveTag = (value: number) => {
    onChange?.(selected.filter((item) => item.id !== value).map((item) => item.id));
  };

  const onLoadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const textField = (
    <Autocomplete.Select
      {...selectRestProps}
      value={selected.length > 0 ? `${selected[0].id}` : ""}
      placeholder={
        selected.length > 0 ? (allowMultiple ? `Đã chọn ${selected.length} chi nhánh` : selected[0].name) : placeholder
      }
      onFocus={handleSelectFocus}
    />
  );

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
              <Autocomplete.HeaderSearch value={query} onChange={setQuery} placeholder="Tìm chi nhánh" />
            </Autocomplete.Header>
          }
          options={options}
          selected={allowMultiple ? values.map(String) : [value]}
          onSelect={handleChange}
          willLoadMoreResults={hasMore}
          onLoadMoreResults={onLoadMore}
          textField={textField}
          loading={isLoading || isCounting}
          emptyState={<SelectEmptyState />}
          allowMultiple={allowMultiple}
        />
      </StopPropagation>
      {showTags && (
        <>
          <StyledSelectedContainer ref={selectedTagNode}>
            {visibleSelectedTags.map((item) => (
              <Tag onRemove={selectRestProps.disabled ? undefined : () => handleRemoveTag(item.id)} key={item.id}>
                {item.name}
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
              <Tag onRemove={selectRestProps.disabled ? undefined : noop} key={item.id}>
                {item.name}
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
