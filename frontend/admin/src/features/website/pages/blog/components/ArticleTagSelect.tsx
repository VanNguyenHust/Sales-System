import { type TextFieldProps } from "@/ui-components";

import { TagSelect } from "app/components/TagPickerModal";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";
import { useToggle } from "app/utils/useToggle";

import { useGetArticleSuggestTagsQuery } from "../api";

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  labelAction?: TextFieldProps["labelAction"];
  disabled?: boolean;
}

export const ArticleTagSelect = ({ placeholder, value, onChange, label, labelAction, disabled }: Props) => {
  const { value: touched, setTrue: setTouched } = useToggle(false);
  const { query, debouncedQuery, queryPending, changeQuery } = useQueryAndPaging();

  const { data: tags, isFetching } = useGetArticleSuggestTagsQuery(
    { take: 50, query: debouncedQuery },
    {
      skip: !touched || queryPending,
    }
  );

  const handleChange = (selected: string[]) => {
    onChange?.(selected);
  };

  return (
    <TagSelect
      suggestTags={tags ?? []}
      label={label}
      labelAction={labelAction}
      placeholder={placeholder}
      isPending={queryPending}
      isFetching={isFetching}
      selected={value}
      query={query}
      onQueryChange={changeQuery}
      onSelect={handleChange}
      onFocus={setTouched}
      readonly={disabled}
    />
  );
};
