import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  type ActionListItemDescriptor,
  Badge,
  Card,
  IndexTable,
  Link,
  Loading,
  Page,
  type TabDescriptor,
  Tabs,
  Text,
  useIndexResourceState,
} from "@/ui-components";
import { PlusCircleOutlineIcon } from "@/ui-icons";

import { useDeleteSavedSearchMutation, useGetSavedSearchsQuery } from "app/api";
import TwoBasketIcon from "app/assets/icon/two-basket.svg";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { EmptySearchResult } from "app/components/EmptySearchResult";
import { FooterHelp } from "app/components/FooterHelp";
import { IndexEmptyState } from "app/components/IndexEmptyState";
import { Pagination } from "app/components/Pagination";
import { TruncatedText2 } from "app/components/TruncatedText2";
import { useGetAppLinksQuery } from "app/features/app/api";
import { getAppLinkActions } from "app/features/app/utils/app";
import { SavedSearch } from "app/types";
import { useDatetime } from "app/utils/datetime";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useToggle } from "app/utils/useToggle";

import { SaveSearchDefaultTab } from "../../utils/constants";

import { PageFilters } from "./components/PageFilters";
import { PageListSkeleton } from "./components/PageListSkeleton";
import { useFilter } from "./hooks/useFilter";
import { useGenFilter } from "./hooks/useGenFilter";
import { stripHtmlNewlines } from "./utils/text";
import { useBulkDeletePageMutation, useBulkUpdateStatusPageMutation, useCountPageQuery, useGetPagesQuery } from "./api";

export default function PageListPage() {
  const { formatDate } = useDatetime();

  //bulk action
  const {
    value: isOpenBulkDeleteModal,
    setFalse: closeBulkDeleteModal,
    setTrue: openBulkDeleteModal,
  } = useToggle(false);
  //end bulk action

  const [bulkUpdateStatus, { isLoading: isBulkUpdatingStatus }] = useBulkUpdateStatusPageMutation();

  const [saveSearchItemDelete, setSaveSearchItemDelete] = useState<SavedSearch>();

  const { filter, limit, page, query, activeTab, isEmptyFilter, changeLimit, changePage, changeSavedSearch } =
    useFilter();

  const { toApiParams } = useGenFilter();

  const {
    data: pages,
    isLoading: isLoadingPages,
    isFetching: isFetchingPages,
  } = useGetPagesQuery(
    {
      ...toApiParams(filter, query),
      page,
      limit,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: appLinks,
    isFetching: isFetchingAppLinks,
    isLoading: isLoadingAppLinks,
  } = useGetAppLinksQuery(
    { type: "pages", location: "index" },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: count = 0,
    isLoading: isLoadingPageCount,
    isFetching: isFetchingPageCount,
  } = useCountPageQuery(
    {
      ...toApiParams(filter, query),
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: savedSearchs,
    isFetching: isFetchingSavedSearch,
    isLoading: isLoadingSavedSearch,
  } = useGetSavedSearchsQuery({ type: "pages" }, { refetchOnMountOrArgChange: true });

  const [deleteSavedSearch, { isLoading: isDeletingSavedSearch }] = useDeleteSavedSearchMutation();

  const tabs: TabDescriptor[] = [
    {
      id: SaveSearchDefaultTab.all.id,
      content: SaveSearchDefaultTab.all.name,
      canDelete: false,
    },
    ...(savedSearchs || []).map((ss) => ({
      id: `${ss.id}`,
      content: ss.name,
      canDelete: true,
    })),
  ];

  if (activeTab === SaveSearchDefaultTab.search.id) {
    tabs.push({
      id: SaveSearchDefaultTab.search.id,
      content: SaveSearchDefaultTab.search.name,
    });
  }

  const selectedTabIndex = tabs.findIndex((t) => t.id === activeTab) || 0;
  const tabsMarkup = (
    <Tabs
      selected={selectedTabIndex}
      onDelete={(tabIndex) =>
        setSaveSearchItemDelete((savedSearchs || []).find((ss) => ss.id === Number(tabs[tabIndex].id)))
      }
      onSelect={(tabIndex) => {
        changeSavedSearch(tabs[tabIndex].id);
        clearSelection();
      }}
      tabs={tabs}
    />
  );

  const pageOtherActions = useMemo(() => getAppLinkActions(appLinks), [appLinks]);

  const { selectedResources, handleSelectionChange, clearSelection } = useIndexResourceState(pages ?? [], {
    resourceIDResolver: (resource) => `${resource.id}`,
  });

  const [bulkDeletePage, { isLoading: isBulkDeletingPage }] = useBulkDeletePageMutation();
  const handleBulkDelete = async () => {
    try {
      await bulkDeletePage(selectedResources.map(Number)).unwrap();
      showToast(`Tiến trình xóa ${selectedResources.length} trang nội dung đang được thực hiện`);
      setSaveSearchItemDelete(undefined);
      clearSelection();
      closeBulkDeleteModal();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const handleRemoveSavedSearch = async () => {
    try {
      await deleteSavedSearch(saveSearchItemDelete?.id as number).unwrap();
      changeSavedSearch(SaveSearchDefaultTab.all.id);
      setSaveSearchItemDelete(undefined);
      showToast("Xóa bộ lọc thành công");
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const handleUpdateStatus = async (operation: "publish" | "unpublish") => {
    try {
      await bulkUpdateStatus({ ids: selectedResources.map(Number), operation }).unwrap();
      showToast(operation === "unpublish" ? "Ẩn trang nội dung thành công" : "Hiển thị trang nội dung thành công");
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const isLoading = isLoadingPages || isLoadingPageCount || isLoadingSavedSearch || isLoadingAppLinks;

  if (isLoading) {
    return <PageListSkeleton />;
  }

  const isEmptyData = isEmptyFilter && count === 0;

  const isFetching = isFetchingSavedSearch || isFetchingPages || isFetchingPageCount || isFetchingAppLinks;

  const firstScreenMarkup = isEmptyData ? (
    <IndexEmptyState
      image={TwoBasketIcon}
      action={{
        content: "Thêm trang nội dung",
        icon: PlusCircleOutlineIcon,
        url: "/admin/pages/create",
      }}
      heading="Tạo trang nội dung mới ngay"
    >
      <Text as="p" color="subdued">
        Trang nội dung giúp bạn cập nhật thông tin về các sự kiện, thông báo quan trọng, tin tức, chính sách v.v... đến
        với khách hàng một cách nhanh chóng.
      </Text>
    </IndexEmptyState>
  ) : null;

  const rowMarkup = pages?.map((item, index) => {
    const isSelected = selectedResources.some((r) => `${r}` === `${item.id}`);
    const strId = `${item.id}`;
    const isPublished = !!item.published_on && new Date(item.published_on) < new Date();
    const content = stripHtmlNewlines(item.content ?? "");
    return (
      <IndexTable.Row id={strId} key={strId} position={index} selected={isSelected}>
        <IndexTable.Cell>
          <TruncatedText2 as="span" variant="bodyMd" lineClamp={1}>
            <Link removeUnderline url={`/admin/pages/${item.id}`} dataPrimaryLink>
              {item.title}
            </Link>
          </TruncatedText2>
          <TruncatedText2 as="p" lineClamp={3}>
            {content.length > 100 ? `${content.substring(0, 100)}...` : content}
          </TruncatedText2>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={isPublished ? "success" : "default"}>{isPublished ? "Hiển thị" : "Ẩn"}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>{formatDate(item.modified_on ?? item.created_on, "dd/MM/yyyy HH:mm")}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  return (
    <Page
      fullWidth
      title="Trang nội dung"
      primaryAction={
        !isEmptyData
          ? {
              content: "Thêm trang nội dung",
              icon: PlusCircleOutlineIcon,
              url: "/admin/pages/create",
            }
          : undefined
      }
      actionGroups={
        pageOtherActions.length
          ? [
              {
                title: "Thao tác khác",
                actions: pageOtherActions,
              },
            ]
          : undefined
      }
    >
      {isFetching || isBulkUpdatingStatus ? <Loading /> : null}
      <DocumentTitle title="Trang nội dung" />
      {isEmptyData ? (
        firstScreenMarkup
      ) : (
        <Card>
          {tabsMarkup}
          <Card.Section>
            <PageFilters removeSelected={clearSelection} />
          </Card.Section>
          <IndexTable
            loading={isFetchingPages}
            onSelectionChange={handleSelectionChange}
            selectedItemsCount={selectedResources.length}
            itemCount={pages?.length || 0}
            headings={[
              {
                id: "title",
                title: "Tiêu đề",
              },
              {
                id: "status",
                title: "Trạng thái",
              },
              {
                id: "modified_on",
                title: "Ngày cập nhật",
              },
            ]}
            promotedBulkActions={[
              {
                content: "Hiển thị",
                onAction: () => handleUpdateStatus("publish"),
              },
              {
                content: "Ẩn",
                onAction: () => handleUpdateStatus("unpublish"),
              },
              {
                content: "Xóa trang nội dung",
                onAction: openBulkDeleteModal,
              },
            ]}
            resourceName={{ plural: "trang nội dung", singular: "trang nội dung" }}
            emptyState={
              <EmptySearchResult
                action={{
                  content: "Xem tất cả trang nội dung",
                  url: "/admin/pages",
                }}
              />
            }
          >
            {rowMarkup}
          </IndexTable>
          {count > 0 && (
            <Card.Section>
              <Pagination
                totalCount={count}
                currentPage={page || 1}
                perPage={limit || 20}
                onChangePerPage={changeLimit}
                onNavigate={changePage}
              />
            </Card.Section>
          )}
        </Card>
      )}
      {isOpenBulkDeleteModal ? (
        <ConfirmModal
          open
          onDismiss={closeBulkDeleteModal}
          confirmAction={{
            content: "Xóa trang nội dung",
            loading: isBulkDeletingPage,
            destructive: true,
            onAction: handleBulkDelete,
          }}
          title="Xóa trang nội dung"
          body={
            <>
              Bạn có chắc muốn xóa <strong>{selectedResources.length}</strong> trang nội dung đã chọn?. Thao tác này
              không thể khôi phục.
            </>
          }
        />
      ) : null}
      {saveSearchItemDelete ? (
        <ConfirmModal
          title="Xóa bộ lọc"
          body={
            <>
              Bạn có chắc muốn xóa bộ lọc <strong>{saveSearchItemDelete.name}</strong>
              ?. Thao tác này không thể khôi phục.
            </>
          }
          open
          onDismiss={() => setSaveSearchItemDelete(undefined)}
          confirmAction={{
            content: "Xóa bộ lọc",
            destructive: true,
            loading: isDeletingSavedSearch,
            onAction: handleRemoveSavedSearch,
          }}
        />
      ) : null}
      <FooterHelp resource="trang nội dung" url="https://help.sapo.vn/tim-hieu-ve-trang-noi-dung" external />
    </Page>
  );
}
