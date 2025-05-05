import {
  type AlphaAppliedFilterInterface as AppliedFilterInterface,
  type AlphaFilterInterface as FilterInterface,
  AlphaFilters as Filters,
} from "@/ui-components";

import { useCreateSavedSearchMutation, useGetSavedSearchsQuery, useUpdateSavedSearchMutation } from "app/api";
import { PopoverSaveSearch, PopoverSaveSearchProps } from "app/components/PopupSaveSearch";
import { SavedSearch } from "app/types";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useDraftFilters } from "app/utils/useDraftFilters";

import { useBlogFilter } from "../../hooks/useBlogFilter";
import { useGenBlogFilter } from "../../hooks/useGenBlogFilter";
import { BlogFilterModel } from "../../types";

type EnhancedAppliedFilterInterface = AppliedFilterInterface & {
  key: keyof BlogFilterModel;
};

type EnhancedFilterInterface = FilterInterface & {
  key: keyof BlogFilterModel;
};

export const BlogFilters = ({ removeSelected }: { removeSelected?: () => void }) => {
  const {
    filter: filterState,
    query: queryState,
    activeTab,
    changeFilter,
    changeQuery,
    changeSavedSearch,
  } = useBlogFilter();
  const { toSavedSearch } = useGenBlogFilter();

  const { data: savedSearchs } = useGetSavedSearchsQuery({
    type: "blogs",
  });

  const [createSavedSearch, { isLoading: isCreatingSavedSearch }] = useCreateSavedSearchMutation();
  const [updateSavedSearch, { isLoading: isUpdatingSavedSearch }] = useUpdateSavedSearchMutation();

  const { query, resetDraftFilters, clearDraftFilters, submitDraftFilters, setQuery, clearQuery } =
    useDraftFilters<BlogFilterModel>({
      defaultValues: filterState,
      defaultQuery: queryState,
      emptyValues: {},
      onSubmit: () => {
        removeSelected?.();
        changeFilter();
      },
      onQuerySubmit: changeQuery,
    });

  const handleSubmitSavedSearch: NonNullable<PopoverSaveSearchProps["onSubmit"]> = async (form) => {
    try {
      const savedSearchQuery = toSavedSearch(query);
      let updatedSavedSearch: SavedSearch;
      if (form.mode === "create") {
        updatedSavedSearch = await createSavedSearch({
          name: form.createName,
          type: "blogs",
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearchs || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: "blogs",
        }).unwrap();
      }
      showToast(form.mode === "create" ? "Lưu bộ lọc thành công" : "Cập nhật bộ lọc thành công");
      changeSavedSearch(`${updatedSavedSearch.id}`);
      return true;
    } catch (e) {
      handleErrorApi(e);
      return false;
    }
  };

  const appliedFilter: EnhancedAppliedFilterInterface[] = [];

  const filter: EnhancedFilterInterface[] = [];

  return (
    <Filters
      queryValue={query}
      appliedFilters={appliedFilter}
      filters={filter}
      queryPlaceholder="Tìm kiếm danh mục bài viết"
      onClearAll={clearDraftFilters}
      onSheetOpen={resetDraftFilters}
      onQueryChange={setQuery}
      onQueryClear={clearQuery}
      onSubmit={submitDraftFilters}
    >
      <PopoverSaveSearch
        loading={isCreatingSavedSearch || isUpdatingSavedSearch}
        disabled={activeTab !== "search"}
        items={savedSearchs || []}
        onSubmit={handleSubmitSavedSearch}
      />
    </Filters>
  );
};
