import { useMemo, useState } from "react";
import { Autocomplete } from "@/ui-components";
import { useDebounce } from "use-debounce";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { useGetCountUsersQuery, useGetUsersWithInfiniteQuery } from "app/features/setting/pages/user-permission/api";
import { useToggle } from "app/utils/useToggle";

interface Props {
  isCreate?: boolean;
  limit?: number;
  value?: string;
  onChange: (author: string) => void;
  label?: string;
  disabled?: boolean;
}

export const ArticleAuthorSelect = ({ limit = 20, isCreate, value, onChange, ...selectRestProps }: Props) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { value: touched, setTrue: setTouched } = useToggle(false);

  const [debounceQuery, { isPending }] = useDebounce(query, 300);
  const pending = isPending();

  const { data: count, isFetching: isFetchingCount } = useGetCountUsersQuery(
    { query: debounceQuery },
    { skip: !touched && !isCreate }
  );

  const { currentData: items, isFetching } = useGetUsersWithInfiniteQuery(
    {
      query: debounceQuery,
      page,
      limit,
    },
    {
      skip: (!touched || pending) && !isCreate,
    }
  );

  const hasMore = !pending && count !== (items || []).length;
  const loading = isFetching || isFetchingCount || pending;

  const options = useMemo(() => {
    return (items || []).map((user) => ({
      label: [user.last_name, user.first_name].filter(Boolean).join(" "),
      value: user.id.toString(),
    }));
  }, [items]);

  // reset query when focus
  const handleSelectFocus = () => {
    setQuery("");
    setTouched();
  };

  const handleChangeQuery = (q: string) => {
    setQuery(q);
    setPage(1);
  };

  const handleChange = (value: string) => {
    onChange(options.find((option) => option.value === value)?.label || "");
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((page) => page + 1);
    }
  };

  const textField = (
    <Autocomplete.Select {...selectRestProps} value={value} placeholder={value} onFocus={handleSelectFocus} />
  );

  const selected = useMemo(() => options.find((option) => option.label === value)?.value, [value, options]);

  return (
    <Autocomplete
      header={<Autocomplete.HeaderSearch value={query} onChange={handleChangeQuery} />}
      options={options}
      selected={[selected || ""]}
      onSelect={(selected) => handleChange(selected[0])}
      textField={textField}
      loading={loading}
      emptyState={<SelectEmptyState />}
      onLoadMoreResults={loadMore}
      willLoadMoreResults={hasMore}
    />
  );
};
