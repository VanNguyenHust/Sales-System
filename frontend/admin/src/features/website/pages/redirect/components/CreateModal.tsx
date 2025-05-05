import styled from "@emotion/styled";
import { FormLayout, Modal, TextField } from "@/ui-components";

import { RedirectRequest } from "app/features/website/types";
import { transformClientErrors } from "app/utils/error";
import { Control, FormError, notEmptyString, submitErrors, submitSuccess, useCustomForm } from "app/utils/form";
import { showErrorToast, useToast } from "app/utils/toast";
import { useTenant } from "app/utils/useTenant";

import { useCreateRedirectMutation } from "../api";
import { validateRedirectUrl } from "../utils/redirect";

interface Props {
  onClose: () => void;
}

export function CreateModal({ onClose }: Props) {
  const { getOnlineStoreUrl } = useTenant();
  const onlineStoreUrl = getOnlineStoreUrl("");
  const { showToast } = useToast();

  const [createRedirect] = useCreateRedirectMutation();

  const { control, isDirty, isSubmitting, submit } = useCustomForm<RedirectRequest>({
    defaultValues: {
      path: "",
      target: "",
    },
    makeCleanAfterSubmit: true,
    onSubmit: async (data) => {
      try {
        await createRedirect(data).unwrap();
        showToast("Tạo mới chuyển hướng thành công");
        onClose();
        return submitSuccess();
      } catch (e) {
        const errors = transformClientErrors<FormError<RedirectRequest>>(e, [
          {
            type: "map",
            key: "path",
            message: /^has already been taken$/,
            result: () => ({ message: "Đường dẫn cũ đã tồn tại", field: "path" }),
          },
          {
            type: "map",
            key: "target",
            message: /^can't be the same as path$/,
            result: () => ({ message: "Chuyển hướng đến không được trùng đường dẫn cũ", field: "target" }),
          },
          {
            type: "*",
            result: (error) => ({ message: error.data.message }),
          },
        ]);
        showErrorToast(errors[0].message);

        return submitErrors(errors);
      }
    },
  });

  return (
    <Modal
      title="Thêm chuyển hướng"
      open
      onClose={onClose}
      primaryAction={{ disabled: !isDirty, content: "Lưu", onAction: submit, loading: isSubmitting }}
      secondaryActions={[{ content: "Hủy", onAction: onClose, disabled: isSubmitting }]}
      sectioned
    >
      <FormLayout>
        <Control.Text
          name="path"
          control={control}
          validates={[
            notEmptyString("Đường dẫn cũ không được để trống"),
            validateRedirectUrl("Đường dẫn cũ phải bắt đầu bằng / và chỉ bao gồm chữ cái, chữ số, ký tự /,- và . "),
          ]}
          render={(field) => (
            <TextField
              {...field}
              label="Đường dẫn cũ"
              placeholder="Nhập đường dẫn cũ"
              maxLength={500}
              helpText={`Ví dụ: nếu đường dẫn cũ là ${onlineStoreUrl}/shirts, nhập /shirts`}
              prefix={<StyledPrefix>{onlineStoreUrl}</StyledPrefix>}
            />
          )}
        />
        <Control.Text
          name="target"
          control={control}
          validates={[
            notEmptyString("Chuyển hướng đến không được để trống"),
            validateRedirectUrl(
              "Đường dẫn chuyển hướng phải bắt đầu bằng /, https:// hoặc http:// và chỉ bao gồm chữ cái, chữ số, ký tự /,- và . "
            ),
          ]}
          render={(field) => (
            <TextField
              {...field}
              label="Chuyển hướng đến"
              placeholder="Nhập URL bạn muốn chuyển tới"
              maxLength={500}
              helpText="Ví dụ: /collections/shirts hoặc http://www.example.com"
            />
          )}
        />
      </FormLayout>
    </Modal>
  );
}

const StyledPrefix = styled.div`
  background: ${(p) => p.theme.colors.surfaceNeutral};
  margin-left: ${(p) => `calc(-${p.theme.spacing(3)} + ${p.theme.spacing(0.25)})`};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")} 0 0 ${(p) => p.theme.shape.borderRadius("base")};
  height: ${(p) => `calc(${p.theme.spacing(8)} + ${p.theme.spacing(0.5)})`};
  line-height: ${(p) => `calc(${p.theme.spacing(8)} + ${p.theme.spacing(0.5)})`};
  padding: ${(p) => p.theme.spacing(0, 3)};
  border-right: ${(p) => p.theme.shape.borderBase};
`;
