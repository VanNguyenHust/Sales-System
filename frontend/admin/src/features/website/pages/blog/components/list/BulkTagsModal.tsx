import { handleErrorApi } from "app/utils/error";
import { showToast } from "app/utils/toast";

import { useBulkUpdateArticleMutation } from "../../api";
import { SelectTagsModal } from "../SelectTagsModal";

export type BulkTagsModalProps = {
  onClose: () => void;
  selectedResources: string[];
  countArticle: number;
  isDelete?: boolean;
};

export const BulkTagsModal = (props: BulkTagsModalProps) => {
  const { onClose, selectedResources, countArticle = 0, isDelete } = props;

  const [bulkUpdateArticle, { isLoading }] = useBulkUpdateArticleMutation();

  const handleBulkTags = async (tags: string[]) => {
    try {
      await bulkUpdateArticle({
        operation: isDelete ? "remove_tag" : "add_tag",
        ids: selectedResources.map(Number),
        tags,
      }).unwrap();
      showToast(`${isDelete ? "Xóa tag" : "Thêm tag"} ${countArticle} bài viết thành công`);
      onClose();
    } catch (e) {
      handleErrorApi(e);
    }
  };

  return (
    <SelectTagsModal
      onClose={onClose}
      title={isDelete ? `Xóa tag cho ${countArticle} bài viết` : `Thêm tag cho ${countArticle} bài viết`}
      applyTags={handleBulkTags}
      loadingSubmit={isLoading}
      hideCreate={isDelete}
      tagsSelected={[]}
    />
  );
};
