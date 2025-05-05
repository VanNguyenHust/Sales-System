import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import {
  type ActionListItemDescriptor,
  Banner,
  Card,
  ContextualSaveBar,
  FormLayout,
  Layout,
  Loading,
  Page as PageComponent,
  PageActions,
} from "@/ui-components";
import { ShowIcon } from "@/ui-icons";
import { forEach, isEmpty } from "lodash-es";

import { isClientError } from "app/client";
import { AISuggestTextField } from "app/components/AISuggestTextField";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { useLeavePage } from "app/components/leave-page";
import { RichTextEditor } from "app/components/RichTextEditor";
import { useGetAppLinksQuery } from "app/features/app/api";
import { usePermission } from "app/features/auth/usePermission";
import { handleErrorApi } from "app/utils/error";
import {
  Control,
  lengthLessThanOrEqual,
  notEmptyString,
  submitErrors,
  submitSuccess,
  useCustomForm,
} from "app/utils/form";
import { DISCARD_CONFIRMED } from "app/utils/navigation/state";
import { showErrorToast, showToast } from "app/utils/toast";
import { useBackLink } from "app/utils/useBackLink";
import { useTenant } from "app/utils/useTenant";

import { CombinePageRequest, Page } from "../../types";
import { getAllSubjectLinkParentInfo, updateSubjectLink } from "../../utils/linklist";
import { useGetLinklistsQuery, useUpdateLinklistMutation } from "../menu/api";
import { PinMenuCard } from "../menu/components/PinMenuCard";
import { useDeleteAndInsertRedirectMutation } from "../redirect/api";

import { PageManagerSkeleton } from "./components/PageManagerSkeleton";
import { SchedulePublishCard } from "./components/SchedulePublishCard";
import { SeoCard } from "./components/SeoCard";
import { TemplateLayoutCard } from "./components/TemplateLayoutCard";
import { toAlias } from "./utils/text";
import { useCreatePageMutation, useDeletePageMutation, useGetPageQuery, useUpdatePageMutation } from "./api";

export default function PageManagerPage() {
  const { backLink = "/admin/pages" } = useBackLink();
  const { getOnlineStoreUrl } = useTenant();
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();

  const [urlParams, _] = useSearchParams();
  const showInCreate = urlParams.get("c");
  const isCreate = !id;
  const isEdit = !!id;

  const [dataIsReady, setDataIsReady] = useState<boolean>(false);

  const {
    data: page,
    isLoading: isLoadingPage,
    isFetching: isFetchingPage,
  } = useGetPageQuery(Number(id), {
    refetchOnMountOrArgChange: true,
    skip: !isEdit,
  });

  const { data: appLinks, isFetching: isFetchingAppLinks } = useGetAppLinksQuery(
    { type: "pages", location: "show", resource_id: Number(id) },
    {
      skip: !isEdit,
    }
  );

  useEffect(() => {
    if (showInCreate && id) {
      history.replaceState(null, "", `/admin/pages/${id}`);
    }
  }, [showInCreate, id]);

  useEffect(() => {
    if (isEdit && !page && !isLoadingPage) {
      showToast("Trang nội dung không tồn tại hoặc đã bị xóa", { error: true });
      navigate("/admin/pages");
    }
  }, [navigate, isEdit, page, isLoadingPage]);

  const { hasSomePermissions } = usePermission();
  const hasThemePerm = hasSomePermissions(["themes"]);
  const hasLinkPerm = hasSomePermissions(["links"]);

  const { data: linklists, isFetching: isFetchingLinklists } = useGetLinklistsQuery(undefined, { skip: !hasLinkPerm });
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [updateLinkList] = useUpdateLinklistMutation();
  const [deleteAndUpdateRedirect] = useDeleteAndInsertRedirectMutation();

  const handleUpdateLinkList = async (response: Page) => {
    if (getFieldState("linkListSubParent").isDirty) {
      await updateSubjectLink(
        {
          subjectId: response.id,
          type: "page",
          title: response.title,
          subjectParents: fieldValues.linkListSubParent,
          linklists: linklists ?? [],
        },
        updateLinkList
      );
    }
  };

  const {
    control,
    reset,
    isDirty,
    isSubmitting,
    submit,
    setValue,
    fieldValues,
    errors,
    fieldDirties,
    getFieldState,
    trigger,
  } = useCustomForm<CombinePageRequest>({
    values: useMemo((): CombinePageRequest => {
      if (page) {
        const linkListSubParent = linklists?.length ? getAllSubjectLinkParentInfo(linklists, page.id, "page") : [];
        return {
          page: {
            title: page.title || "",
            content: page.content || "",
            alias: page.alias || "",
            published_on: page.published_on || "",
            meta_description: page.meta_description || "",
            meta_title: page.meta_title || "",
            template_layout: page.template_layout || "",
          },
          linkListIds: linkListSubParent.map((l) => l.linklistRootId),
          linkListSubParent,
          linkListSubParentDefault: linkListSubParent,
          redirect301: false,
        };
      } else {
        return {
          page: {
            title: "",
            content: "",
            alias: "",
            published_on: new Date().toISOString(),
            meta_description: "",
            meta_title: "",
            template_layout: "page",
          },
          linkListIds: [],
          linkListSubParent: [],
        };
      }
    }, [linklists, page]),
    onSubmit: async (data) => {
      try {
        if (!isEdit) {
          const response = await createPage({
            ...data.page,
            alias: data.page.alias ? data.page.alias : toAlias(data.page.title),
          }).unwrap();
          await handleUpdateLinkList(response);
          navigate(`/admin/pages/${response.id}?c=1`, {
            state: DISCARD_CONFIRMED,
          });
          showToast("Tạo mới trang nội dung thành công");
        } else {
          const response = await updatePage({ id: Number(id), ...data.page }).unwrap();
          await handleUpdateLinkList(response);
          if (page && data.redirect301 && response.alias !== page.alias) {
            await deleteAndUpdateRedirect({ path: `/${page.alias}`, target: `/${response.alias}` }).unwrap();
          }
          showToast("Cập nhật trang nội dung thành công");
        }
        return submitSuccess();
      } catch (e) {
        handleErrorApi(e, isEdit ? "Cập nhật trang nội dung thất bại" : "Tạo trang nội dung thất bại");
        return submitErrors([]);
      }
    },
  });

  useEffect(() => {
    if (isFetchingPage || isCreate || isFetchingLinklists) return;
    if (!page) {
      navigate(backLink);
      showErrorToast("Trang nội dung không tồn tại hoặc đã bị xóa");
    }
    setDataIsReady(true);
  }, [backLink, isCreate, isFetchingLinklists, isFetchingPage, navigate, page]);

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

  const [deletePage, { isLoading: isDeleting }] = useDeletePageMutation();

  const handleDeletePage = async () => {
    try {
      await deletePage(Number(id)).unwrap();
      navigate(`/admin/pages`);
      showToast("Xóa trang nội dung thành công");
    } catch (e) {
      if (isClientError(e)) {
        showErrorToast(e.data.message);
      }
    }
  };

  const pageOtherActions = useMemo(
    (): ActionListItemDescriptor[] =>
      (appLinks || []).map((item) => ({
        icon: item.icon?.src ? () => <StyledIconImage src={item.icon?.src} alt={item.app.title} /> : undefined,
        content: item.text,
        url: item.url,
        external: !item.app.embedded,
      })),
    [appLinks]
  );

  const contextualSaveBarMarkup =
    (isDirty && !isEmpty(fieldDirties)) || isCreate ? (
      <ContextualSaveBar
        message={!id ? "" : "Chỉnh sửa chưa được lưu"}
        saveAction={{
          content: "Lưu",
          disabled: isSubmitting || !isDirty || isEmpty(fieldDirties),
          onAction: handleValidateBeforeSubmit,
          loading: isSubmitting,
        }}
        discardAction={{
          content: "Hủy",
          discardConfirmationModal: isEdit,
          disabled: isSubmitting,
          onAction: () => {
            !id ? navigate("/admin/pages") : reset();
          },
        }}
      />
    ) : null;

  const pageActionMarkup = (
    <Layout.Section>
      <PageActions
        primaryAction={{
          content: "Lưu",
          disabled: !isDirty || isEmpty(fieldDirties),
          onAction: handleValidateBeforeSubmit,
          loading: isSubmitting,
        }}
        secondaryActions={
          isEdit && [
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

  useLeavePage(isDirty && !openModalConfirmDelete && !isEmpty(fieldDirties));

  if (isEdit && !dataIsReady) {
    return <PageManagerSkeleton />;
  }

  const pageLoading = isFetchingPage || isFetchingLinklists || isSubmitting || isFetchingAppLinks;

  const bannerMarkup =
    page && showInCreate ? (
      <Banner
        hideDismiss
        status="success"
        title={`Trang nội dung ${page.title} đã được tạo thành công`}
        action={{ content: "Tạo trang nội dung khác", url: `/admin/pages/create` }}
      />
    ) : null;

  const title = page ? page.title : "Thêm trang nội dung";

  return (
    <PageComponent
      title={title}
      backAction={{
        url: backLink,
      }}
      secondaryActions={
        page
          ? [
              {
                content: "Xem trên web",
                icon: ShowIcon,
                external: true,
                url: getOnlineStoreUrl(`/${page.alias}`),
              },
            ]
          : []
      }
      actionGroups={
        pageOtherActions.length
          ? [
              {
                title: "Thao tác khác",
                actions: pageOtherActions,
              },
            ]
          : undefined
      }
    >
      <DocumentTitle title={title} />
      {pageLoading && <Loading />}
      {contextualSaveBarMarkup}
      <Layout>
        {bannerMarkup ? <Layout.Section>{bannerMarkup}</Layout.Section> : null}
        <Layout.Section>
          <Card title="Thông tin trang" sectioned>
            <FormLayout>
              <Control.Text
                control={control}
                name="page.title"
                validates={[
                  notEmptyString("Nhập vào tiêu đề trang nội dung"),
                  lengthLessThanOrEqual(320, "Tiêu đề trang nội dung không được vượt quá 320 ký tự"),
                ]}
                render={(field) => (
                  <AISuggestTextField
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề"
                    {...field}
                    requiredIndicator
                    context="page"
                    onApplySuggestion={field.onChange}
                  />
                )}
              />
              <Control.Text
                name="page.content"
                control={control}
                render={(field) => (
                  <RichTextEditor
                    id="content"
                    label="Nội dung"
                    {...field}
                    value={field.value || ""}
                    maxLength={30000}
                    showCharacterCount
                    aiSuggestContext="page"
                  />
                )}
              />
            </FormLayout>
          </Card>
          <Control.Text
            control={control}
            name="page.meta_title"
            render={(metaTitleField) => (
              <Control.Text
                control={control}
                name="page.meta_description"
                render={(metaDescriptionField) => (
                  <Control.Text
                    control={control}
                    name="page.alias"
                    render={(aliasField) => (
                      <Control.Choice
                        control={control}
                        name="redirect301"
                        render={(redirect301Field) => (
                          <SeoCard
                            type="page"
                            inheritFrom={{
                              title: fieldValues.page.title,
                              description: fieldValues.page.content,
                              alias: page?.alias,
                            }}
                            value={{
                              title: metaTitleField.value,
                              description: metaDescriptionField.value,
                              alias: aliasField.value,
                              redirectNewAlias: redirect301Field.checked,
                            }}
                            onChange={({ alias, description, title, redirectNewAlias }) => {
                              metaTitleField.onChange(title);
                              metaDescriptionField.onChange(description);
                              aliasField.onChange(alias);
                              redirect301Field.onChange(Boolean(redirectNewAlias));
                            }}
                          />
                        )}
                      />
                    )}
                  />
                )}
              />
            )}
          />
        </Layout.Section>
        <Layout.Section secondary>
          <Control.Text
            name="page.published_on"
            control={control}
            render={(field) => <SchedulePublishCard currentValue={page?.published_on ?? null} {...field} />}
          />
          {hasThemePerm ? (
            <Control.Text
              name="page.template_layout"
              control={control}
              render={(field) => <TemplateLayoutCard type="page" {...field} />}
            />
          ) : null}
          {hasLinkPerm ? (
            <PinMenuCard
              description="Thêm trang nội dung này vào menu trên website của bạn."
              linkListSubParent={fieldValues.linkListSubParent || []}
              onChange={(newList) => setValue("linkListSubParent", newList, { shouldDirty: true })}
            />
          ) : null}
        </Layout.Section>
        {pageActionMarkup}
      </Layout>
      {openModalConfirmDelete ? (
        <ConfirmModal
          open
          onDismiss={() => setOpenModalConfirmDelete(false)}
          confirmAction={{
            content: "Xóa trang nội dung",
            destructive: true,
            loading: isDeleting,
            onAction: handleDeletePage,
          }}
          title="Xóa trang nội dung"
          body={
            <>
              Bạn có chắc chắn muốn xóa trang nội dung <strong>{page?.title}</strong>. Thao tác này không thể khôi phục.
            </>
          }
        />
      ) : null}
    </PageComponent>
  );
}

const StyledIconImage = styled.img``;
