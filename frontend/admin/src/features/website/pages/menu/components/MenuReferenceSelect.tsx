import { useEffect, useMemo } from "react";
import { Autocomplete, type OptionDescriptor } from "@/ui-components";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import {
  collectionApi,
  useGetCollectionDetailQuery,
  useGetCollectionsWithInfiniteQuery,
} from "app/features/collection/api";
import { productApi, useGetProductQuery, useSearchProductsWithInfiniteQuery } from "app/features/product/api";
import { LinkType } from "app/features/website/types";
import { useDispatch } from "app/types";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";

import { blogApi, useGetBlogQuery, useGetBlogsWithInfiniteQuery } from "../../blog/api";
import { pageApi, useGetPageQuery, useGetPagesWithInfiniteQuery } from "../../page/api";

interface Props {
  value: number;
  type: LinkType;
  error?: string;
  onChange: (value: number) => void;
}

export const MenuReferenceSelect = ({ value, type, error, onChange }: Props) => {
  const limit = 20;
  const dispatch = useDispatch();

  const { query, queryPending, changeQuery, debouncedQuery, page, setSwitchingComplete, isSwitching, setPage } =
    useQueryAndPaging();

  const { currentData: productSelected } = useGetProductQuery(value, {
    skip: !value || type !== LinkType.PRODUCT,
  });
  const { currentData: products, isFetching: isFetchingProducts } = useSearchProductsWithInfiniteQuery(
    { query: debouncedQuery, page, limit },
    { skip: queryPending || type !== LinkType.PRODUCT }
  );

  const { currentData: collectionSelected } = useGetCollectionDetailQuery(value, {
    skip: !value || type !== LinkType.COLLECTION,
  });
  const { currentData: collections, isFetching: isFetchingCollections } = useGetCollectionsWithInfiniteQuery(
    { name: debouncedQuery, page, limit },
    { skip: queryPending || type !== LinkType.COLLECTION }
  );

  const { currentData: pageSelected } = useGetPageQuery(value, {
    skip: !value || type !== LinkType.PAGE,
  });
  const { currentData: pages, isFetching: isFetchingPages } = useGetPagesWithInfiniteQuery(
    { title: debouncedQuery, page, limit },
    { skip: queryPending || type !== LinkType.PAGE }
  );

  const { currentData: blogSelected } = useGetBlogQuery(value, {
    skip: !value || type !== LinkType.BLOG,
  });
  const { currentData: blogs, isFetching: isFetchingBlogs } = useGetBlogsWithInfiniteQuery(
    { name: debouncedQuery, page, limit },
    { skip: queryPending || type !== LinkType.BLOG }
  );

  useEffect(() => {
    if (!isFetchingProducts && !isFetchingCollections && !isFetchingPages && !isFetchingBlogs) {
      setSwitchingComplete();
    }
  }, [isFetchingBlogs, isFetchingCollections, isFetchingPages, isFetchingProducts, setSwitchingComplete]);

  const loading = queryPending || isFetchingProducts || isFetchingCollections || isFetchingPages || isFetchingBlogs;

  const hasMoreProduct = limit * page <= (products?.products ?? []).length && type === LinkType.PRODUCT;
  const hasMoreCollection = limit * page <= (collections?.length || 0) && type === LinkType.COLLECTION;
  const hasMorePage = limit * page <= (pages?.length || 0) && type === LinkType.PAGE;
  const hasMoreBlog = limit * page <= (blogs?.length || 0) && type === LinkType.BLOG;

  const hasMore = isSwitching || hasMoreProduct || hasMoreBlog || hasMoreCollection || hasMorePage;

  const handleScrollToBottom = () => {
    if (!loading && hasMore) {
      setPage((page) => page + 1);
    }
  };

  const handleChangeQuery = (q: string) => {
    changeQuery(q);
    setPage(1);
  };

  const handleFocus = () => {
    changeQuery("");
    setPage(1);
  };

  const options: OptionDescriptor[] = useMemo(() => {
    switch (type) {
      case LinkType.PRODUCT:
        return (products?.products ?? []).map((product) => ({
          value: product.id.toString(),
          label: product.name,
        }));
      case LinkType.COLLECTION:
        return (collections || []).map((collection) => ({
          value: collection.id.toString(),
          label: collection.name,
        }));
      case LinkType.PAGE:
        return (pages || []).map((page) => ({
          value: page.id.toString(),
          label: page.title,
        }));
      case LinkType.BLOG:
        return (blogs || []).map((blog) => ({
          value: blog.id.toString(),
          label: blog.name,
        }));
    }
    return [];
  }, [blogs, collections, pages, products, type]);

  const handleChange = async (value: string[]) => {
    const id = Number(value[0]);
    switch (type) {
      case LinkType.PRODUCT: {
        const selected = (products?.products ?? []).find((item) => item.id === id);
        if (selected) {
          await dispatch(productApi.util.upsertQueryData("getProduct", id, selected));
        }
        break;
      }
      case LinkType.COLLECTION: {
        const selected = collections?.find((item) => item.id === id);
        if (selected) {
          await dispatch(collectionApi.util.upsertQueryData("getCollectionDetail", id, selected));
        }
        break;
      }
      case LinkType.PAGE: {
        const selected = pages?.find((item) => item.id === id);
        if (selected) {
          await dispatch(pageApi.util.upsertQueryData("getPage", id, selected));
        }
        break;
      }
      case LinkType.BLOG: {
        const selected = blogs?.find((item) => item.id === id);
        if (selected) {
          await dispatch(blogApi.util.upsertQueryData("getBlog", id, selected));
        }
        break;
      }
    }
    onChange(id);
  };

  const nameType =
    type === LinkType.PRODUCT
      ? "sản phẩm"
      : type === LinkType.COLLECTION
      ? "danh mục"
      : type === LinkType.PAGE
      ? "trang nội dung"
      : "danh mục bài viết";

  const placeholder = useMemo(() => {
    switch (type) {
      case LinkType.PRODUCT:
        return productSelected?.name || "";
      case LinkType.COLLECTION:
        return collectionSelected?.name || "";
      case LinkType.PAGE:
        return pageSelected?.title || "";
      case LinkType.BLOG:
        return blogSelected?.name || "";
    }
  }, [blogSelected, collectionSelected, pageSelected, productSelected, type]);

  const textField = (
    <Autocomplete.Select
      value={value ? value.toString() : ""}
      placeholder={placeholder ? placeholder : `Chọn ${nameType}`}
      error={error}
      onFocus={handleFocus}
    />
  );

  return (
    <Autocomplete
      header={
        <Autocomplete.HeaderSearch value={query} onChange={handleChangeQuery} placeholder={`Tìm kiếm ${nameType}`} />
      }
      loading={loading}
      options={options}
      selected={value ? [value.toString()] : []}
      onSelect={handleChange}
      textField={textField}
      willLoadMoreResults={hasMore}
      onLoadMoreResults={handleScrollToBottom}
      emptyState={<SelectEmptyState />}
    />
  );
};
