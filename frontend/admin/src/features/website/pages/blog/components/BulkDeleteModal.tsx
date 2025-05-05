import { useMemo } from "react";

import { ConfirmModal } from "app/components/ConfirmModal";
import { handleErrorApi } from "app/utils/error";
import { useToast } from "app/utils/toast";

import { useBulkDeleteArticleMutation, useBulkDeleteBlogMutation, useBulkDeleteCommentMutation } from "../api";

interface Props {
  type?: "blog" | "article" | "comment";
  onClose: () => void;
  selectedResult: string[];
  clearSelection: () => void;
}

export function BulkDeleteModal({ type = "blog", onClose, selectedResult, clearSelection }: Props) {
  const { showToast } = useToast();
  const [bulkDeleteBlog, { isLoading: isDeletingBlog }] = useBulkDeleteBlogMutation();
  const [bulkDeleteArticle, { isLoading: isDeletingArticle }] = useBulkDeleteArticleMutation();
  const [bulkDeleteComment, { isLoading: isDeletingComment }] = useBulkDeleteCommentMutation();
  const handleDelete = async () => {
    try {
      switch (type) {
        case "blog":
          await bulkDeleteBlog(selectedResult.map(Number)).unwrap();
          break;
        case "article":
          await bulkDeleteArticle(selectedResult.map(Number)).unwrap();
          break;
        case "comment":
          await bulkDeleteComment(selectedResult.map(Number)).unwrap();
          break;
      }
      showToast(
        `Tiến trình xóa ${selectedResult.length} ${
          type === "blog" ? "danh mục bài viết" : type === "article" ? "bài viết" : "bình luận"
        } đang được thực hiện`
      );
      clearSelection();
      onClose();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  const { title, body } = useMemo(() => {
    switch (type) {
      case "blog":
        return {
          title: "Xóa danh mục bài viết",
          body: (
            <>
              Bạn có chắc muốn xóa <strong>{selectedResult.length}</strong> danh mục bài viết đã chọn?. Thao tác này
              không thể khôi phục.
            </>
          ),
        };
      case "article":
        return {
          title: "Xóa bài viết",
          body: (
            <>
              Bạn có chắc muốn xóa <strong>{selectedResult.length}</strong> bài viết đã chọn?. Thao tác này không thể
              khôi phục.
            </>
          ),
        };
      case "comment":
        return {
          title: "Xóa bình luận",
          body: (
            <>
              Bạn có chắc muốn xóa <strong>{selectedResult.length}</strong> bình luận đã chọn?. Thao tác này không thể
              khôi phục.
            </>
          ),
        };
      default:
        return { title: "", body: "" };
    }
  }, [selectedResult.length, type]);

  return (
    <ConfirmModal
      open
      onDismiss={onClose}
      confirmAction={{
        content: title,
        loading: isDeletingBlog || isDeletingArticle || isDeletingComment,
        destructive: true,
        onAction: handleDelete,
      }}
      title={title}
      body={body}
    />
  );
}
