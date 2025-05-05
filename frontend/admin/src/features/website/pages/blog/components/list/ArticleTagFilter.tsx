import { useMemo } from "react";
import { AlphaFilters, Tag } from "@/ui-components";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";

import { useGetArticleTagsQuery } from "../../api";

interface ArticleTagFilterProps {
  value: string[];
  onChange: (vendor: string[]) => void;
}

export const ArticleTagFilter = ({ value, onChange }: ArticleTagFilterProps) => {
  const { query, debouncedQuery, queryPending, changeQuery } = useQueryAndPaging();
  const { currentData: items = [], isFetching } = useGetArticleTagsQuery(
    {
      order: "popularity",
      query: debouncedQuery,
    },
    { skip: queryPending }
  );

  const loading = isFetching || queryPending;

  const options = useMemo(() => {
    return (items || []).map((item) => ({
      label: item,
      value: item,
    }));
  }, [items]);

  return (
    <AlphaFilters.OptionItem
      options={options}
      selected={value}
      onSelect={onChange}
      loading={loading}
      allowMultiple
      emptyState={<SelectEmptyState />}
      limitWidth
    >
      <AlphaFilters.OptionSearch
        value={query}
        onChange={changeQuery}
        suffix={value.length ? <Tag onRemove={() => onChange([])}>Đã chọn {value.length}</Tag> : undefined}
      />
    </AlphaFilters.OptionItem>
  );
};
