import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import {
  type ActionListItemDescriptor,
  Banner,
  Button,
  Card,
  Collapsible,
  ContextualSaveBar,
  FormLayout,
  Layout,
  Loading,
  Page,
  PageActions,
  Stack,
  Text,
  TextField,
  useTheme,
} from "@/ui-components";
import { ShowIcon } from "@/ui-icons";
import { forEach, isEmpty, isEqual, isNil } from "lodash-es";

import { isClientError } from "app/client";
import { AISuggestTextField } from "app/components/AISuggestTextField";
import { ConfirmModal } from "app/components/ConfirmModal";
import { DocumentTitle } from "app/components/DocumentTitle";
import { useLeavePage } from "app/components/leave-page";
import { RichTextEditor, RichTextEditorRef } from "app/components/RichTextEditor";
import { useGetAppLinksQuery } from "app/features/app/api";
import { usePermission } from "app/features/auth/usePermission";
import { joinTags, splitTags } from "app/features/customer/utils/customer";
import { handleErrorApi } from "app/utils/error";
import {
  Control,
  lengthLessThanOrEqual,
  notEmpty,
  notEmptyString,
  submitErrors,
  submitSuccess,
  useCustomForm,
} from "app/utils/form";
import { DISCARD_CONFIRMED } from "app/utils/navigation/state";
import { showErrorToast, showToast } from "app/utils/toast";
import { useBackLink } from "app/utils/useBackLink";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useTenant } from "app/utils/useTenant";

import { CombineArticleRequest } from "../../types";
import { SchedulePublishCard } from "../page/components/SchedulePublishCard";
import { SeoCard } from "../page/components/SeoCard";
import { TemplateLayoutCard } from "../page/components/TemplateLayoutCard";
import { toAlias } from "../page/utils/text";
import { useDeleteAndInsertRedirectMutation } from "../redirect/api";

import { ArticleTagSelect } from "./components/ArticleTagSelect";
import { ArticleAuthorSelect } from "./components/create-or-edit/ArticleAuthorSelect";
import { ArticleBlogSelect } from "./components/create-or-edit/ArticleBlogSelect";
import { ArticleCommentCard } from "./components/create-or-edit/ArticleCommentCard";
import { ArticleManagerSkeleton } from "./components/create-or-edit/ArticleManagerSkeleton";
import { DragDropImages } from "./components/DragDropImages";
import { ImportImageFromUrlModal } from "./components/ImportImageFromUrlModal";
import { SelectTagsModal } from "./components/SelectTagsModal";
import {
  useCreateArticleMutation,
  useCreateBlogMutation,
  useDeleteArticleMutation,
  useGetArticleQuery,
  useGetBlogQuery,
  useUpdateArticleMutation,
} from "./api";

export default function ArticleManagerPage() {
  const currentUser = useCurrentUser();
  const { backLink = "/admin/articles" } = useBackLink();
  const { getOnlineStoreUrl } = useTenant();
  const navigate = useNavigate();
  const { id } = useParams<{
    id: string;
  }>();
  const theme = useTheme();
  const summaryEditorRef = useRef<RichTextEditorRef>(null);

  const [urlParams, _] = useSearchParams();
  const showInCreate = urlParams.get("c");
  const isCreate = !id;
  const isEdit = !!id;

  const [dataIsReady, setDataIsReady] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [openImportImageUrl, setOpenImportImageUrl] = useState<boolean>(false);
  const [isOpenSelectTags, setOpenSelectTags] = useState<boolean>(false);

  const {
    data: article,
    isLoading: isLoadingArticle,
    isFetching: isFetchingArticle,
  } = useGetArticleQuery(Number(id), {
    refetchOnMountOrArgChange: true,
    skip: !isEdit,
  });

  const { data: appLinks, isFetching: isFetchingAppLinks } = useGetAppLinksQuery(
    { type: "articles", location: "show", resource_id: Number(id) },
    {
      skip: !isEdit,
    }
  );

  useEffect(() => {
    if (showInCreate && id) {
      history.replaceState(null, "", `/admin/articles/${id}`);
    }
  }, [showInCreate, id]);

  useEffect(() => {
    if (isEdit && !article && !isLoadingArticle) {
      showToast("Bài viết không tồn tại hoặc đã bị xóa", { error: true });
      navigate("/admin/articles");
    }
  }, [navigate, isEdit, article, isLoadingArticle]);

  const { data: blog, isFetching: isFetchingBlog } = useGetBlogQuery(Number(article?.blog_id), {
    skip: !isEdit || !article,
  });

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();
  const [createBlog] = useCreateBlogMutation();
  const [deleteAndUpdateRedirect] = useDeleteAndInsertRedirectMutation();

  const { hasSomePermissions } = usePermission();
  const hasThemePerm = hasSomePermissions(["themes"]);

  const { control, reset, isDirty, isSubmitting, submit, setValue, fieldValues, errors, fieldDirties, trigger } =
    useCustomForm<CombineArticleRequest>({
      values: useMemo((): CombineArticleRequest => {
        if (article) {
          return {
            article: {
              title: article.title || "",
              alias: article.alias || "",
              author: article.author || "",
              blog_id: article.blog_id || undefined,
              blog_name: "",
              meta_description: article.meta_description || "",
              meta_title: article.meta_title || "",
              published_on: article.published_on || "",
              content: article.content || "",
              summary: article.summary || "",
              tags: article.tags || "",
              template_layout: article.template_layout || "",
              image: article.image || undefined,
              alt_image: article.alt_image || "",
            },
            redirect301: false,
          };
        } else {
          const defaultAuthor = [currentUser.last_name, currentUser.first_name].filter(Boolean).join(" ");
          return {
            article: {
              title: "",
              alias: "",
              author: defaultAuthor,
              blog_name: "",
              published_on: new Date().toISOString(),
              meta_description: "",
              meta_title: "",
              content: "",
              summary: "",
              tags: "",
              template_layout: "article",
            },
          };
        }
      }, [article, currentUser.first_name, currentUser.last_name]),
      onSubmit: async (data) => {
        try {
          const request = { ...data.article };
          if (article && article.image && isEqual(article.image, data.article.image)) {
            request.image = undefined;
          }
          if (data.article.blog_id === 0 && data.article.blog_name) {
            const newBlog = await createBlog({
              name: data.article.blog_name,
            }).unwrap();
            request.blog_id = newBlog.id;
          }
          if (!isEdit) {
            if (!request.alias) {
              request.alias = toAlias(request.title);
            }
            const response = await createArticle(request).unwrap();
            navigate(`/admin/articles/${response.id}?c=1`, {
              state: DISCARD_CONFIRMED,
            });
            showToast("Tạo mới bài viết thành công");
          } else {
            const response = await updateArticle({ id: Number(id), ...request }).unwrap();
            if (article && data.redirect301 && response.alias !== article.alias) {
              await deleteAndUpdateRedirect({ path: `/${article.alias}`, target: `/${response.alias}` }).unwrap();
            }
            showToast("Cập nhật bài viết thành công");
          }
          return submitSuccess();
        } catch (e) {
          handleErrorApi(e, isEdit ? "Cập nhật bài viết thất bại" : "Tạo bài viết thất bại");
          return submitErrors([]);
        }
      },
    });

  useEffect(() => {
    if (isFetchingArticle || isCreate) return;
    if (article) {
      setShowSummary(!!article.summary);
    } else {
      navigate(backLink);
      showToast("Bài viết không tồn tại hoặc đã bị xóa", { error: true });
    }
    setDataIsReady(true);
  }, [article, backLink, isCreate, isFetchingArticle, navigate]);

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

  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

  const handleDeleteArticle = async () => {
    try {
      await deleteArticle(Number(id)).unwrap();
      navigate(`/admin/articles`);
      showToast("Xóa bài viết thành công");
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
            !id ? navigate("/admin/articles") : reset();
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
    return <ArticleManagerSkeleton />;
  }

  const pageLoading = isFetchingBlog || isFetchingArticle || isSubmitting || isFetchingAppLinks;

  const bannerMarkup =
    article && showInCreate ? (
      <Banner
        hideDismiss
        status="success"
        title={`Bài viết ${article.title} đã được tạo thành công`}
        action={{ content: "Tạo bài viết khác", url: `/admin/articles/create` }}
      />
    ) : null;

  const title = article ? article.title : "Thêm bài viết";

  return (
    <Page
      title={title}
      backAction={{
        url: backLink,
      }}
      secondaryActions={
        article
          ? [
              {
                content: "Xem trên web",
                icon: ShowIcon,
                external: true,
                url: getOnlineStoreUrl(`/${article.alias}`),
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
          <Card title="Thông tin bài viết" sectioned>
            <FormLayout>
              <Control.Text
                control={control}
                name="article.title"
                validates={[
                  notEmptyString("Nhập vào tên bài viết"),
                  lengthLessThanOrEqual(320, "Tên bài viết không được vượt quá 320 ký tự"),
                ]}
                render={(field) => (
                  <AISuggestTextField
                    label="Tiêu đề"
                    placeholder="Nhập tiêu đề"
                    {...field}
                    requiredIndicator
                    context="article"
                    onApplySuggestion={field.onChange}
                  />
                )}
              />
              <Control.Text
                name="article.content"
                control={control}
                render={(field) => (
                  <RichTextEditor
                    id="content"
                    label="Nội dung bài viết"
                    {...field}
                    value={field.value || ""}
                    maxLength={30000}
                    showCharacterCount
                    aiSuggestContext="article"
                    aiSuggestExtraContext={{
                      maxChars: 8000,
                    }}
                  />
                )}
              />
              <Stack spacing="extraTight" vertical>
                <Button plain onClick={() => setShowSummary(!showSummary)}>
                  {showSummary ? "Ẩn mô tả ngắn" : "Thêm mô tả ngắn"}
                </Button>
                <Collapsible
                  open={showSummary}
                  transition={{ duration: theme.motion.duration150, timingFunction: "ease-in" }}
                  expandOnPrint
                  onAnimationEnd={() => summaryEditorRef.current?.remeasureElements()}
                >
                  <Text as="p">Mô tả ngắn</Text>
                  <StyledSummary>
                    <FormLayout>
                      <Control.Text
                        name="article.summary"
                        control={control}
                        render={(field) => (
                          <RichTextEditor
                            id="summary"
                            {...field}
                            value={field.value || ""}
                            maxLength={500}
                            showCharacterCount
                            ref={summaryEditorRef}
                            aiSuggestContext="article"
                            aiSuggestExtraContext={{
                              isShortContext: true,
                              shortContext: fieldValues.article.content,
                              maxChars: 8000,
                            }}
                          />
                        )}
                      />
                    </FormLayout>
                  </StyledSummary>
                </Collapsible>
              </Stack>
            </FormLayout>
          </Card>
          <Control.Text
            control={control}
            name="article.meta_title"
            render={(metaTitleField) => (
              <Control.Text
                control={control}
                name="article.meta_description"
                render={(metaDescriptionField) => (
                  <Control.Text
                    control={control}
                    name="article.alias"
                    render={(aliasField) => (
                      <Control.Choice
                        control={control}
                        name="redirect301"
                        render={(redirect301Field) => (
                          <SeoCard
                            type="article"
                            inheritFrom={{
                              title: fieldValues.article.title,
                              description: fieldValues.article.content,
                              alias: article?.alias,
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
          {isEdit && blog ? <ArticleCommentCard articleId={article ? article.id : 0} blog={blog} /> : null}
        </Layout.Section>
        <Layout.Section secondary>
          <Control.Text
            name="article.published_on"
            control={control}
            render={(field) => <SchedulePublishCard currentValue={article?.published_on ?? null} {...field} />}
          />
          <Card
            title="Ảnh bài viết"
            actions={
              fieldValues.article.image
                ? [{ content: "Thêm ảnh từ URL", onAction: () => setOpenImportImageUrl(true) }]
                : []
            }
          >
            <Card.Section>
              <DragDropImages
                isCreate
                alt={fieldValues.article.alt_image}
                image={fieldValues.article.image || undefined}
                appendImage={(data) => {
                  setValue("article.image", data, { shouldDirty: true });
                  setValue("article.alt_image", undefined, { shouldDirty: true });
                }}
                removeFormImage={() => {
                  setValue("article.image", undefined, { shouldDirty: true });
                  setValue("article.alt_image", undefined, { shouldDirty: true });
                }}
                updateAltImage={(alt) => {
                  setValue("article.alt_image", alt, { shouldDirty: true });
                }}
                showImportUrl={() => {
                  setOpenImportImageUrl(true);
                }}
              />
            </Card.Section>
          </Card>
          {hasThemePerm ? (
            <Control.Text
              name="article.template_layout"
              control={control}
              render={(field) => <TemplateLayoutCard type="article" {...field} />}
            />
          ) : null}
          <Card title="Thông tin khác">
            <Card.Section>
              <FormLayout>
                <Control.Text
                  name="article.author"
                  control={control}
                  render={(field) => <ArticleAuthorSelect {...field} isCreate={isCreate} label="Tác giả" />}
                />
                <Control.Field
                  name="article.blog_id"
                  control={control}
                  validates={[notEmpty("Vui lòng chọn danh mục bài viết")]}
                  render={(field) => (
                    <ArticleBlogSelect
                      {...field}
                      label="Danh mục bài viết"
                      value={!isNil(field.value) ? field.value.toString() : ""}
                      onChange={(value) => {
                        setValue("article.blog_name", "");
                        field.onChange(Number(value));
                      }}
                      onCreate={(name) => {
                        setValue("article.blog_name", name);
                        field.onChange(0);
                      }}
                    />
                  )}
                />
                {fieldValues.article.blog_id === 0 ? (
                  <Control.Text
                    name="article.blog_name"
                    control={control}
                    validates={[
                      notEmptyString("Vui lòng nhập tên danh mục bài viết"),
                      lengthLessThanOrEqual(320, "Tên danh mục bài viết không được vượt quá 320 ký tự"),
                    ]}
                    render={(field) => (
                      <TextField
                        {...field}
                        label="Tiêu đề danh mục bài viết"
                        placeholder="Nhập tiêu đề danh mục bài viết"
                        value={field.value ?? ""}
                        requiredIndicator
                      />
                    )}
                  />
                ) : null}
                <Control.Text
                  name="article.tags"
                  control={control}
                  render={(field) => (
                    <ArticleTagSelect
                      label="Tag"
                      labelAction={{
                        content: "Danh sách tag",
                        onAction: () => setOpenSelectTags(true),
                      }}
                      placeholder="Tìm kiếm hoặc thêm mới"
                      value={splitTags(field.value)}
                      onChange={(value) => field.onChange(joinTags(value))}
                    />
                  )}
                />
              </FormLayout>
            </Card.Section>
          </Card>
        </Layout.Section>
        {pageActionMarkup}
      </Layout>
      {openImportImageUrl ? (
        <ImportImageFromUrlModal
          onClose={() => setOpenImportImageUrl(false)}
          onSubmit={(data) => setValue("article.image", data, { shouldDirty: true })}
        />
      ) : null}
      {isOpenSelectTags ? (
        <Control.Text
          name="article.tags"
          control={control}
          render={(field) => (
            <SelectTagsModal
              tagsSelected={splitTags(field.value)}
              onClose={() => setOpenSelectTags(false)}
              applyTags={(value) => {
                field.onChange(joinTags(value));
                setOpenSelectTags(false);
              }}
            />
          )}
        />
      ) : null}
      {openModalConfirmDelete ? (
        <ConfirmModal
          open
          onDismiss={() => setOpenModalConfirmDelete(false)}
          confirmAction={{
            content: "Xóa bài viết",
            destructive: true,
            loading: isDeleting,
            onAction: handleDeleteArticle,
          }}
          title="Xóa bài viết"
          body={
            <>
              Bạn có chắc chắn muốn xóa bài viết <strong>{article?.title}</strong>. Thao tác này không thể khôi phục.
            </>
          }
        />
      ) : null}
    </Page>
  );
}

const StyledSummary = styled.div`
  padding-top: ${(p) => p.theme.spacing(2)};
`;

const StyledIconImage = styled.img``;
