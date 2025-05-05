import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { replace } from "@sapo/app-bridge-core/actions/Navigation/History";
import { type TabDescriptor } from "@sapo/ui-components";
import { camelCase, cloneDeep, includes, isEmpty, mapKeys } from "lodash-es";

import { useCreateSavedSearchMutation, useGetSavedSearchsQuery, useUpdateSavedSearchMutation } from "app/api";
import { isClientError } from "app/client";
import { PopoverSaveSearchProps } from "app/components/PopupSaveSearch";
import { SavedSearch, SavedSearchFilterRequest } from "app/types";
import { showErrorToast, showToast } from "app/utils/toast";

import { isEmptyString } from "./form/predicates";

export type MyCustomType = { page?: number; limit?: number; savedSearchId?: number };
export type CustomTabDescriptor = {
  filter?: any;
} & TabDescriptor;
const inValidParamValue = "[object Object]";

export const useBaseFilter = <T extends MyCustomType>(input?: {
  keyIsListFilter: (keyof T)[];
  savedSearch?: SavedSearchFilterRequest["type"];
  checkDefaultTab?: (keyList: string[], valueList: string[]) => string | undefined;
  defaultTabs?: CustomTabDescriptor[];
}) => {
  const tabs = cloneDeep(input?.defaultTabs || []);
  const [createSavedSearch, { isLoading: isCreatingSavedSearch }] = useCreateSavedSearchMutation();
  const [updateSavedSearch, { isLoading: isUpdatingSavedSearch }] = useUpdateSavedSearchMutation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>("all");
  const {
    data: savedSearches,
    isFetching: isFetchingSavedSearches,
    isLoading,
  } = useGetSavedSearchsQuery(
    {
      type: input?.savedSearch ?? "shipments",
    },
    {
      skip: !input?.savedSearch,
    }
  );
  const onChangeSearchParams = <TKey extends keyof T>(key: TKey, value: T[TKey]) => {
    const copyParams = new URLSearchParams(searchParams);
    if (typeof key !== "string") return;
    if (key !== "page") copyParams.delete("page");
    const savedSearchId = copyParams.get("savedSearchId");
    if (value?.toString().includes(inValidParamValue)) copyParams.delete(key);

    if (savedSearchId) {
      const savedSearch = savedSearches?.find((item) => item.id === Number(savedSearchId));
      if (savedSearch) {
        const filterSavedSearch = JSON.parse(savedSearch.query);
        const filter = {
          ...filterSavedSearch,
          [key]: value,
        };
        onChangeSearchParamsAll(filter, true);
        return;
      }
    }

    if (typeof value === "string" && isEmptyString(value)) {
      copyParams.delete(key);
      setSearchParams(copyParams);
      return;
    }
    if (value === undefined) {
      copyParams.delete(key);
      setSearchParams(copyParams);
      return;
    }

    copyParams.set(key, value?.toString() || "");

    if ((key === "page" && value === "1") || copyParams.get("page") === "1") copyParams.delete("page");
    if ((key === "limit" && value === "20") || copyParams.get("limit") === "20") copyParams.delete("limit");
    setSearchParams(copyParams);
  };

  const onChangeSearchParamsAll = (filter: T, reset?: boolean) => {
    let copyParams = new URLSearchParams(searchParams);
    if (reset) copyParams = new URLSearchParams();
    const savedSearchId = copyParams.get("savedSearchId");

    if (savedSearchId) {
      const savedSearch = savedSearches?.find((item) => item.id === Number(savedSearchId));
      if (savedSearch) {
        const filterSavedSearch = JSON.parse(savedSearch.query);
        const _filter = {
          ...filterSavedSearch,
          ...filter,
        } as T;
        onChangeSearchParamsAll(_filter, true);
        return;
      }
    }
    for (const key in filter) {
      const type = typeof filter[key as keyof T];
      const value = filter[key as keyof T];

      if (value === undefined || value === null || value === "") {
        copyParams.delete(key);
        continue;
      }
      if (type === "string") {
        if (isEmptyString(value?.toString())) copyParams.delete(key);
        else copyParams.set(key, value?.toString() || "");
      }
      if (type === "number") {
        copyParams.set(key, value?.toString() || "");
      }
      if (type === "boolean") {
        copyParams.set(key, value?.toString() || "");
      }
      if (type === "object") {
        if (Array.isArray(value)) {
          if (value.length === 0) copyParams.delete(key);
          else copyParams.set(key, value.join(","));
        } else {
          copyParams.set(key, value?.toString() || "");
        }
      }
      if (value.toString().includes(inValidParamValue)) copyParams.delete(key);
    }
    copyParams.delete("page");

    if (filter.limit === 20) copyParams.delete("limit");
    setSearchParams(copyParams);
  };

  const onRemoveSearchParams = (key: keyof T | (keyof T)[]) => {
    if (typeof key === "string") {
      key = [key];
    }
    if (!Array.isArray(key)) return;
    const copyParams = new URLSearchParams(searchParams);

    const isSavedSearchId = copyParams.get("savedSearchId");
    if (isSavedSearchId) {
      const savedSearch = savedSearches?.find((item) => item.id === Number(isSavedSearchId));
      const _filter = JSON.parse(savedSearch?.query || "{}");
      key.forEach((item) => {
        if (typeof item !== "string") return;
        delete _filter[item];
      });
      onChangeSearchParamsAll(_filter, true);
    } else {
      copyParams.delete("page");
      key.forEach((item) => {
        if (typeof item !== "string") return;
        copyParams.delete(item);
      });

      setSearchParams(copyParams);
    }
  };

  const filter = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    const convertParamsToFilter = (params: { [k: string]: string }) => {
      let filter: T = params as unknown as T;
      for (const key in params) {
        const value = params[key];
        if (value === undefined) {
          continue;
        }
        if (includes(input?.keyIsListFilter, key as keyof T)) {
          filter = {
            ...filter,
            [key]: value !== "" ? (Array.isArray(value) ? value : value.split(",")) : undefined,
          };
        } else {
          filter = {
            ...filter,
            [key]: value,
          };
        }
        if (value.toString().includes(inValidParamValue)) delete filter[key as keyof T];
      }
      mapKeys(filter, (value, key) => camelCase(key));

      return filter;
    };
    const filter = convertParamsToFilter(params);
    if (filter.savedSearchId) {
      const savedSearch = savedSearches?.find((item) => item.id === Number(filter.savedSearchId));
      if (savedSearch) {
        const filterSavedSearch = JSON.parse(savedSearch.query);
        return {
          ...convertParamsToFilter(filterSavedSearch),
          page: filter.page,
          limit: filter.limit,
        };
      }
    }
    return filter;
  }, [input?.keyIsListFilter, savedSearches, searchParams]);

  const isFilter = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    const convertParamsToFilter = (params: { [k: string]: string }) => {
      // remove page and limit
      delete params["page"];
      delete params["limit"];
      // remove empty value
      for (const key in params) {
        if (params[key] === "" || params[key] === undefined) {
          delete params[key];
        }
      }
      const keyList = Object.keys(params);
      const valueList = Object.values(params);
      const defaultTab = input?.checkDefaultTab?.(keyList, valueList);
      if (defaultTab) return defaultTab;

      return "search";
    };
    return convertParamsToFilter(params);
  }, [input, searchParams]);

  useEffect(() => {
    setActiveTab(isFilter ?? "all");
  }, [isFilter]);

  if (!isEmpty(savedSearches)) {
    savedSearches?.map((item) => {
      tabs.push({
        id: item.id.toString(),
        content: item.name,
        canDelete: true,
      });
    });
  }

  if (isFilter === "search") {
    tabs.push({
      id: "search",
      content: "Tìm kiếm",
    });
  }

  const onChangeTab = (index: number) => {
    const tab = tabs?.[index]?.id ?? "all";
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === "all") {
      onChangeSearchParamsAll(
        {
          page: 1,
          limit: filter.limit,
        } as T,
        true
      );
    } else if (
      includes(
        input?.defaultTabs?.map((item) => item.id),
        tab
      )
    ) {
      const _filter = tabs.find((item) => item.id === tab)?.filter;
      onChangeSearchParamsAll(
        {
          ..._filter,
          page: 1,
          limit: filter.limit,
        } as T,
        true
      );
    } else if (tab === "search") {
      return;
    } else {
      onChangeSearchParamsAll(
        {
          savedSearchId: tab as unknown as number,
          page: 1,
          limit: filter.limit,
        } as T,
        true
      );
    }
  };

  const handleSubmitSavedSearch: NonNullable<PopoverSaveSearchProps["onSubmit"]> = async (form) => {
    if (!input?.savedSearch) return false;
    try {
      const savedSearchQuery = JSON.stringify(filter);
      let updatedSavedSearch: SavedSearch;
      if (form.mode === "create") {
        updatedSavedSearch = await createSavedSearch({
          name: form.createName,
          type: input?.savedSearch,
          query: savedSearchQuery,
        }).unwrap();
      } else {
        const savedSearch = (savedSearches || []).find((ss) => ss.id === Number(form.id))!;
        updatedSavedSearch = await updateSavedSearch({
          id: form.id,
          name: savedSearch.name,
          query: savedSearchQuery,
          type: input?.savedSearch,
        }).unwrap();
      }
      showToast(form.mode === "create" ? "Tạo thành công" : "Lưu thành công");
      onChangeSearchParamsAll(
        {
          savedSearchId: updatedSavedSearch.id,
          page: 1,
          limit: filter.limit,
        } as T,
        true
      );
      return true;
    } catch (e) {
      if (isClientError(e)) {
        showErrorToast(e.data.message);
        return false;
      } else {
        throw e;
      }
    }
  };

  return {
    isFilter,
    activeTab,
    filter,
    tabs,
    onChangeSearchParams,
    onChangeSearchParamsAll,
    onRemoveSearchParams,
    onChangeTab,
    isFetchingSavedSearches: isFetchingSavedSearches && !savedSearches,
    isLoading,
    savedSearches: savedSearches || [],
    handleSubmitSavedSearch,
    loadingSavedSearchBtn: isCreatingSavedSearch || isUpdatingSavedSearch,
  };
};
