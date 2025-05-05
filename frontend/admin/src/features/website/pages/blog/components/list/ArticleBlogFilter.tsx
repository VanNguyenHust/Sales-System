import { useEffect, useMemo } from "react";
import { AlphaFilters, Tag } from "@/ui-components";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";

import { Blog } from "../../../../types";
import { useGetBlogsQuery, useGetBlogsWithInfiniteQuery } from "../../api";

interface ArticleFilterProps {
  values: number[];
  onChange: (blogs: Blog[]) => void;
}

export const ArticleBlogFilter = ({ values, onChange }: ArticleFilterProps) => {
  const limit = 20;
  const { page, setPage, isSwitching, setSwitchingComplete, query, debouncedQuery, queryPending, changeQuery } =
    useQueryAndPaging();

  const { data: selectedItems } = useGetBlogsQuery(
    {
      ids: values.join(","),
    },
    {
      skip: !values.length,
    }
  );
  const { currentData: items = [], isFetching } = useGetBlogsWithInfiniteQuery(
    {
      name: debouncedQuery,
      page,
      limit,
    },
    {
      skip: queryPending,
    }
  );

  const loading = isFetching || queryPending;

  const hasMore = isSwitching || limit * page <= items.length;

  useEffect(() => {
    if (!isFetching) {
      setSwitchingComplete();
    }
  }, [isFetching, setSwitchingComplete]);

  const options = useMemo(() => {
    return (items || []).map((item) => ({
      label: item.name,
      value: `${item.id}`,
    }));
  }, [items]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((page) => page + 1);
    }
  };

  const handleSelect = (selected: string[]) => {
    const results: Blog[] = [];
    for (const idString of selected) {
      const id = Number(idString);
      const itemInView = (items || []).find((item) => item.id === id);
      const itemInSelected = (selectedItems || []).find((item) => item.id === id);
      if (itemInView) {
        results.push(itemInView);
      } else if (itemInSelected) {
        results.push(itemInSelected);
      }
    }
    onChange(results);
  };

  return (
    <AlphaFilters.OptionItem
      options={options}
      selected={values.map((value) => value.toString())}
      onSelect={handleSelect}
      loading={loading}
      allowMultiple
      willLoadMoreResults={hasMore}
      onLoadMoreResults={loadMore}
      emptyState={<SelectEmptyState />}
      limitWidth
    >
      <AlphaFilters.OptionSearch
        value={query}
        onChange={changeQuery}
        suffix={values.length ? <Tag onRemove={() => onChange([])}>Đã chọn {values.length}</Tag> : undefined}
      />
    </AlphaFilters.OptionItem>
  );
};
