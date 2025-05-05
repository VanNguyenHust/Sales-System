import { AlphaFilters, Tag } from "@/ui-components";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { isSearchTextMatch } from "app/utils/text";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";

import { useGetArticleAuthorsQuery } from "../../api";

interface ArticleAuthorFilterProps {
  value: string;
  onChange: (vendor: string[]) => void;
}

export const ArticleAuthorFilter = ({ value, onChange }: ArticleAuthorFilterProps) => {
  const { query, debouncedQuery, queryPending, changeQuery } = useQueryAndPaging();
  const { currentData: items = [], isFetching } = useGetArticleAuthorsQuery();
  const loading = isFetching || queryPending;

  return (
    <AlphaFilters.OptionItem
      options={items
        .filter((item) => !debouncedQuery || isSearchTextMatch(item, debouncedQuery))
        .map((t) => ({
          label: t,
          value: t,
        }))}
      selected={[value]}
      onSelect={onChange}
      loading={loading}
      emptyState={<SelectEmptyState />}
      limitWidth
    >
      <AlphaFilters.OptionSearch
        value={query}
        onChange={changeQuery}
        suffix={value.length ? <Tag onRemove={() => onChange([])}>Bỏ chọn</Tag> : undefined}
      />
    </AlphaFilters.OptionItem>
  );
};
