import { FormLayout, Modal, Select2, TextField } from "@/ui-components";

import { useSendTicketMutation } from "app/api";
import { isClientError } from "app/client";
import { Ticket } from "app/types";
import { getBase64 } from "app/utils/file";
import { Control, lengthLessThan, notEmpty, submitErrors, submitSuccess, useCustomForm } from "app/utils/form";
import { showErrorToast, showToast } from "app/utils/toast";

import { FileDropZone } from "./FileDropZone";

type Props = {
  open: boolean;
  onClose(): void;
};

type FormInput = Ticket & {
  files: File[];
};

export const FeedbackModal = ({ open, onClose }: Props) => {
  const [sendFeedback, { isLoading }] = useSendTicketMutation();

  const { control, submit, isDirty } = useCustomForm<FormInput>({
    defaultValues: {
      description: "",
      title: "",
      topic: "",
      files: [],
    },
    makeCleanAfterSubmit: true,
    onSubmit: async ({ files, ...rest }) => {
      try {
        const attachments: Ticket["attachments"] = await Promise.all(
          files.map(async (file) => ({
            base64: await getBase64(file),
            filename: file.name,
          }))
        );
        await sendFeedback({
          ticket: {
            ...rest,
            attachments,
          },
        }).unwrap();
        showToast("Gửi góp ý thành công");
        onClose();
        return submitSuccess();
      } catch (e) {
        if (isClientError(e)) {
          showErrorToast(`Gửi góp ý thất bại: ${e.data.message}`);
          return submitErrors([{ message: e.data.message }]);
        }
        throw e;
      }
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Gửi góp ý"
      sectioned
      divider
      primaryAction={{
        content: "Gửi yêu cầu",
        loading: isLoading,
        disabled: !isDirty,
        onAction: submit,
      }}
      secondaryActions={[
        {
          content: "Hủy",
          disabled: isLoading,
          onAction: onClose,
        },
      ]}
    >
      <FormLayout>
        <FormLayout.Group>
          <Control.Text
            name="topic"
            control={control}
            validates={[notEmpty("Chưa chọn mục góp ý")]}
            render={(field) => (
              <Select2
                label="Mục góp ý"
                placeholder="Lựa chọn mục góp ý"
                options={[
                  {
                    value: "Chỉnh sửa giao diện website",
                    label: "Chỉnh sửa giao diện website",
                  },
                  {
                    value: "HDSD tính năng, ứng dụng",
                    label: "HDSD tính năng, ứng dụng",
                  },
                  {
                    value: "Góp ý phản ánh dịch vụ",
                    label: "Góp ý phản ánh dịch vụ",
                  },
                  {
                    value: "Tư vấn thiết kế website",
                    label: "Tư vấn thiết kế website",
                  },
                  {
                    value: "Hỗ trợ các vấn đề khác",
                    label: "Hỗ trợ các vấn đề khác",
                  },
                ]}
                requiredIndicator
                {...field}
              />
            )}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Control.Text
            name="title"
            control={control}
            validates={[notEmpty("Tiêu đề không được để trống"), lengthLessThan(255, `Tiêu đề tối đa 255 ký tự`)]}
            render={(field) => (
              <TextField label="Tiêu đề" placeholder="Nhập tiêu đề" maxLength={255} requiredIndicator {...field} />
            )}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Control.Text
            name="description"
            control={control}
            validates={[notEmpty("Nội dung không được để trống"), lengthLessThan(1000, `Nội dung tối đa 1000 ký tự`)]}
            render={(field) => (
              <TextField
                label="Nội dung"
                maxLength={1000}
                showCharacterCount
                multiline={5}
                maxHeight={500}
                requiredIndicator
                {...field}
              />
            )}
          />
        </FormLayout.Group>
        <FormLayout.Group>
          <Control.Field control={control} name="files" render={(field) => <FileDropZone {...field} />} />
        </FormLayout.Group>
      </FormLayout>
    </Modal>
  );
};
