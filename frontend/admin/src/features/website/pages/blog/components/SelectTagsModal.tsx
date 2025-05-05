import { useState } from "react";
import { useDebounce } from "use-debounce";

import { SortBy, TagPickerModal } from "app/components/TagPickerModal";

import { useGetArticleTagsQuery } from "../api";

interface SelectTagsModalProps {
  title?: string;
  hideCreate?: boolean;
  tagsSelected: string[];
  loadingSubmit?: boolean;
  onClose: () => void;
  applyTags: (tags: string[]) => void;
}

export function SelectTagsModal({
  title,
  hideCreate,
  tagsSelected,
  loadingSubmit,
  onClose,
  applyTags,
}: SelectTagsModalProps) {
  const [query, setQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("popularity");
  const [debounceQuery] = useDebounce(query, 300);
  const { data: tags, isFetching: isFetchingTags } = useGetArticleTagsQuery({
    query: debounceQuery,
    take: 50,
    order: sortBy,
  });

  return (
    <TagPickerModal
      open
      title={title}
      onClose={onClose}
      query={query}
      sort={sortBy}
      hideCreate={hideCreate}
      initialSelectedTags={tagsSelected}
      loading={isFetchingTags}
      onQueryChange={setQuery}
      onSortChange={setSortBy}
      selectAction={{ onAction: applyTags, loading: loadingSubmit, disableWhenNoSelect: true }}
      availableTags={tags ?? []}
    />
  );
}
