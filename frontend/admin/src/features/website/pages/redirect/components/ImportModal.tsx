import { useState } from "react";
import styled from "@emotion/styled";
import { Button, Checkbox, Modal, Stack } from "@/ui-components";
import { DownloadIcon } from "@/ui-icons";

import RedirectImportTemplate from "app/assets/files/redirects_import_template.xlsx?url";
import { ImportFileDropzone } from "app/components/ImportFileDropzone";
import { showErrorToast } from "app/utils/toast";
import { toBase64 } from "app/utils/toBase64";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useTenant } from "app/utils/useTenant";

import { useImportRedirectMutation } from "../api";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export function ImportModal({ onClose, onSuccess }: Props) {
  const { tenant } = useTenant();
  const user = useCurrentUser();
  const email = user.email ?? tenant.email;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const [overrideIfExist, setOverrideIfExist] = useState<boolean>(false);

  const [importRedirect] = useImportRedirectMutation();

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    try {
      await importRedirect({
        file_data: await toBase64(file),
        size: file.size,
        file_name: file.name,
        override_if_exist: overrideIfExist,
        receiver_email: email,
        user_id: user.id,
      }).unwrap();
      onSuccess();
    } catch {
      showErrorToast("File nhập chưa đúng mẫu, vui lòng tải lại mẫu file mới nhất và nhập lại");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm chuyển hướng"
      open
      onClose={onClose}
      primaryAction={{ disabled: !file, content: "Nhập file", onAction: handleSubmit, loading: isSubmitting }}
      secondaryActions={[{ content: "Hủy", onAction: onClose, disabled: isSubmitting }]}
      sectioned
    >
      <Stack vertical spacing="tight">
        <ImportFileDropzone maxFileSizeInMB={1} fileType="xls/xlsx" value={file} onChange={(file) => setFile(file)} />
        <Checkbox
          label="Ghi đè thông tin các chuyển hướng 301 đã có"
          helpText=" Việc ghi đè sẽ xóa hết các thông tin cũ của chuyển hướng 301 bị ghi đè để lưu thông tin mới"
          checked={overrideIfExist}
          onChange={() => setOverrideIfExist(!overrideIfExist)}
        />
        <StyledSampleData>
          <Button icon={DownloadIcon} url={RedirectImportTemplate} external plain>
            Tải file dữ liệu mẫu
          </Button>
        </StyledSampleData>
      </Stack>
    </Modal>
  );
}

const StyledSampleData = styled.div`
  display: flex;
  align-items: center;
`;
