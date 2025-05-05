import {
  type AlphaAppliedFilterInterface as AppliedFilterInterface,
  type AlphaFilterInterface as FilterInterface,
  AlphaFilters as Filters,
  ChoiceList,
} from "@/ui-components";

import { useCreateSavedSearchMutation, useGetSavedSearchsQuery, useUpdateSavedSearchMutation } from "app/api";
import { PopoverSaveSearch, PopoverSaveSearchProps } from "app/components/PopupSaveSearch";
import { CommentStatus } from "app/features/website/types";
import { SavedSearch } from "app/types";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useDraftFilters } from "app/utils/useDraftFilters";

import { useCommentFilter } from "../../hooks/useCommentFilter";
import { useGenCommentFilter } from "../../hooks/useGenCommentFilter";
import { CommentFilterModel } from "../../types";

type EnhancedAppliedFilterInterface = AppliedFilterInterface & {
  key: keyof CommentFilterModel;
};

type EnhancedFilterInterface = FilterInterface & {
  key: keyof CommentFilterModel;
};

export const CommentFilters = ({
  removeSelected,
  isDetailPage,
  changeFilterDetail,
}: {
  removeSelected?: () => void;
  isDetailPage?: boolean;
  changeFilterDetail?: (data: CommentFilterModel) => void;
}) => {
  const {
    filter: filterState,
    query: queryState,
    activeTab,
    changeFilter,
    changeQuery,
    changeSavedSearch,
  } = useCommentFilter(isDetailPage);
  const { toSavedSearch } = useGenCommentFilter();

  const { data: savedSearchs } = useGetSavedSearchsQuery(
    {
      type: "comments",
    },
    {
      skip: isDetailPage,
    }
  );

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
  } = useDraftFilters<CommentFilterModel>({
    defaultValues: filterState,
    defaultQuery: queryState,
    emptyValues: {},
    onSubmit: (data) => {
      removeSelected?.();
      changeFilter(data);
      changeFilterDetail?.(data);
    },
    onQuerySubmit: (q) => {
      changeQuery(q);
      changeFilterDetail?.({ ...filterState, query: q });
    },
  });

  const handleSubmitSavedSearch: NonNullable<PopoverSaveSearchProps["onSubmit"]> = async (form) => {
    try {
      const savedSearchQuery = toSavedSearch(filterState, query);
      let updatedSavedSearch: SavedSearch;
      if (form.mode === "create") {
        updatedSavedSearch = await createSavedSearch({
          name: form.createName,
          type: "comments",
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearchs || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: "comments",
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

  if (appliedFilters.status) {
    appliedFilter.push({
      key: "status",
      label: `Trạng thái: ${
        appliedFilters.status.value === CommentStatus.SPAM
          ? "Spam"
          : appliedFilters.status.value === CommentStatus.PUBLISHED
          ? "Đã duyệt"
          : "Chờ duyệt"
      }`,
      onRemove: clearFilter,
    });
  }

  const commonFilter: Partial<EnhancedFilterInterface> = {
    shortcut: true,
    onSubmit: submitDraftFilters,
    onShortcutOpen: resetDraftFilters,
    onClear: clearDraftFilter,
  };

  const commentStatusOptions = [
    {
      label: "Đã duyệt",
      value: CommentStatus.PUBLISHED,
    },
    {
      label: "Chờ duyệt",
      value: CommentStatus.UNAPPROVED,
    },
    {
      label: "Spam",
      value: CommentStatus.SPAM,
    },
  ];

  const filter: EnhancedFilterInterface[] = [
    {
      ...commonFilter,
      key: "status",
      label: "Trạng thái",
      filter: (
        <Filters.Item limitWidth={160}>
          <ChoiceList
            choices={commentStatusOptions}
            selected={draftFilters.status ? [draftFilters.status] : []}
            onChange={(value) => setDraftFilter("status", value[0])}
          />
        </Filters.Item>
      ),
      labelValues: labelValueForOption("status", commentStatusOptions),
    },
  ];

  return (
    <Filters
      queryValue={query}
      appliedFilters={appliedFilter}
      filters={filter}
      queryPlaceholder="Tìm kiếm bình luận"
      onClearAll={clearDraftFilters}
      onSheetOpen={resetDraftFilters}
      onQueryChange={setQuery}
      onQueryClear={clearQuery}
      onSubmit={submitDraftFilters}
    >
      {!isDetailPage ? (
        <PopoverSaveSearch
          loading={isCreatingSavedSearch || isUpdatingSavedSearch}
          disabled={activeTab !== "search"}
          items={savedSearchs || []}
          onSubmit={handleSubmitSavedSearch}
        />
      ) : null}
    </Filters>
  );
};
