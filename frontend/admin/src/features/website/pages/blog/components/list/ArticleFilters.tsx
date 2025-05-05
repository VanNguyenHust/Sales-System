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

import { useArticleFilter } from "../../hooks/useArticleFilter";
import { useGenArticleFilter } from "../../hooks/useGenArticleFilter";
import { ArticleFilterModel } from "../../types";

import { ArticleAuthorFilter } from "./ArticleAuthorFilter";
import { ArticleBlogFilter } from "./ArticleBlogFilter";
import { ArticleTagFilter } from "./ArticleTagFilter";

type EnhancedAppliedFilterInterface = AppliedFilterInterface & {
  key: keyof ArticleFilterModel;
};

type EnhancedFilterInterface = FilterInterface & {
  key: keyof ArticleFilterModel;
};

export const ArticleFilters = ({ removeSelected }: { removeSelected?: () => void }) => {
  const {
    filter: filterState,
    query: queryState,
    activeTab,
    changeFilter,
    changeQuery,
    changeSavedSearch,
  } = useArticleFilter();
  const { toSavedSearch } = useGenArticleFilter();

  const { data: savedSearchs } = useGetSavedSearchsQuery({
    type: "articles",
  });

  const [createSavedSearch, { isLoading: isCreatingSavedSearch }] = useCreateSavedSearchMutation();
  const [updateSavedSearch, { isLoading: isUpdatingSavedSearch }] = useUpdateSavedSearchMutation();

  const {
    query,
    appliedFilters,
    draftFilters,
    resetDraftFilters,
    clearDraftFilters,
    clearDraftFilter,
    setDraftFilter,
    clearFilter,
    submitDraftFilters,
    setQuery,
    clearQuery,
    labelValueFor,
    labelValueForArray,
    labelValueForOption,
  } = useDraftFilters<ArticleFilterModel>({
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
          type: "articles",
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearchs || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: "articles",
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

  if (appliedFilters.visibility) {
    appliedFilter.push({
      key: "visibility",
      label: `Trạng thái: ${appliedFilters.visibility.value === "visibility" ? "Hiện" : "Ẩn"}`,
      onRemove: clearFilter,
    });
  }

  if (appliedFilters.tags) {
    appliedFilter.push({
      key: "tags",
      label: `Tag: ${appliedFilters.tags.value.join(", ")}`,
      onRemove: clearFilter,
    });
  }

  if (appliedFilters.author) {
    appliedFilter.push({
      key: "author",
      label: `Tác giả: ${appliedFilters.author.value}`,
      onRemove: clearFilter,
    });
  }

  if (appliedFilters.blogs) {
    appliedFilter.push({
      key: "blogs",
      label: `Danh mục bài viết: ${appliedFilters.blogs.value.map((blog) => blog.name).join(", ")}`,
      onRemove: clearFilter,
    });
  }

  const commonFilter: Partial<EnhancedFilterInterface> = {
    shortcut: true,
    onSubmit: submitDraftFilters,
    onShortcutOpen: resetDraftFilters,
    onClear: clearDraftFilter,
  };

  const articleVisibilityOptions = [
    {
      label: "Hiện",
      value: "visibility",
    },
    {
      label: "Ẩn",
      value: "hidden",
    },
  ];
  const filter: EnhancedFilterInterface[] = [
    {
      ...commonFilter,
      key: "visibility",
      label: "Trạng thái",
      filter: (
        <Filters.Item limitWidth={120}>
          <ChoiceList
            choices={articleVisibilityOptions}
            selected={draftFilters.visibility ? [draftFilters.visibility] : []}
            onChange={(value) => setDraftFilter("visibility", value[0])}
          />
        </Filters.Item>
      ),
      labelValues: labelValueForOption("visibility", articleVisibilityOptions),
    },
    {
      ...commonFilter,
      key: "tags",
      label: "Tag",
      filter: (
        <Filters.NoItem>
          <ArticleTagFilter value={draftFilters.tags ?? []} onChange={(value) => setDraftFilter("tags", value)} />
        </Filters.NoItem>
      ),
      labelValues: labelValueForArray("tags"),
      labelValuesRollupAfter: 4,
    },
    {
      ...commonFilter,
      key: "author",
      label: "Tác giả",
      filter: (
        <Filters.NoItem>
          <ArticleAuthorFilter
            value={draftFilters.author ? draftFilters.author : ""}
            onChange={(value) => setDraftFilter("author", value[0])}
          />
        </Filters.NoItem>
      ),
      labelValues: labelValueFor("author", (value) => value),
    },
    {
      ...commonFilter,
      key: "blogs",
      label: "Danh mục bài viết",
      filter: (
        <Filters.NoItem>
          <ArticleBlogFilter
            values={draftFilters.blogs ? draftFilters.blogs.map((blog) => blog.id) : []}
            onChange={(values) => setDraftFilter("blogs", values)}
          />
        </Filters.NoItem>
      ),
      labelValues: labelValueForArray("blogs"),
    },
  ];

  return (
    <Filters
      queryValue={query}
      appliedFilters={appliedFilter}
      filters={filter}
      queryPlaceholder="Tìm kiếm bài viết"
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
