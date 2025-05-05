import { useMemo } from "react";
import styled from "@emotion/styled";
import { FormLayout, Modal, Select2, Stack, TextField } from "@/ui-components";
import { cloneDeep, forEach, isEmpty } from "lodash-es";

import { isClientError } from "app/client";
import { LinklistChange, LinkType } from "app/features/website/types";
import { validateAlias } from "app/features/website/utils/linklist";
import { Control, notEmpty, submitErrors, submitSuccess, useCustomForm, useCustomFormContext } from "app/utils/form";
import { showErrorToast } from "app/utils/toast";

import { useValidateLinklistMutation } from "../api";
import { FlattenedItem, TreeItem } from "../type";
import { TypeMenuOptions } from "../utils/contants";

import { MenuReferenceSelect } from "./MenuReferenceSelect";

export type CreateOrEditLink = {
  previousSiblingId?: number;
  parentId?: number;
  flattenedItem?: FlattenedItem;
  createId?: number;
};

interface Props {
  data?: CreateOrEditLink;
  onClose: () => void;
  onSubmitModal: (treeItem: TreeItem) => void;
}

export const CreateOrEditLinkModal = ({ data, onClose, onSubmitModal }: Props) => {
  const { fieldValues: fieldValuesParent } = useCustomFormContext<LinklistChange>();
  const isCreate = !data?.flattenedItem;

  const [validate] = useValidateLinklistMutation();
  const {
    control,
    isDirty,
    isSubmitting,
    submit,
    setValue,
    fieldValues,
    errors,
    fieldDirties,
    trigger,
    setError,
    clearErrors,
  } = useCustomForm<TreeItem>({
    values: useMemo(() => {
      return {
        id: data?.flattenedItem?.id || 0,
        type: data?.flattenedItem?.type || LinkType.HOME,
        title: data?.flattenedItem?.title || "",
        subject: data?.flattenedItem?.subject || "",
        subject_id: data?.flattenedItem?.subject_id || null,
        subject_param: data?.flattenedItem?.subject_param || "",
        alias: data?.flattenedItem?.alias || "",
        children: [],
      };
    }, [data]),
    onSubmit: async (dataForm) => {
      try {
        const linksChangeTemp = cloneDeep(fieldValuesParent.changes);
        if (isCreate) {
          linksChangeTemp.push({
            id: data?.createId,
            type: dataForm.type,
            title: dataForm.title,
            action: "create",
            alias: dataForm.alias,
            subject_id: dataForm.subject_id,
            subject_param: dataForm.subject_param,
            subject: dataForm.subject,
            parent_id: data?.parentId,
            previous_sibling_id: data?.previousSiblingId,
          });
        } else {
          const index = linksChangeTemp.findIndex((linkChange) => linkChange.id === dataForm.id);
          if (index > -1) {
            linksChangeTemp[index].type = dataForm.type;
            linksChangeTemp[index].title = dataForm.title;
            linksChangeTemp[index].alias = dataForm.alias;
            linksChangeTemp[index].subject_id = dataForm.subject_id;
            linksChangeTemp[index].subject_param = dataForm.subject_param;
            linksChangeTemp[index].subject = dataForm.subject;
            linksChangeTemp[index].action = !linksChangeTemp[index].action ? "update" : linksChangeTemp[index].action;
          } else {
            linksChangeTemp.push({
              id: dataForm.id,
              type: dataForm.type,
              title: dataForm.title,
              action: "update",
              alias: dataForm.alias,
              subject_id: dataForm.subject_id,
              subject_param: dataForm.subject_param,
              subject: dataForm.subject,
              parent_id: data?.parentId,
              previous_sibling_id: data?.previousSiblingId,
            });
          }
        }
        await validate({
          id: fieldValuesParent.id ?? null,
          title: "Validate",
          changes: linksChangeTemp,
        }).unwrap();
        onSubmitModal(dataForm);
        return submitSuccess();
      } catch (error) {
        if (isClientError(error)) {
          const msgError = error.data.message.replace("message: ", "");
          if (msgError.includes("alias")) {
            setError("alias", {
              message: msgError.charAt(0).toUpperCase() + msgError.slice(1),
            });
          }
          showErrorToast(error.data.message);
        }
        return submitErrors([{ message: "Có lỗi xảy ra" }]);
      }
    },
  });

  const handleValidateBeforeSubmit = async () => {
    const isValid = await trigger();
    if (!isValid) {
      const objectMessageError = findMessageError(errors);
      if (!isEmpty(objectMessageError) && (objectMessageError as any)?.type !== "ignore") {
        showErrorToast((objectMessageError as any).message);
      }
      return;
    }
    submit();
  };

  const findMessageError = (values: any) => {
    let objectMessageError = {};
    if (!values) {
      return "";
    }
    if ("message" in values) {
      objectMessageError = values;
    } else if (typeof values === "object" && !isEmpty(values)) {
      forEach(values, (value) => {
        if (isEmpty(objectMessageError)) {
          objectMessageError = findMessageError(value);
        } else {
          return false;
        }
      });
    }
    return objectMessageError;
  };

  const showAlias =
    data?.flattenedItem?.children && data?.flattenedItem?.children.filter((item) => !item.isButtonAdd).length > 0;

  return (
    <Modal
      open
      title={isCreate ? "Thêm liên kết" : "Sửa liên kết"}
      onClose={onClose}
      size="small"
      primaryAction={{
        disabled: !isDirty || isEmpty(fieldDirties),
        content: "Hoàn thành",
        onAction: handleValidateBeforeSubmit,
        loading: isSubmitting,
      }}
      secondaryActions={[{ content: "Hủy", onAction: onClose, disabled: isSubmitting }]}
      sectioned
    >
      <FormLayout>
        <Control.Text
          control={control}
          name="title"
          validates={[notEmpty("Nhập vào tên liên kết")]}
          render={(field) => (
            <TextField
              {...field}
              label="Tên"
              placeholder="Nhập tên liên kết"
              requiredIndicator
              onChange={field.onChange}
            />
          )}
        />
        <FormLayout.Group>
          <Control.Text
            control={control}
            name="type"
            render={(field) => (
              <Select2
                {...field}
                label="Liên kết"
                options={TypeMenuOptions}
                onChange={(selected) => {
                  field.onChange(selected);
                  if (selected === LinkType.HOME) {
                    setValue("subject", "/");
                  } else if (selected === LinkType.ALL_PRODUCT) {
                    setValue("subject", "/collections/all");
                  } else if (selected === LinkType.SEARCH) {
                    setValue("subject", "/search");
                  } else if (selected !== LinkType.HTTP) {
                    setValue("subject", "");
                  }
                  setValue("subject_id", null, { shouldDirty: true });
                  clearErrors("subject_id");
                }}
              />
            )}
          />
          {[LinkType.PRODUCT, LinkType.COLLECTION, LinkType.BLOG, LinkType.PAGE].includes(
            fieldValues.type as LinkType
          ) ? (
            <StyledWrapperSubject>
              <Control.Text
                control={control}
                name="subject_id"
                validates={[
                  notEmpty(
                    fieldValues.type === LinkType.PRODUCT
                      ? "Vui lòng chọn sản phẩm"
                      : fieldValues.type === LinkType.COLLECTION
                      ? "Vui lòng chọn danh mục"
                      : fieldValues.type === LinkType.BLOG
                      ? "Vui lòng chọn danh mục bài viết"
                      : "Vui lòng chọn trang nội dung"
                  ),
                ]}
                render={(field) => (
                  <MenuReferenceSelect
                    type={fieldValues.type as LinkType}
                    onChange={field.onChange}
                    value={field.value}
                    error={field.error}
                  />
                )}
              />
            </StyledWrapperSubject>
          ) : fieldValues.type === LinkType.HTTP ? (
            <StyledWrapperSubject>
              <Control.Text
                control={control}
                name="subject"
                validates={[notEmpty("Vui lòng nhập liên kết")]}
                render={(field) => <TextField {...field} placeholder="https://" requiredIndicator />}
              />
            </StyledWrapperSubject>
          ) : (
            <div />
          )}
        </FormLayout.Group>
        {showAlias ? (
          <Control.Text
            control={control}
            validates={[validateAlias()]}
            name="alias"
            render={(field) => (
              <TextField {...field} label="Alias (tùy chọn)" placeholder="Tên alias ví dụ: shared-menu-com" />
            )}
          />
        ) : null}
      </FormLayout>
    </Modal>
  );
};

const StyledWrapperSubject = styled.div`
  padding-top: ${(p) => p.theme.spacing(6)};
`;
