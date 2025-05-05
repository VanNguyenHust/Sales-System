import { useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  Badge,
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
import { DoneAllIcon, FlagOutlineIcon, TrashFullIcon } from "@/ui-icons";

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

import { CommentStatus } from "../../types";
import { SaveSearchDefaultTab } from "../../utils/constants";

import { BulkDeleteModal } from "./components/BulkDeleteModal";
import { CommentFilters } from "./components/list/CommentFilters";
import { CommentListSkeleton } from "./components/list/CommentListSkeleton";
import { useCommentFilter } from "./hooks/useCommentFilter";
import { useGenCommentFilter } from "./hooks/useGenCommentFilter";
import {
  useApproveCommentMutation,
  useBulkUpdateStatusCommentMutation,
  useCountCommentQuery,
  useDeleteCommentMutation,
  useGetArticlesQuery,
  useGetCommentsQuery,
  useMarkAsNotSpamMutation,
  useMarkAsSpamMutation,
} from "./api";

export default function CommentListPage() {
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

  const { filter, limit, page, query, activeTab, isEmptyFilter, changeLimit, changePage, changeSavedSearch } =
    useCommentFilter();

  const { toApiParams } = useGenCommentFilter();

  const {
    data: comments,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useGetCommentsQuery(
    {
      ...toApiParams(filter, query),
      page,
      limit,
    },
    { refetchOnMountOrArgChange: true }
  );

  const {
    data: count = 0,
    isLoading: isLoadingCommentCount,
    isFetching: isFetchingCommentCount,
  } = useCountCommentQuery(toApiParams(filter, query), { refetchOnMountOrArgChange: true });

  const idsArticle = useMemo(() => {
    return [...new Set((comments || []).flatMap((comment) => comment.article_id))];
  }, [comments]);

  const {
    data: articles,
    isLoading: isLoadingArticles,
    isFetching: isFetchingArticles,
  } = useGetArticlesQuery(
    {
      ids: idsArticle.join(","),
    },
    {
      skip: idsArticle.length === 0,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: savedSearchs, isFetching: isFetchingSavedSearch } = useGetSavedSearchsQuery(
    { type: "comments" },
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

  const [approveComment, { isLoading: isLoadingApproveComment }] = useApproveCommentMutation();
  const [markAsNotSpamComment, { isLoading: isMarkingAsNotSpamComment }] = useMarkAsNotSpamMutation();
  const [markAsSpamComment, { isLoading: isMarkingAsSpamComment }] = useMarkAsSpamMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [bulkUpdateStatus, { isLoading: isBulkUpdatingStatus }] = useBulkUpdateStatusCommentMutation();

  const [idChangingStatus, setIdChangingStatus] = useState<number>(0);

  const [commentIdDelete, setCommentIdDelete] = useState<number>();

  const handleChangeStatus = async (id: number, status: CommentStatus) => {
    setIdChangingStatus(id);
    try {
      switch (status) {
        case CommentStatus.SPAM:
          await markAsNotSpamComment(id);
          showToast("Đã bỏ đánh dấu bình luận là spam");
          break;
        case CommentStatus.UNAPPROVED:
          await approveComment(id);
          showToast("Đã duyệt bình luận");
          break;
        default:
          await markAsSpamComment(id);
          showToast("Đã đánh dấu bình luận là spam");
          break;
      }
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment(commentIdDelete as number).unwrap();
      setCommentIdDelete(undefined);
      showToast("Xoá bình luận thành công");
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const { selectedResources, handleSelectionChange, clearSelection } = useIndexResourceState(comments ?? [], {
    resourceIDResolver: (resource) => `${resource.id}`,
  });

  const [idsHasShowBody, setIdsHasShowBody] = useState<number[]>([]);
  const rowMarkup = comments?.map((item, index) => {
    const isSelected = selectedResources.some((r) => `${r}` === `${item.id}`);
    const article = articles?.find((article) => article.id === item.article_id);
    const bodyShort = item.body?.substring(0, 500) ?? "";
    const hasShowBody = idsHasShowBody.some((id) => id === item.id);
    return (
      <IndexTable.Row id={item.id.toString()} key={item.id.toString()} position={index} selected={isSelected}>
        <IndexTable.Cell>{formatDate(item.created_on, "dd/MM/yyyy HH:mm")}</IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell>
            <StyledCommentBody>
              <StopPropagation>
                <Text as="p" color="subdued">
                  {item.author} •{" "}
                  <Link removeUnderline url={`mailto:${item.email}`}>
                    {item.email}
                  </Link>
                </Text>
              </StopPropagation>
              <StopPropagation>
                <Link removeUnderline url={`/admin/articles/${item.article_id}`}>
                  <TruncatedText2 as="span" maxWidth={800} variant="bodyMd">
                    {article ? article.title : "—"}
                  </TruncatedText2>
                </Link>
              </StopPropagation>
              <StyledContent>
                {item.body && item.body.length > 500 && !hasShowBody ? (
                  <>
                    <Text as="p">{bodyShort}...</Text>
                    <StopPropagation>
                      <Button plain onClick={() => setIdsHasShowBody((prev) => [...prev, item.id])}>
                        Xem thêm
                      </Button>
                    </StopPropagation>
                  </>
                ) : (
                  <Text as="p">{item.body}</Text>
                )}
              </StyledContent>
            </StyledCommentBody>
          </StyledCell>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <Badge
            status={
              item.status === CommentStatus.PUBLISHED
                ? "success"
                : item.status === CommentStatus.UNAPPROVED
                ? "warning"
                : "critical"
            }
          >
            {item.status === CommentStatus.PUBLISHED
              ? "Đã duyệt"
              : item.status === CommentStatus.UNAPPROVED
              ? "Chờ duyệt"
              : "Spam"}
          </Badge>
        </IndexTable.Cell>
        <IndexTable.Cell>
          <StyledCell style={{ whiteSpace: "nowrap" }}>
            <StopPropagation>
              <StyledActions>
                <Tooltip
                  content={item.status === CommentStatus.PUBLISHED ? "Đánh dấu spam và ẩn" : "Hiển thị bình luận"}
                  dismissOnMouseOut
                >
                  <Button
                    icon={item.status === CommentStatus.PUBLISHED ? FlagOutlineIcon : DoneAllIcon}
                    plain
                    onClick={() => handleChangeStatus(item.id, item.status)}
                    loading={
                      idChangingStatus === item.id &&
                      (isLoadingApproveComment || isMarkingAsNotSpamComment || isMarkingAsSpamComment)
                    }
                  />
                </Tooltip>
                <Tooltip content="Xóa bình luận" dismissOnMouseOut>
                  <Button icon={TrashFullIcon} plain onClick={() => setCommentIdDelete(item.id)} />
                </Tooltip>
              </StyledActions>
            </StopPropagation>
          </StyledCell>
        </IndexTable.Cell>
      </IndexTable.Row>
    );
  });

  const handleUpdateStatus = async (operation: "spam" | "notspam" | "approve") => {
    try {
      const result = await bulkUpdateStatus({ ids: selectedResources.map((id) => parseInt(id)), operation }).unwrap();
      showToast(result.message);
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const isLoading = isLoadingComments || isLoadingCommentCount || isLoadingArticles;

  if (isLoading) {
    return <CommentListSkeleton />;
  }

  const isEmptyData = isEmptyFilter && count === 0;

  const isFetching = isFetchingSavedSearch || isFetchingComments || isFetchingCommentCount || isFetchingArticles;

  const firstScreenMarkup = isEmptyData ? (
    <IndexEmptyState image={TwoBasketIcon} heading="Chưa có bình luận">
      <Text as="p" color="subdued">
        Các bình luận trong bài viết sẽ xuất hiện tại đây
      </Text>
    </IndexEmptyState>
  ) : null;

  return (
    <Page
      fullWidth
      title="Bình luận"
      backAction={{
        url: backLink,
      }}
    >
      {isFetching || isBulkUpdatingStatus ? <Loading /> : null}
      <DocumentTitle title="Bình luận" />
      {isEmptyData ? (
        firstScreenMarkup
      ) : (
        <Card>
          {tabsMarkup}
          <Card.Section>
            <CommentFilters removeSelected={clearSelection} />
          </Card.Section>
          <StyledTable>
            <IndexTable
              loading={isFetchingComments}
              onSelectionChange={handleSelectionChange}
              selectedItemsCount={selectedResources.length}
              itemCount={comments?.length || 0}
              headings={[
                {
                  id: "created_on",
                  title: "Ngày đăng",
                },
                {
                  id: "body",
                  title: "Bình luận",
                },
                {
                  id: "status",
                  title: "Trạng thái",
                },
                {
                  id: "actions",
                  title: "Thao tác",
                },
              ]}
              promotedBulkActions={[
                {
                  content: "Đánh dấu spam",
                  onAction: () => handleUpdateStatus("spam"),
                },
                {
                  content: "Bỏ đánh dấu spam",
                  onAction: () => handleUpdateStatus("notspam"),
                },
                {
                  content: "Duyệt",
                  onAction: () => handleUpdateStatus("approve"),
                },
                {
                  content: "Xóa",
                  onAction: openBulkDeleteModal,
                },
              ]}
              resourceName={{ plural: "bình luận", singular: "bình luận" }}
              emptyState={
                <EmptySearchResult
                  action={{
                    content: "Xem tất cả bình luận",
                    url: "/admin/comments",
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
          type="comment"
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
      {commentIdDelete ? (
        <ConfirmModal
          title="Xóa bình luận"
          body="Bạn có chắc muốn xóa bình luận này? Thao tác này không thể khôi phục"
          open
          onDismiss={() => setCommentIdDelete(undefined)}
          confirmAction={{
            destructive: true,
            loading: isDeletingComment,
            onAction: handleDeleteComment,
          }}
        />
      ) : null}
      <FooterHelp resource="bình luận" url="https://help.sapo.vn/huong-dan-cap-nhat-bai-viet-tren-sapo-web" external />
    </Page>
  );
}

const StyledCell = styled.div`
  white-space: normal;
  vertical-align: top;
`;

const StyledTable = styled.div`
  tbody {
    td {
      vertical-align: top;
    }
  }
  td:not(:nth-child(3)) {
    padding-top: ${(p) => p.theme.spacing(4)};
  }
`;

const StyledCommentBody = styled.div`
  display: flex;
  gap: ${(p) => `calc(${p.theme.spacing(1)} + ${p.theme.spacing(0.5)})`};
  flex-direction: column;
  align-items: flex-start;
  min-width: 400px;
  p {
    cursor: default;
    display: inline-flex;
    gap: ${(p) => p.theme.spacing(1)};
  }
`;

const StyledContent = styled.div`
  padding: ${(p) => p.theme.spacing(1, 2)};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  background: ${(p) => p.theme.colors.surfaceNeutral};
  width: 100%;
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(3)};
`;
