import { useState } from "react";
import styled from "@emotion/styled";
import {
  Badge,
  Button,
  Card,
  IndexTable,
  Link,
  SkeletonBodyText,
  Text,
  Tooltip,
  useIndexResourceState,
} from "@/ui-components";
import { DoneAllIcon, FlagOutlineIcon, TrashFullIcon } from "@/ui-icons";

import { ConfirmModal } from "app/components/ConfirmModal";
import { EmptySearchResult } from "app/components/EmptySearchResult";
import { Pagination } from "app/components/Pagination";
import { StopPropagation } from "app/components/StopPropagation";
import { Blog, Commentable, CommentStatus } from "app/features/website/types";
import { useDatetime } from "app/utils/datetime";
import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";
import { useToggle } from "app/utils/useToggle";

import {
  useApproveCommentMutation,
  useBulkUpdateStatusCommentMutation,
  useCountCommentQuery,
  useDeleteCommentMutation,
  useGetCommentsQuery,
  useMarkAsNotSpamMutation,
  useMarkAsSpamMutation,
} from "../../api";
import { useGenCommentFilter } from "../../hooks/useGenCommentFilter";
import { CommentFilterModel } from "../../types";
import { BulkDeleteModal } from "../BulkDeleteModal";
import { CommentFilters } from "../list/CommentFilters";

type Props = {
  articleId: number;
  blog: Blog;
};

export const ArticleCommentCard = ({ articleId, blog }: Props) => {
  const { formatDate } = useDatetime();
  const [page, setPage] = useState<number>(1);
  const [filter, setFilter] = useState<CommentFilterModel>({
    query: "",
    status: "",
  });

  const { toApiParams } = useGenCommentFilter();

  const {
    value: isOpenBulkDeleteModal,
    setFalse: closeBulkDeleteModal,
    setTrue: openBulkDeleteModal,
  } = useToggle(false);

  const {
    data: comments,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useGetCommentsQuery(
    {
      ...toApiParams(filter, filter.query),
      body: filter.query,
      article_id: articleId,
      page,
      limit: 10,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: count = 0, isLoading: isLoadingCommentCount } = useCountCommentQuery(
    {
      ...toApiParams(filter, filter.query),
      body: filter.query,
      article_id: articleId,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: totalCount = 0, isLoading: isLoadingTotalCount } = useCountCommentQuery({
    article_id: articleId,
  });

  const [approveComment, { isLoading: isLoadingApproveComment }] = useApproveCommentMutation();
  const [markAsNotSpamComment, { isLoading: isLoadingMarkAsNotSpamComment }] = useMarkAsNotSpamMutation();
  const [markAsSpamComment, { isLoading: isLoadingMarkAsSpamComment }] = useMarkAsSpamMutation();
  const [deleteComment, { isLoading: isLoadingDeleteComment }] = useDeleteCommentMutation();
  const [bulkUpdateStatus] = useBulkUpdateStatusCommentMutation();

  const [commentIdDelete, setCommentIdDelete] = useState<number>();

  const [idChangingStatus, setIdChangingStatus] = useState<number>(0);

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
      showToast("Đã xóa bình luận");
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
    const bodyShort = item.body?.substring(0, 500) ?? "";
    return (
      <IndexTable.Row id={item.id.toString()} key={item.id.toString()} position={index} selected={isSelected}>
        <IndexTable.Cell>
          <StyledCell style={{ whiteSpace: "nowrap" }}>
            {item.created_on ? formatDate(new Date(item.created_on), "dd/MM/yyyy HH:mm") : "—"}
          </StyledCell>
        </IndexTable.Cell>
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
              <StyledContent>
                {item.body && item.body.length > 500 && !idsHasShowBody.some((id) => id === item.id) ? (
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
          <StyledCell style={{ whiteSpace: "nowrap" }}>
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
          </StyledCell>
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
                      (isLoadingApproveComment || isLoadingMarkAsNotSpamComment || isLoadingMarkAsSpamComment)
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
      await bulkUpdateStatus({ ids: selectedResources.map(Number), operation }).unwrap();
      switch (operation) {
        case "spam":
          showToast("Đã đánh dấu bình luận là spam");
          break;
        case "approve":
          showToast("Đã duyệt bình luận");
          break;
        default:
          showToast("Đã bỏ đánh dấu bình luận là spam");
          break;
      }
      clearSelection();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const isLoading = isLoadingComments || isLoadingCommentCount || isLoadingTotalCount;

  if (isLoading) {
    return (
      <Card sectioned>
        <SkeletonBodyText />
      </Card>
    );
  }

  const isEmptyData = totalCount === 0;

  let bodyMarkup: JSX.Element;
  if (isEmptyData) {
    bodyMarkup = (
      <Card.Section>
        <Text as="p">Không có bình luận nào</Text>
      </Card.Section>
    );
  } else {
    bodyMarkup = (
      <Card.Section flush>
        <StyledFilter>
          <CommentFilters
            isDetailPage
            removeSelected={clearSelection}
            changeFilterDetail={(data) => {
              setFilter(data);
              setPage(1);
            }}
          />
        </StyledFilter>
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
            emptyState={<EmptySearchResult />}
          >
            {rowMarkup}
          </IndexTable>
        </StyledTable>
      </Card.Section>
    );
  }

  return (
    <Card title="Bình luận">
      <Card.Section>
        <Text as="p">
          {blog.commentable === Commentable.NO
            ? "Chức năng bình luận cho bài viết này đã bị vô hiệu hóa. "
            : blog.commentable === Commentable.MODERATE
            ? "Chức năng bình luận cho bài viết này cần được duyệt trước khi đăng."
            : "Chức năng bình luận cho bài viết này sẽ được tự động đăng."}
        </Text>
        <Text as="p">
          Để thay đổi cách thức bình luận được xử lý, sửa danh mục bài viết{" "}
          <Link removeUnderline url={`/admin/blogs/${blog.id}`}>
            {blog.name}
          </Link>
        </Text>
      </Card.Section>
      {bodyMarkup}
      {count > 0 && (
        <Card.Section>
          <Pagination
            totalCount={count}
            currentPage={page || 1}
            perPage={10}
            onNavigate={(page) => setPage(page)}
            hidePageSize
            disabledScrollTo
          />
        </Card.Section>
      )}
      {isOpenBulkDeleteModal ? (
        <BulkDeleteModal
          onClose={closeBulkDeleteModal}
          selectedResult={selectedResources}
          clearSelection={clearSelection}
          type="comment"
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
            loading: isLoadingDeleteComment,
            onAction: handleDeleteComment,
          }}
        />
      ) : null}
    </Card>
  );
};

const StyledFilter = styled.div`
  padding: ${(p) => p.theme.spacing(4, 5)};
`;

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
  min-width: 280px;
  p {
    cursor: default;
  }
`;

const StyledContent = styled.div`
  padding: ${(p) => p.theme.spacing(1, 2)};
  border-radius: ${(p) => p.theme.shape.borderRadius(1)};
  background: ${(p) => p.theme.colors.surfaceNeutral};
  width: 100%;
  word-break: break-word;
`;

const StyledActions = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(3)};
`;

const StyledSpinner = styled.div`
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.5;
`;
