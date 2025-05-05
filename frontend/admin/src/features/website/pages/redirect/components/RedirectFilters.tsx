import {
  type AlphaAppliedFilterInterface as AppliedFilterInterface,
  type AlphaFilterInterface as FilterInterface,
  AlphaFilters as Filters,
} from "@/ui-components";

import { useCreateSavedSearchMutation, useGetSavedSearchsQuery, useUpdateSavedSearchMutation } from "app/api";
import { DateRangePicker } from "app/components/DateTime";
import { PopoverSaveSearch, PopoverSaveSearchProps } from "app/components/PopupSaveSearch";
import { SavedSearch } from "app/types";
import { formatDateRange } from "app/utils/datetime";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useDraftFilters } from "app/utils/useDraftFilters";

import { useFilter } from "../hooks/useFilter";
import { useGenFilter } from "../hooks/useGenFilter";
import { RedirectFilterModel } from "../type";

type EnhancedAppliedFilterInterface = AppliedFilterInterface & {
  key: keyof RedirectFilterModel;
};

type EnhancedFilterInterface = FilterInterface & {
  key: keyof RedirectFilterModel;
};

export const RedirectFilters = ({ removeSelected }: { removeSelected?: () => void }) => {
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
    type: "redirects",
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
    labelValueFor,
  } = useDraftFilters<RedirectFilterModel>({
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
          type: "redirects",
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearchs || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: "redirects",
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

  if (appliedFilters.createdOn) {
    appliedFilter.push({
      key: "createdOn",
      label: `Ngày tạo: ${formatDateRange(appliedFilters.createdOn.value)}`,
      onRemove: clearFilter,
    });
  }

  const commonFilter: Partial<EnhancedFilterInterface> = {
    shortcut: true,
    onSubmit: submitDraftFilters,
    onShortcutOpen: resetDraftFilters,
    onClear: clearDraftFilter,
  };

  const filter: EnhancedFilterInterface[] = [
    {
      ...commonFilter,
      key: "createdOn",
      label: "Ngày tạo",
      filter: (
        <Filters.Item limitWidth>
          <DateRangePicker
            value={draftFilters.createdOn}
            onChange={(value) => setDraftFilter("createdOn", value ?? undefined)}
          />
        </Filters.Item>
      ),
      labelValues: labelValueFor("createdOn", formatDateRange),
    },
  ];

  return (
    <Filters
      queryValue={query}
      appliedFilters={appliedFilter}
      filters={filter}
      queryPlaceholder="Tìm kiếm chuyển hướng"
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
