import { useState } from "react";
import styled from "@emotion/styled";
import {
  Button,
  Card,
  IndexTable,
  Link,
  Loading,
  Page,
  type TabDescriptor,
  Tabs,
  Text,
  Tooltip,
  useIndexResourceState,
} from "@/ui-components";
import { ImportIcon, PlusCircleOutlineIcon, TrashFullIcon } from "@/ui-icons";

import { useDeleteSavedSearchMutation, useGetSavedSearchsQuery } from "app/api";
import IllusIcon from "app/assets/icon/icon-illus.svg";
import { ActionSuccessModal } from "app/components/ActionSuccessModal";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { EmptySearchResult } from "app/components/EmptySearchResult";
import { FooterHelp } from "app/components/FooterHelp";
import { IndexEmptyState } from "app/components/IndexEmptyState";
import { Pagination } from "app/components/Pagination";
import { StopPropagation } from "app/components/StopPropagation";
import { TruncatedText2 } from "app/components/TruncatedText2";
import { SavedSearch } from "app/types";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useBackLink } from "app/utils/useBackLink";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useTenant } from "app/utils/useTenant";
import { useToggle } from "app/utils/useToggle";

import { Redirect } from "../../types";
import { SaveSearchDefaultTab } from "../../utils/constants";

import { CreateModal } from "./components/CreateModal";
import { ImportModal } from "./components/ImportModal";
import { RedirectFilters } from "./components/RedirectFilters";
import { RedirectListSkeleton } from "./components/RedirectListSkeleton";
import { useFilter } from "./hooks/useFilter";
import { useGenFilter } from "./hooks/useGenFilter";
import {
  useBulkDeleteRedirectMutation,
  useCountRedirectQuery,
  useDeleteRedirectMutation,
  useGetRedirectsQuery,
} from "./api";

export default function RedirectListPage() {
  const { backLink = "/admin/links" } = useBackLink();
  const currentUser = useCurrentUser();
  const { getOnlineStoreUrl } = useTenant();
  //bulk action
  const {
    value: isOpenBulkDeleteModal,
    setFalse: closeBulkDeleteModal,
    setTrue: openBulkDeleteModal,
  } = useToggle(false);
  //end bulk action

  const [redirectItemDelete, setRedirectItemDelete] = useState<Redirect>();
  const [savedSearchItemDelete, setSavedSearchItemDelete] = useState<SavedSearch>();

  //import
  const { value: isOpenImportModal, setFalse: closeImportModal, setTrue: openImportModal } = useToggle(false);
  const {
    value: isOpenImportSuccessModal,
    setFalse: closeImportSuccessModal,
    setTrue: openImportSuccessModal,
  } = useToggle(false);
  //end import

  const { value: isOpenCreateModal, setFalse: closeCreateModal, setTrue: openCreateModal } = useToggle(false);

  const { filter, limit, page, query, activeTab, isEmptyFilter, changeLimit, changePage, changeSavedSearch } =
    useFilter();

  const { toApiParams } = useGenFilter();

  const {
    data: redirects,
    isLoading: isLoadingRedirects,
    isFetching: isFetchingRedirects,
  } = useGetRedirectsQuery(
    {
      ...toApiParams(filter, query),
      page,
      limit,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: count = 0,
    isLoading: isLoadingRedirectCount,
    isFetching: isFetchingRedirectCount,
  } = useCountRedirectQuery(
    {
      ...toApiParams(filter, query),
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: savedSearchs, isFetching: isFetchingSavedSearch } = useGetSavedSearchsQuery(
    { type: "redirects" },
    { refetchOnMountOrArgChange: true }
  );

  const [deleteSavedSearch, { isLoading: isDeletingSavedSearch }] = useDeleteSavedSearchMutation();
  const [deleteRedirect, { isLoading: isDeletingRedirect }] = useDeleteRedirectMutation();
  const [bulkDeleteRedirect, { isLoading: isBulkDeletingRedirect }] = useBulkDeleteRedirectMutation();

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
        setSavedSearchItemDelete((savedSearchs || []).find((ss) => ss.id === Number(tabs[tabIndex].id)))
      }
      onSelect={(tabIndex) => {
        changeSavedSearch(tabs[tabIndex].id);
        clearSelection();
      }}
      tabs={tabs}
    />
  );

  const handleRemoveSavedSearch = async () => {
    try {
      await deleteSavedSearch(savedSearchItemDelete?.id as number).unwrap();
      changeSavedSearch(SaveSearchDefaultTab.all.id);
      setSavedSearchItemDelete(undefined);
      showToast("Xóa bộ lọc thành công");
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const handleDeleteRedirect = async () => {
    try {
      await deleteRedirect(redirectItemDelete?.id as number).unwrap();
      setRedirectItemDelete(undefined);
      showToast("Xóa chuyển hướng thành công");
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const { selectedResources, handleSelectionChange, clearSelection } = useIndexResourceState(redirects ?? [], {
    resourceIDResolver: (resource) => `${resource.id}`,
  });

  const handleBulkDeleteRedirect = async () => {
    try {
      await bulkDeleteRedirect(selectedResources.map(Number)).unwrap();
      showToast(`Tiến trình xóa ${selectedResources.length} chuyển hướng đang được thực hiện`);
      clearSelection();
      closeBulkDeleteModal();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const rowMarkup = redirects?.map((item, index) => {
    const isSelected = selectedResources.some((r) => `${r}` === `${item.id}`);
    const strId = `${item.id}`;
    return (
      <IndexTable.Row id={item.id.toString()} key={item.id.toString()} position={index} selected={isSelected}>
        <IndexTable.Cell>
          <StyledCell>
            <TruncatedText2 variant="bodyMd" as="span" lineClamp={1}>
              {item.path}
            </TruncatedText2>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TruncatedText2 variant="bodyMd" as="span" lineClamp={1}>
            <StopPropagation fitContent>
              <Link
                removeUnderline
                url={item.target.startsWith("/") ? getOnlineStoreUrl(item.target) : item.target}
                external
              >
                {item.target}
              </Link>
            </StopPropagation>
          </TruncatedText2>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell style={{ textAlign: "right" }}>
            <StopPropagation>
              <Tooltip content="Xóa chuyển hướng" dismissOnMouseOut>
                <Button icon={TrashFullIcon} plain onClick={() => setRedirectItemDelete(item)} />
              </Tooltip>
            </StopPropagation>
          </StyledCell>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const isEmptyData = isEmptyFilter && count === 0 && !isLoadingRedirects && !isLoadingRedirectCount;

  const isFetching = isFetchingSavedSearch || isFetchingRedirects || isFetchingRedirectCount;

  const isLoading = isLoadingRedirects || isLoadingRedirectCount;

  if (isLoading) {
    return <RedirectListSkeleton />;
  }

  const firstScreenMarkup = isEmptyData ? (
    <IndexEmptyState
      image={IllusIcon}
      action={{
        content: "Thêm chuyển hướng",
        icon: PlusCircleOutlineIcon,
        onAction: openCreateModal,
      }}
      secondaryAction={{
        content: "Nhập file",
        icon: ImportIcon,
        onAction: openImportModal,
      }}
      heading="Quản lý chuyển hướng truy cập"
    >
      <Text as="p" color="subdued">
        Chuyển hướng khi khách hàng truy cập các đường dẫn cũ không tồn tại.
      </Text>
    </IndexEmptyState>
  ) : null;

  return (
    <Page
      fullWidth
      title="Chuyển hướng 301"
      primaryAction={
        !isEmptyData
          ? {
              content: "Thêm chuyển hướng",
              icon: PlusCircleOutlineIcon,
              onAction: openCreateModal,
            }
          : undefined
      }
      backAction={{
        url: backLink,
      }}
      secondaryActions={
        !isEmptyData
          ? [
              {
                content: "Nhập file",
                icon: ImportIcon,
                onAction: openImportModal,
              },
            ]
          : undefined
      }
    >
      {isFetching ? <Loading /> : null}
      <DocumentTitle title="Chuyển hướng 301" />
      {isEmptyData ? (
        firstScreenMarkup
      ) : (
        <Card>
          {tabsMarkup}
          <Card.Section>
            <RedirectFilters removeSelected={clearSelection} />
          </Card.Section>
          <StyledTable>
            <IndexTable
              loading={isFetchingRedirects}
              onSelectionChange={handleSelectionChange}
              selectedItemsCount={selectedResources.length}
              itemCount={redirects?.length || 0}
              headings={[
                {
                  id: "path",
                  title: "Đường dẫn cũ",
                },
                {
                  id: "target",
                  title: "Chuyển hướng",
                },
                {
                  id: "actions",
                  title: "",
                  alignment: "end",
                },
              ]}
              promotedBulkActions={[
                {
                  content: "Xóa chuyển hướng",
                  onAction: openBulkDeleteModal,
                },
              ]}
              resourceName={{ plural: "chuyển hướng", singular: "chuyển hướng" }}
              emptyState={
                <EmptySearchResult
                  action={{
                    content: "Xem tất cả chuyển hướng",
                    url: "/admin/redirects",
                  }}
                />
              }
            >
              {rowMarkup}
            </IndexTable>
          </StyledTable>
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
            content: "Xóa chuyển hướng",
            loading: isBulkDeletingRedirect,
            destructive: true,
            onAction: handleBulkDeleteRedirect,
          }}
          title="Xóa chuyển hướng"
          body={
            <>
              Bạn có chắc chắn muốn xóa <strong>{selectedResources.length}</strong> chuyển hướng đã chọn. Thao tác này
              không thể khôi phục.
            </>
          }
        />
      ) : null}
      {savedSearchItemDelete ? (
        <ConfirmModal
          open
          title="Xóa bộ lọc"
          body={
            <>
              Bạn có chắc muốn xóa bộ lọc <strong>{savedSearchItemDelete.name || ""}</strong>
              ?. Thao tác này không thể khôi phục.
            </>
          }
          onDismiss={() => setSavedSearchItemDelete(undefined)}
          confirmAction={{
            content: "Xóa bộ lọc",
            destructive: true,
            loading: isDeletingSavedSearch,
            onAction: handleRemoveSavedSearch,
          }}
        />
      ) : null}
      {redirectItemDelete ? (
        <ConfirmModal
          title="Xóa chuyển hướng"
          body={
            <>
              Bạn có chắc muốn xóa chuyển hướng <strong>{redirectItemDelete.target}</strong>? Thao tác này không thể
              khôi phục
            </>
          }
          open
          onDismiss={() => setRedirectItemDelete(undefined)}
          confirmAction={{
            content: "Xóa chuyển hướng",
            destructive: true,
            loading: isDeletingRedirect,
            onAction: handleDeleteRedirect,
          }}
        />
      ) : null}
      {isOpenCreateModal ? <CreateModal onClose={closeCreateModal} /> : null}
      {isOpenImportModal ? (
        <ImportModal
          onClose={closeImportModal}
          onSuccess={() => {
            closeImportModal();
            openImportSuccessModal();
          }}
        />
      ) : null}
      {isOpenImportSuccessModal ? (
        <ActionSuccessModal
          open
          onClose={closeImportSuccessModal}
          heading="Nhập file danh sách chuyển hướng 301 thành công!"
          description={
            currentUser.email ? (
              <>
                Dữ liệu sẽ được xử lý và gửi thông báo về email: &nbsp;
                <Text as="span" fontWeight="medium">
                  {currentUser.email}
                </Text>
              </>
            ) : (
              <>
                Dữ liệu sẽ được xử lý và gửi thông báo{" "}
                <Link url="/admin/adminnotifications?category=system">tại đây</Link>
              </>
            )
          }
        />
      ) : null}
      <FooterHelp resource="chuyển hướng 301" url="https://help.sapo.vn/chuyen-huong-301" external />
    </Page>
  );
}

const StyledCell = styled.div`
  white-space: normal;
`;

const StyledTable = styled.div`
  td {
    &:nth-child(2) {
      padding: ${(p) => p.theme.spacing(2, 2, 2, 0)};
    }
  }
`;
