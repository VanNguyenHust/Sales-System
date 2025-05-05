import { useState } from "react";
import styled from "@emotion/styled";
import {
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
import { StopPropagation } from "app/components/StopPropagation";
import { TruncatedText2 } from "app/components/TruncatedText2";
import { SavedSearch } from "app/types";
import { useDatetime } from "app/utils/datetime";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useBackLink } from "app/utils/useBackLink";
import { useToggle } from "app/utils/useToggle";

import { SaveSearchDefaultTab } from "../../utils/constants";

import { BulkDeleteModal } from "./components/BulkDeleteModal";
import { BlogFilters } from "./components/list/BlogFilters";
import { BlogListSkeleton } from "./components/list/BlogListSkeleton";
import { useBlogFilter } from "./hooks/useBlogFilter";
import { useCountBlogQuery, useGetBlogsQuery } from "./api";

export default function BlogListPage() {
  const { backLink = "/admin/articles" } = useBackLink();
  const { formatDate } = useDatetime();

  //bulk action
  const {
    value: isOpenBulkDeleteModal,
    setFalse: closeBulkDeleteModal,
    setTrue: openBulkDeleteModal,
  } = useToggle(false);
  //end bulk action

  const [saveSearchItemDelete, setSaveSearchItemDelete] = useState<SavedSearch>();

  const { limit, page, query, activeTab, isEmptyFilter, changeLimit, changePage, changeSavedSearch } = useBlogFilter();

  const {
    data: blogs,
    isLoading: isLoadingBlogs,
    isFetching: isFetchingBlogs,
  } = useGetBlogsQuery(
    {
      name: query,
      page,
      limit,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: count = 0,
    isLoading: isLoadingBlogCount,
    isFetching: isFetchingBlogCount,
  } = useCountBlogQuery({ name: query }, { refetchOnMountOrArgChange: true });

  const { data: savedSearchs, isFetching: isFetchingSavedSearch } = useGetSavedSearchsQuery(
    { type: "blogs" },
    { refetchOnMountOrArgChange: true }
  );

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

  const { selectedResources, handleSelectionChange, clearSelection } = useIndexResourceState(blogs ?? [], {
    resourceIDResolver: (resource) => `${resource.id}`,
  });

  const rowMarkup = blogs?.map((item, index) => {
    const isSelected = selectedResources.some((r) => `${r}` === `${item.id}`);
    const strId = `${item.id}`;
    let commentableText = "";
    switch (item.commentable) {
      case "moderate":
        commentableText = "Chờ kiểm duyệt";
        break;
      case "yes":
        commentableText = "Tự động duyệt";
        break;
      default:
        commentableText = "Vô hiệu hóa";
        break;
    }

    return (
      <IndexTable.Row id={strId} key={strId} position={index} selected={isSelected}>
        <IndexTable.Cell>
          <StyledCell>
            <StopPropagation fitContent>
              <Link removeUnderline url={`/admin/blogs/${item.id}`} dataPrimaryLink>
                <TruncatedText2 as="span" maxWidth={800} variant="bodyMd">
                  {item.name}
                </TruncatedText2>
              </Link>
            </StopPropagation>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>{commentableText}</IndexTable.Cell>
        <IndexTable.Cell>{formatDate(item.modified_on ?? item.created_on, "dd/MM/yyyy HH:mm")}</IndexTable.Cell>
      </IndexTable.Row>
    );
  });

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

  const isLoading = isLoadingBlogs || isLoadingBlogCount;

  if (isLoading) {
    return <BlogListSkeleton />;
  }

  const isEmptyData = isEmptyFilter && count === 0;

  const isFetching = isFetchingSavedSearch || isFetchingBlogs || isFetchingBlogCount;

  const firstScreenMarkup = isEmptyData ? (
    <IndexEmptyState
      image={TwoBasketIcon}
      action={{
        content: "Thêm danh mục bài viết",
        icon: PlusCircleOutlineIcon,
        url: "/admin/blogs/create",
      }}
      heading="Chưa có danh mục bài viết nào"
    >
      <Text as="p" color="subdued">
        Tạo danh mục bài viết để quản lý hiệu quả và phân loại rõ ràng các bài viết, giúp người đọc dễ dàng tìm kiếm và
        truy cập nội dung mong muốn.
      </Text>
    </IndexEmptyState>
  ) : null;

  return (
    <Page
      fullWidth
      title="Danh mục bài viết"
      primaryAction={
        !isEmptyData
          ? {
              content: "Thêm danh mục bài viết",
              icon: PlusCircleOutlineIcon,
              url: "/admin/blogs/create",
            }
          : undefined
      }
      backAction={{
        url: backLink,
      }}
    >
      {isFetching ? <Loading /> : null}
      <DocumentTitle title="Danh mục bài viết" />
      {isEmptyData ? (
        firstScreenMarkup
      ) : (
        <Card>
          {tabsMarkup}
          <Card.Section>
            <BlogFilters removeSelected={clearSelection} />
          </Card.Section>
          <StyledTable>
            <IndexTable
              loading={isFetchingBlogs}
              onSelectionChange={handleSelectionChange}
              selectedItemsCount={selectedResources.length}
              itemCount={blogs?.length || 0}
              headings={[
                {
                  id: "blog",
                  title: "Tiêu đề",
                },
                {
                  id: "comment",
                  title: "Bình luận",
                },
                {
                  id: "modified_on",
                  title: "Ngày chỉnh sửa",
                },
              ]}
              promotedBulkActions={[
                {
                  content: "Xóa danh mục bài viết",
                  onAction: openBulkDeleteModal,
                },
              ]}
              resourceName={{ plural: "danh mục bài viết", singular: "danh mục bài viết" }}
              emptyState={
                <EmptySearchResult
                  action={{
                    content: "Xem tất cả danh mục bài viết",
                    url: "/admin/blogs",
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
        <BulkDeleteModal
          onClose={closeBulkDeleteModal}
          selectedResult={selectedResources}
          clearSelection={clearSelection}
          type="blog"
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
      <FooterHelp
        resource="danh mục bài viết"
        url="https://help.sapo.vn/huong-dan-cap-nhat-bai-viet-tren-sapo-web"
        external
      />
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
