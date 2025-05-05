import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import {
  Card,
  ContextualSaveBar,
  FormLayout,
  Layout,
  Link,
  Loading,
  Page,
  PageActions,
  Text,
  TextField,
} from "@/ui-components";
import { forEach, isEmpty } from "lodash-es";

import { isClientError } from "app/client";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { useLeavePage } from "app/components/leave-page";
import { handleErrorApi } from "app/utils/error";
import {
  Control,
  CustomFormProvider,
  notEmptyString,
  submitErrors,
  submitSuccess,
  useCustomForm,
} from "app/utils/form";
import { DISCARD_CONFIRMED } from "app/utils/navigation/state";
import { showErrorToast, showToast } from "app/utils/toast";
import { toNormalText } from "app/utils/toNormalText";
import { useBackLink } from "app/utils/useBackLink";

import { LinklistChange } from "../../types";

import { MenuManagerSkeleton } from "./components/MenuManagerSkeleton";
import { MenuTableList } from "./components/MenuTableList";
import { buildLinksChange, initDataTree } from "./utils/tree";
import { useDeleteLinklistMutation, useGetLinklistQuery, useUpdateLinklistMutation } from "./api";
import { TreeItems } from "./type";

export default function MenuManagerPage() {
  const { backLink = "/admin/links" } = useBackLink();
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  const [dataIsReady, setDataIsReady] = useState<boolean>(false);
  const [isFormChanged, setIsFormChanged] = useState<boolean>(false);
  const [treeItems, setTreeItems] = useState<TreeItems>([]);
  const isCreate = !id;
  const isEdit = !!id;

  const {
    data: linklist,
    isLoading: isLoadingLinklist,
    isFetching: isFetchingLinklist,
  } = useGetLinklistQuery(Number(id), {
    refetchOnMountOrArgChange: true,
    skip: !isEdit,
  });

  useEffect(() => {
    if (isEdit && !linklist && !isLoadingLinklist) {
      showToast("Menu không tồn tại hoặc đã bị xóa", { error: true });
      navigate("/admin/links");
    }
  }, [navigate, isEdit, linklist, isLoadingLinklist]);

  const [updateLinklist] = useUpdateLinklistMutation();

  const hookForm = useCustomForm<LinklistChange>({
    values: useMemo((): LinklistChange => {
      return linklist
        ? {
            id: linklist.id,
            alias: linklist.alias,
            title: linklist.title,
            changes: [],
          }
        : {
            alias: "",
            title: "",
            changes: [],
          };
    }, [linklist]),
    onSubmit: async (data) => {
      try {
        const response = await updateLinklist(data).unwrap();
        if (isEdit) {
          showToast("Cập nhật menu thành công");
        } else {
          navigate(`/admin/links/${response.id}`, {
            state: DISCARD_CONFIRMED,
          });
          showToast("Tạo mới menu thành công");
        }
        return submitSuccess();
      } catch (e) {
        handleErrorApi(e, isEdit ? "Cập nhật menu thất bại" : "Tạo mới menu thất bại");
        return submitErrors([]);
      }
    },
  });

  const { control, reset, isDirty, isSubmitting, submit, setValue, fieldValues, errors, fieldDirties, trigger } =
    hookForm;
  useEffect(() => {
    const linksChange = buildLinksChange(treeItems, linklist ? linklist.links ?? [] : []);
    if (!isFormChanged && linksChange.length > 0) {
      setIsFormChanged(true);
    }
    setValue("changes", linksChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linklist, setValue, treeItems]);

  useEffect(() => {
    if (isCreate || isFetchingLinklist) return;
    setIsFormChanged(false);
    if (linklist) {
      setTreeItems((prev) => initDataTree(linklist.links, undefined, prev));
      setDataIsReady(true);
    } else {
      navigate(backLink);
      showErrorToast("Không tìm thấy menu");
    }
  }, [backLink, isCreate, isFetchingLinklist, linklist, navigate]);

  const isReservedMenu = ["main-menu", "footer"].includes(linklist?.alias ?? "");

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

  const [openModalConfirmDelete, setOpenModalConfirmDelete] = useState<boolean>(false);

  const [deleteLinkList, { isLoading: isDeleting }] = useDeleteLinklistMutation();

  const handleDeleteMenu = async () => {
    try {
      await deleteLinkList(Number(id)).unwrap();
      navigate("/admin/links");
      showToast("Xóa menu thành công");
    } catch (e) {
      if (isClientError(e)) {
        showErrorToast(e.data.message);
        return submitErrors([{ message: e.data.message }]);
      }
    }
  };

  const disabledBtnSave = (!isDirty || isEmpty(fieldDirties)) && !isFormChanged;
  const contextualSaveBarMarkup =
    (isDirty && !isEmpty(fieldDirties)) || isFormChanged || isCreate ? (
      <ContextualSaveBar
        message={isCreate ? "" : "Chỉnh sửa chưa được lưu"}
        saveAction={{
          content: "Lưu",
          disabled: disabledBtnSave,
          onAction: handleValidateBeforeSubmit,
          loading: isSubmitting,
        }}
        discardAction={{
          content: "Hủy",
          discardConfirmationModal: isEdit,
          disabled: isSubmitting,
          onAction: () => {
            if (isCreate) {
              navigate("/admin/links");
            } else {
              setTreeItems((prev) => initDataTree(linklist && linklist.links ? linklist.links : [], undefined, prev));
              setIsFormChanged(false);
              reset();
            }
          },
        }}
      />
    ) : null;

  const pageActionMarkup = (
    <Layout.Section>
      <PageActions
        primaryAction={{
          content: "Lưu",
          disabled: disabledBtnSave,
          onAction: handleValidateBeforeSubmit,
          loading: isSubmitting,
        }}
        secondaryActions={
          isEdit &&
          !isReservedMenu && [
            {
              content: "Xóa",
              disabled: isSubmitting,
              destructive: true,
              onAction() {
                setOpenModalConfirmDelete(true);
              },
            },
          ]
        }
      />
    </Layout.Section>
  );

  useLeavePage(!openModalConfirmDelete && ((!isEmpty(fieldDirties) && isDirty) || isFormChanged));

  if (isEdit && !dataIsReady) {
    return <MenuManagerSkeleton />;
  }

  const title = linklist ? linklist.title : "Thêm menu";

  return (
    <CustomFormProvider {...hookForm}>
      <Page
        title={title}
        backAction={{
          url: "/admin/links",
        }}
      >
        <DocumentTitle title={title} />
        {(isFetchingLinklist || isSubmitting) && <Loading />}
        {contextualSaveBarMarkup}
        <Layout>
          <Layout.Section>
            <Card title="Thông tin" sectioned>
              <FormLayout>
                <FormLayout.Group>
                  <Control.Text
                    control={control}
                    name="title"
                    validates={[notEmptyString("Tên menu không được để trống")]}
                    render={(field) => (
                      <TextField {...field} label="Tên menu" placeholder="Nhập tên menu" requiredIndicator />
                    )}
                  />
                  <Control.Text
                    name="alias"
                    control={control}
                    render={(field) => (
                      <>
                        <TextField
                          {...field}
                          placeholder={
                            !field.value && fieldValues.title ? toNormalText(fieldValues.title || "", "-") : undefined
                          }
                          label="Alias"
                          disabled={isEdit && isReservedMenu}
                        />
                        <StyledTextHelp>
                          <Text as="p" color="subdued" variant="bodySm">
                            Alias này dùng để truy cập các thuộc tính của Menu trong Theme.{" "}
                            <Link url="https://support.sapo.vn/dinh-danh-alias" external removeUnderline>
                              Tìm hiểu thêm
                            </Link>
                          </Text>
                        </StyledTextHelp>
                      </>
                    )}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Card>
            <MenuTableList treeItems={treeItems} onUpdate={setTreeItems} />
          </Layout.Section>
          {pageActionMarkup}
        </Layout>
        {openModalConfirmDelete ? (
          <ConfirmModal
            open
            onDismiss={() => setOpenModalConfirmDelete(false)}
            confirmAction={{
              content: "Xóa menu",
              destructive: true,
              loading: isDeleting,
              onAction: handleDeleteMenu,
            }}
            title="Xóa menu"
            body={
              <>
                Bạn có chắc chắn muốn xóa menu <strong>{linklist?.title}</strong>?. Thao tác này không thể khôi phục.
              </>
            }
          />
        ) : null}
      </Page>
    </CustomFormProvider>
  );
}

const StyledTextHelp = styled.div`
  margin-left: ${(p) => p.theme.spacing(3)};
  margin-top: ${(p) => p.theme.spacing(1)};
`;
