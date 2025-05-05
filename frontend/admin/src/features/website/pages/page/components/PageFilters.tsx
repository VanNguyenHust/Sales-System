import {
  type AlphaAppliedFilterInterface as AppliedFilterInterface,
  type AlphaFilterInterface as FilterInterface,
  AlphaFilters as Filters,
  ChoiceList,
} from "@/ui-components";

import { useCreateSavedSearchMutation, useGetSavedSearchsQuery, useUpdateSavedSearchMutation } from "app/api";
import { PopoverSaveSearch, PopoverSaveSearchProps } from "app/components/PopupSaveSearch";
import { SavedSearch } from "app/types";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useDraftFilters } from "app/utils/useDraftFilters";

import { useFilter } from "../hooks/useFilter";
import { useGenFilter } from "../hooks/useGenFilter";
import { PageFilterModel } from "../type";

type EnhancedAppliedFilterInterface = AppliedFilterInterface & {
  key: keyof PageFilterModel;
};

type EnhancedFilterInterface = FilterInterface & {
  key: keyof PageFilterModel;
};

export const PageFilters = ({ removeSelected }: { removeSelected?: () => void }) => {
  const {
    filter: filterState,
    query: queryState,
    activeTab,
    changeFilter,
    changeQuery,
    changeSavedSearch,
  } = useFilter();
  const { toSavedSearch } = useGenFilter();

  const { data: savedSearchs } = useGetSavedSearchsQuery({
    type: "pages",
  });

  const [createSavedSearch, { isLoading: isCreatingSavedSearch }] = useCreateSavedSearchMutation();
  const [updateSavedSearch, { isLoading: isUpdatingSavedSearch }] = useUpdateSavedSearchMutation();

  const {
    query,
    appliedFilters,
    draftFilters,
    clearFilter,
    resetDraftFilters,
    clearDraftFilters,
    clearDraftFilter,
    submitDraftFilters,
    setQuery,
    clearQuery,
    setDraftFilter,
    labelValueForOption,
  } = useDraftFilters<PageFilterModel>({
    defaultValues: filterState,
    defaultQuery: queryState,
    emptyValues: {},
    onSubmit: (data) => {
      removeSelected?.();
      changeFilter(data);
    },
    onQuerySubmit: changeQuery,
  });

  const handleSubmitSavedSearch: NonNullable<PopoverSaveSearchProps["onSubmit"]> = async (form) => {
    try {
      const savedSearchQuery = toSavedSearch(filterState, query);
      let updatedSavedSearch: SavedSearch;
      if (form.mode === "create") {
        updatedSavedSearch = await createSavedSearch({
          name: form.createName,
          type: "pages",
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearchs || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: "pages",
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

  if (appliedFilters.published) {
    appliedFilter.push({
      key: "published",
      label: `Trạng thái: ${appliedFilters.published.value === "visible" ? "Hiển thị" : "Ẩn"}`,
      onRemove: clearFilter,
    });
  }

  const commonFilter: Partial<EnhancedFilterInterface> = {
    shortcut: true,
    onSubmit: submitDraftFilters,
    onShortcutOpen: resetDraftFilters,
    onClear: clearDraftFilter,
  };

  const displayStatusOptions = [
    {
      label: "Hiển thị",
      value: "visible",
    },
    {
      label: "Ẩn",
      value: "hidden",
    },
  ];

  const filter: EnhancedFilterInterface[] = [
    {
      ...commonFilter,
      key: "published",
      label: "Trạng thái",
      filter: (
        <Filters.Item limitWidth={160}>
          <ChoiceList
            choices={displayStatusOptions}
            selected={draftFilters.published ? [draftFilters.published] : []}
            onChange={(value) => setDraftFilter("published", value[0])}
          />
        </Filters.Item>
      ),
      labelValues: labelValueForOption("published", displayStatusOptions),
    },
  ];

  return (
    <Filters
      queryValue={query}
      appliedFilters={appliedFilter}
      filters={filter}
      queryPlaceholder="Tìm kiếm trang nội dung"
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
