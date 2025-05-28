import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { TabType } from "../type";

enum FiltersQuery {
  page = "page",
  tab = "tab",
}

export function useMetafieldDefinitionFilters() {
  const [queryParams, setQueryParams] = useSearchParams();

  const { page, activeTab } = useMemo(() => {
    // eslint-disable-next-line prefer-const
    let { page, activeTab } = fromQueryParams(queryParams);
    return { page, activeTab };
  }, [queryParams]);

  const changePage = (page: number) => {
    if (page > 1) {
      queryParams.set(FiltersQuery.page, page.toString());
    } else {
      queryParams.delete(FiltersQuery.page);
    }
    setQueryParams(queryParams);
  };

  const changeActiveTab = (tab: TabType, page?: number) => {
    if (tab !== TabType.DEFINITION) {
      queryParams.set(FiltersQuery.tab, tab);
    } else {
      queryParams.delete(FiltersQuery.tab);
    }
    if (page && page > 1) {
      queryParams.set(FiltersQuery.page, page.toString());
    } else {
      queryParams.delete(FiltersQuery.page);
    }
    setQueryParams(queryParams);
  };

  return {
    page,
    activeTab,
    changePage,
    changeActiveTab,
  };
}

function fromQueryParams(qs: URLSearchParams): {
  page: number;
  activeTab: TabType;
} {
  let page = 1;
  const pageQ = qs.get(FiltersQuery.page);
  if (pageQ !== null) {
    const parsed = parseInt(pageQ);
    if (!isNaN(parsed) && parsed > 0) {
      page = parsed;
    }
  }

  let activeTab = TabType.DEFINITION;
  const activeTabQ = qs.get(FiltersQuery.tab);
  if (activeTabQ !== null) {
    if (Object.values(TabType).includes(activeTabQ as TabType)) {
      activeTab = activeTabQ as TabType;
    }
  }
  return { page, activeTab };
}
