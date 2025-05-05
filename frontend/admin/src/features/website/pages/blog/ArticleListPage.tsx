import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
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
import { CommentIcon, FileLinesIcon, PlusCircleOutlineIcon } from "@/ui-icons";

import { useDeleteSavedSearchMutation, useGetSavedSearchsQuery } from "app/api";
import TwoBasketIcon from "app/assets/icon/two-basket.svg";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { EmptySearchResult } from "app/components/EmptySearchResult";
import { FooterHelp } from "app/components/FooterHelp";
import { IndexEmptyState } from "app/components/IndexEmptyState";
import { Pagination } from "app/components/Pagination";
import { ProductThumbnail } from "app/components/ProductThumbnail";
import { StopPropagation } from "app/components/StopPropagation";
import { TruncatedText2 } from "app/components/TruncatedText2";
import { SavedSearch } from "app/types";
import { useDatetime } from "app/utils/datetime";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useToggle } from "app/utils/useToggle";

import { SaveSearchDefaultTab } from "../../utils/constants";

import { BulkDeleteModal } from "./components/BulkDeleteModal";
import { ArticleFilters } from "./components/list/ArticleFilters";
import { ArticleListSkeleton } from "./components/list/ArticleListSkeleton";
import { BulkTagsModal } from "./components/list/BulkTagsModal";
import { useArticleFilter } from "./hooks/useArticleFilter";
import { useGenArticleFilter } from "./hooks/useGenArticleFilter";
import { useBulkUpdateArticleMutation, useGetBlogsQuery, useSearchArticlesQuery } from "./api";

export default function ArticleListPage() {
  const { formatDate } = useDatetime();

  //bulk action
  const {
    value: isOpenBulkDeleteModal,
    setFalse: closeBulkDeleteModal,
    setTrue: openBulkDeleteModal,
  } = useToggle(false);
  const {
    value: isOpenBulkAddTagModal,
    setTrue: openBulkAddTagModal,
    setFalse: closeBulkAddTagModal,
  } = useToggle(false);
  const {
    value: isOpenBulkDeleteTagModal,
    toggle: openBulkDeleteTagModal,
    setFalse: closeBulkDeleteTagModal,
  } = useToggle(false);
  //end bulk action

  const [saveSearchItemDelete, setSaveSearchItemDelete] = useState<SavedSearch>();

  const { filter, limit, page, query, activeTab, isEmptyFilter, changeLimit, changePage, changeSavedSearch } =
    useArticleFilter();

  const { toApiParams } = useGenArticleFilter();

  const {
    data,
    isLoading: isLoadingArticles,
    isFetching: isFetchingArticles,
  } = useSearchArticlesQuery(
    {
      ...toApiParams(filter, query),
      sort: "modified_on:desc",
      page,
      limit,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { articles, count } = data || { articles: [], count: 0 };

  const idsBlog = useMemo(() => {
    return [...new Set((articles || []).flatMap((article) => article.blog_id))];
  }, [articles]);

  const {
    data: blogs,
    isLoading: isLoadingBlogs,
    isFetching: isFetchingBlogs,
  } = useGetBlogsQuery(
    {
      ids: idsBlog.join(","),
    },
    {
      skip: idsBlog.length === 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: savedSearchs, isFetching: isFetchingSavedSearch } = useGetSavedSearchsQuery(
    { type: "articles" },
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

  const { selectedResources, handleSelectionChange, clearSelection } = useIndexResourceState(articles ?? [], {
    resourceIDResolver: (resource) => `${resource.id}`,
  });

  const rowMarkup = articles?.map((item, index) => {
    const isSelected = selectedResources.some((r) => `${r}` === `${item.id}`);
    const strId = `${item.id}`;
    const blog = blogs?.find((blog) => blog.id === item.blog_id);
    const isPublished = !!item.published_on && new Date(item.published_on) < new Date();
    return (
      <IndexTable.Row id={strId} key={strId} position={index} selected={isSelected}>
        <IndexTable.Cell>
          <StyleImageCell>
            <ProductThumbnail alt={item.image?.alt} src={item.image?.src} />
          </StyleImageCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell>
            <StopPropagation fitContent>
              <Link removeUnderline url={`/admin/articles/${item.id}`} dataPrimaryLink>
                <TruncatedText2 as="span" maxWidth={800} variant="bodyMd">
                  {item.title}
                </TruncatedText2>
              </Link>
            </StopPropagation>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell>
            <StopPropagation fitContent>
              {blog ? (
                <Link url={`/admin/blogs/${item.blog_id}`} removeUnderline>
                  {blog.name}
                </Link>
              ) : (
                ""
              )}
            </StopPropagation>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <TruncatedText2 as="span">{item.author}</TruncatedText2>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge status={isPublished ? "success" : "default"}>{isPublished ? "Hiển thị" : "Ẩn"}</Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          {item.published_on ? formatDate(item.published_on, "dd/MM/yyyy HH:mm") : "--"}
        </IndexTable.Cell>
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

  const [bulkUpdateArticle, { isLoading: isLoadingBulkUpdate }] = useBulkUpdateArticleMutation();
  const handleBulkPublished = async (isUnpublished?: boolean) => {
    try {
      await bulkUpdateArticle({
        operation: isUnpublished ? "unpublish" : "publish",
        ids: selectedResources.map(Number),
      }).unwrap();
      showToast(isUnpublished ? "Ẩn bài viết thành công" : "Hiển thị bài viết thành công");
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const isLoading = isLoadingArticles || isLoadingBlogs;

  if (isLoading) {
    return <ArticleListSkeleton />;
  }

  const isEmptyData = isEmptyFilter && count === 0;

  const isFetching = isFetchingSavedSearch || isFetchingArticles || isFetchingBlogs;

  const firstScreenMarkup = isEmptyData ? (
    <IndexEmptyState
      image={TwoBasketIcon}
      action={{
        content: "Thêm bài viết",
        icon: PlusCircleOutlineIcon,
        url: "/admin/articles/create",
      }}
      heading="Blog chưa có bài viết nào"
    >
      <Text as="p" color="subdued">
        Thêm mới bài viết cho blog tại đây
      </Text>
    </IndexEmptyState>
  ) : null;

  return (
    <Page
      fullWidth
      title="Bài viết"
      primaryAction={
        !isEmptyData
          ? {
              content: "Thêm bài viết",
              icon: PlusCircleOutlineIcon,
              url: "/admin/articles/create",
            }
          : undefined
      }
      secondaryActions={
        !isEmptyData
          ? [
              {
                content: "Danh mục bài viết",
                icon: FileLinesIcon,
                url: "/admin/blogs",
              },
              {
                content: "Tất cả bình luận",
                icon: CommentIcon,
                url: "/admin/comments",
              },
            ]
          : undefined
      }
    >
      {isFetching || isLoadingBulkUpdate ? <Loading /> : null}
      <DocumentTitle title="Bài viết" />
      {isEmptyData ? (
        firstScreenMarkup
      ) : (
        <Card>
          {tabsMarkup}
          <Card.Section>
            <ArticleFilters removeSelected={clearSelection} />
          </Card.Section>
          <StyledTable>
            <IndexTable
              loading={isFetchingArticles}
              onSelectionChange={handleSelectionChange}
              selectedItemsCount={selectedResources.length}
              itemCount={articles?.length || 0}
              headings={[
                {
                  id: "image",
                  title: "",
                },
                {
                  id: "title",
                  title: "Tiêu đề",
                },
                {
                  id: "blog",
                  title: "Danh mục bài viết",
                },
                {
                  id: "author",
                  title: "Tác giả",
                },
                {
                  id: "status",
                  title: "Trạng thái",
                },
                {
                  id: "published_on",
                  title: "Ngày đăng",
                },
                {
                  id: "modified_on",
                  title: "Ngày cập nhật",
                },
              ]}
              promotedBulkActions={[
                {
                  content: "Hiển thị",
                  onAction: () => handleBulkPublished(),
                },
                {
                  content: "Ẩn",
                  onAction: () => handleBulkPublished(true),
                },
                {
                  content: "Thêm tag",
                  onAction: openBulkAddTagModal,
                },
                {
                  content: "Xóa tag",
                  onAction: openBulkDeleteTagModal,
                },
                {
                  content: "Xóa bài viết",
                  onAction: openBulkDeleteModal,
                },
              ]}
              resourceName={{ plural: "bài viết", singular: "bài viết" }}
              emptyState={
                <EmptySearchResult
                  action={{
                    content: "Xem tất cả bài viết",
                    url: "/admin/articles",
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
          type="article"
        />
      ) : null}
      {(isOpenBulkAddTagModal || isOpenBulkDeleteTagModal) && (
        <BulkTagsModal
          onClose={() => {
            closeBulkAddTagModal();
            closeBulkDeleteTagModal();
          }}
          selectedResources={selectedResources}
          countArticle={selectedResources.length}
          isDelete={isOpenBulkDeleteTagModal}
        />
      )}
      {saveSearchItemDelete ? (
        <ConfirmModal
          title="Xóa bộ lọc"
          body={
            <>
              Bạn có chắc muốn xóa bộ lọc <strong>{saveSearchItemDelete.name}</strong>?. Thao tác này không thể khôi
              phục.
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
      <FooterHelp resource="bài viết" url="https://help.sapo.vn/huong-dan-cap-nhat-bai-viet-tren-sapo-web" external />
    </Page>
  );
}

const StyledCell = styled.div`
  white-space: normal;
`;
const StyleImageCell = styled.div`
  white-space: normal;
  width: ${(p) => p.theme.spacing(10)};
`;
const StyledTable = styled.div`
  td {
    &:nth-child(2) {
      padding: ${(p) => p.theme.spacing(2, 2, 2, 0)};
    }
    &:has(${StyleImageCell}) {
      width: ${(p) => p.theme.spacing(10)};
    }
  }
`;
