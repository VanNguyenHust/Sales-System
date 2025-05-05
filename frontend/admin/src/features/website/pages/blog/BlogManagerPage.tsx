import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import {
  type ActionListItemDescriptor,
  Banner,
  Card,
  ChoiceList,
  ContextualSaveBar,
  FormLayout,
  Layout,
  Loading,
  Page,
  PageActions,
  TextField,
} from "@/ui-components";
import { ShowIcon } from "@/ui-icons";
import { forEach, isEmpty } from "lodash-es";

import { isClientError } from "app/client";
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
import { useNavigate } from "app/utils/useNavigate";
import { useTenant } from "app/utils/useTenant";

import { Blog, CombineBlogRequest, Commentable } from "../../types";
import { getAllSubjectLinkParentInfo, updateSubjectLink } from "../../utils/linklist";
import { useGetLinklistsQuery, useUpdateLinklistMutation } from "../menu/api";
import { PinMenuCard } from "../menu/components/PinMenuCard";
import { SeoCard } from "../page/components/SeoCard";
import { TemplateLayoutCard } from "../page/components/TemplateLayoutCard";
import { toAlias } from "../page/utils/text";
import { useDeleteAndInsertRedirectMutation } from "../redirect/api";

import { BlogManagerSkeleton } from "./components/create-or-edit/BlogManagerSkeleton";
import { CommentableOptions } from "./utils/contants";
import { useCreateBlogMutation, useDeleteBlogMutation, useGetBlogQuery, useUpdateBlogMutation } from "./api";

export default function BlogManagerPage() {
  const { backLink = "/admin/blogs" } = useBackLink();
  const { getOnlineStoreUrl } = useTenant();
  const tenantUrl = getOnlineStoreUrl("");
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
    data: blog,
    isLoading: isLoadingBlog,
    isFetching: isFetchingBlog,
  } = useGetBlogQuery(Number(id), {
    refetchOnMountOrArgChange: true,
    skip: !isEdit,
  });

  const { data: appLinks, isFetching: isFetchingAppLinks } = useGetAppLinksQuery(
    { type: "blogs", location: "show", resource_id: Number(id) },
    {
      skip: !isEdit,
    }
  );

  useEffect(() => {
    if (showInCreate && id) {
      history.replaceState(null, "", `/admin/blogs/${id}`);
    }
  }, [showInCreate, id]);

  useEffect(() => {
    if (isEdit && !blog && !isLoadingBlog) {
      showToast("Danh mục bài viết không tồn tại hoặc đã bị xóa", { error: true });
      navigate("/admin/blogs");
    }
  }, [navigate, isEdit, blog, isLoadingBlog]);

  const { hasSomePermissions } = usePermission();
  const hasThemePerm = hasSomePermissions(["themes"]);
  const hasLinkPerm = hasSomePermissions(["links"]);

  const { data: linklists, isFetching: isFetchingLinklists } = useGetLinklistsQuery(undefined, { skip: !hasLinkPerm });
  const [createBlog, { isLoading: isLoadingCreateBlog }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isLoadingUpdateBlog }] = useUpdateBlogMutation();
  const [updateLinklist, { isLoading: isLoadingUpdateLinklist }] = useUpdateLinklistMutation();
  const [deleteAndUpdateRedirect, { isLoading: isLoadingDeleteAndUpdateRedirect }] =
    useDeleteAndInsertRedirectMutation();

  const handleUpdateLinkList = async (response: Blog) => {
    if (getFieldState("linkListSubParent").isDirty) {
      await updateSubjectLink(
        {
          subjectId: response.id,
          type: "blog",
          title: response.name,
          subjectParents: fieldValues.linkListSubParent,
          linklists: linklists ?? [],
        },
        updateLinklist
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
  } = useCustomForm<CombineBlogRequest>({
    values: useMemo((): CombineBlogRequest => {
      if (blog) {
        const linkListSubParent = linklists?.length ? getAllSubjectLinkParentInfo(linklists, blog.id, "blog") : [];
        return {
          blog: {
            name: blog.name || "",
            description: blog.description || "",
            alias: blog.alias || "",
            meta_description: blog.meta_description || "",
            meta_title: blog.meta_title || "",
            commentable: blog.commentable || Commentable.NO,
            template_layout: blog.template_layout || "",
          },
          linkListIds: linkListSubParent.map((l) => l.linklistRootId),
          linkListSubParent,
          linkListSubParentDefault: linkListSubParent,
          redirect301: false,
        };
      } else {
        return {
          blog: {
            name: "",
            description: "",
            alias: "",
            commentable: Commentable.NO,
            meta_description: "",
            meta_title: "",
            template_layout: "blog",
          },
          linkListIds: [],
          linkListSubParent: [],
        };
      }
    }, [blog, linklists]),
    onSubmit: async (data) => {
      try {
        if (!isEdit) {
          const response = await createBlog({
            ...data.blog,
            alias: data.blog.alias ? data.blog.alias : toAlias(data.blog.name),
          }).unwrap();
          await handleUpdateLinkList(response);
          navigate(`/admin/blogs/${response.id}?c=1`, {
            state: DISCARD_CONFIRMED,
          });
          showToast("Tạo mới danh mục bài viết thành công");
        } else {
          const response = await updateBlog({ id: Number(id), ...data.blog }).unwrap();
          await handleUpdateLinkList(response);
          if (blog && data.redirect301 && response.alias !== blog.alias) {
            await deleteAndUpdateRedirect({ path: `/${blog.alias}`, target: `/${response.alias}` }).unwrap();
          }
          showToast("Cập nhật danh mục bài viết thành công");
        }
        return submitSuccess();
      } catch (e) {
        handleErrorApi(e, isEdit ? "Cập nhật danh mục bài viết thất bại" : "Tạo danh mục bài viết thất bại");
        return submitErrors([]);
      }
    },
  });

  useEffect(() => {
    if (isFetchingBlog || isCreate || isFetchingLinklists) return;
    if (!blog) {
      navigate(backLink);
      showErrorToast("Không tìm thấy danh mục bài viết");
    }
    setDataIsReady(true);
  }, [backLink, blog, isCreate, isFetchingBlog, isFetchingLinklists, navigate]);

  const pageOtherActions = useMemo((): ActionListItemDescriptor[] => {
    const appLinkActions: ActionListItemDescriptor[] = (appLinks || []).map((item) => ({
      icon: item.icon?.src ? () => <StyledIconImage src={item.icon?.src} alt={item.app.title} /> : undefined,
      content: item.text,
      url: item.url,
      external: !item.app.embedded,
    }));
    return appLinkActions;
  }, [appLinks]);

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

  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(Number(id)).unwrap();
      navigate(`/admin/blogs`);
      showToast("Xóa danh mục bài viết thành công");
    } catch (e) {
      if (isClientError(e)) {
        showErrorToast(e.data.message);
        return submitErrors([{ message: e.data.message }]);
      }
    }
  };

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
            !id ? navigate("/admin/blogs") : reset();
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
    return <BlogManagerSkeleton />;
  }

  const pageLoading =
    isFetchingBlog ||
    isFetchingLinklists ||
    isLoadingCreateBlog ||
    isLoadingUpdateBlog ||
    isLoadingUpdateLinklist ||
    isLoadingDeleteAndUpdateRedirect ||
    isFetchingAppLinks;

  const bannerMarkup =
    blog && showInCreate ? (
      <Banner
        hideDismiss
        status="success"
        title={`Danh mục bài viết ${blog.name} đã được tạo thành công`}
        action={{ content: "Tạo danh mục bài viết khác", url: `/admin/blogs/create` }}
      />
    ) : null;

  const title = isCreate ? "Thêm danh mục bài viết" : blog?.name ?? "";

  return (
    <Page
      title={title}
      backAction={{
        url: backLink,
      }}
      secondaryActions={
        isEdit
          ? [
              {
                content: "Xem trên web",
                icon: ShowIcon,
                external: true,
                url: `${tenantUrl}/${blog?.alias}`,
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
          <Card title="Thông tin danh mục bài viết" sectioned>
            <FormLayout>
              <Control.Text
                control={control}
                name="blog.name"
                validates={[
                  notEmptyString("Nhập vào tên danh mục bài viết"),
                  lengthLessThanOrEqual(320, "Tên danh mục bài viết không được vượt quá 320 ký tự"),
                ]}
                render={(field) => (
                  <TextField label="Tiêu đề" placeholder="Nhập tiêu đề" {...field} requiredIndicator />
                )}
              />
              <Control.Text
                name="blog.description"
                control={control}
                render={(field) => (
                  <>
                    <RichTextEditor
                      id="description"
                      label="Mô tả"
                      {...field}
                      value={field.value || ""}
                      maxLength={30000}
                      showCharacterCount
                    />
                  </>
                )}
              />
            </FormLayout>
          </Card>

          <Control.Text
            control={control}
            name="blog.meta_title"
            render={(metaTitleField) => (
              <Control.Text
                control={control}
                name="blog.meta_description"
                render={(metaDescriptionField) => (
                  <Control.Text
                    control={control}
                    name="blog.alias"
                    render={(aliasField) => (
                      <Control.Choice
                        control={control}
                        name="redirect301"
                        render={(redirect301Field) => (
                          <SeoCard
                            type="blog"
                            inheritFrom={{
                              title: fieldValues.blog.name,
                              description: fieldValues.blog.description,
                              alias: blog?.alias,
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
          <Card title="Bình luận">
            <Card.Section>
              Quản lý cách thức bình luận được xử lý trong danh mục bài viết
              <Control.ChoiceList
                control={control}
                name="blog.commentable"
                render={(field) => (
                  <ChoiceList
                    {...field}
                    choices={CommentableOptions}
                    selected={field.value ? [field.value] : [Commentable.NO]}
                  />
                )}
              />
            </Card.Section>
          </Card>
          {hasThemePerm ? (
            <Control.Text
              name="blog.template_layout"
              control={control}
              render={(field) => <TemplateLayoutCard type="blog" {...field} />}
            />
          ) : null}
          {hasLinkPerm ? (
            <PinMenuCard
              description="Thêm danh mục bài viết này vào menu trên website của bạn."
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
            content: "Xóa danh mục bài viết",
            destructive: true,
            loading: isDeleting,
            onAction: handleDeleteBlog,
          }}
          title="Xóa danh mục bài viết"
          body={
            <>
              Bạn có chắc chắn muốn xóa danh mục bài viết <strong>{blog?.name}</strong>. Thao tác này không thể khôi
              phục.
            </>
          }
        />
      ) : null}
    </Page>
  );
}

const StyledIconImage = styled.img``;
