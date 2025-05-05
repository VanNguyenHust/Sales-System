import { useEffect, useMemo, useRef } from "react";
import { Autocomplete, type OptionDescriptor, type TextFieldProps } from "@/ui-components";
import { PlusCircleOutlineIcon } from "@/ui-icons";

import { SelectEmptyState } from "app/components/SelectEmptyState";
import { useDispatch } from "app/types";
import { useQueryAndPaging } from "app/utils/useQueryAndPaging";
import { useToggle } from "app/utils/useToggle";

import { blogApi, useGetBlogQuery, useGetBlogsWithInfiniteQuery } from "../../api";

interface Props extends Pick<TextFieldProps, "label" | "disabled" | "value" | "onChange" | "error"> {
  onChange: (id: string) => void;
  onCreate: (name: string) => void;
}

export const ArticleBlogSelect = ({ value, onChange, onCreate, ...selectRestProps }: Props) => {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const limit = 20;
  const dispatch = useDispatch();
  const { query, queryPending, changeQuery, debouncedQuery, page, setSwitchingComplete, isSwitching, setPage } =
    useQueryAndPaging();
  const { value: touched, setTrue: setTouched } = useToggle(false);

  const { data: selectedItem } = useGetBlogQuery(Number(value), {
    skip: !value || value === "0",
  });

  const { currentData: items, isFetching } = useGetBlogsWithInfiniteQuery(
    {
      name: debouncedQuery,
      page,
      limit,
    },
    {
      skip: !touched || queryPending,
    }
  );

  useEffect(() => {
    if (!isFetching) {
      setSwitchingComplete();
    }
  }, [isFetching, setSwitchingComplete]);

  const loading = isFetching || queryPending;

  const hasMore = isSwitching || limit * page <= (items ?? []).length;

  const options = useMemo(
    (): OptionDescriptor[] =>
      (items || []).map((blog) => ({
        label: blog.name,
        value: blog.id.toString(),
      })),
    [items]
  );

  // reset query when focus
  const handleSelectFocus = () => {
    changeQuery("");
    setTouched();
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(page + 1);
    }
  };

  const handleChange = async (value: string[]) => {
    const id = Number(value[0]);
    const selected = items?.find((item) => item.id === id);
    if (selected) {
      // manual set cache
      await dispatch(blogApi.util.upsertQueryData("getBlog", id, selected));
    }
    onChange(value[0]);
  };

  const placeholder =
    value === "0" ? "Tạo danh mục bài viết mới" : selectedItem ? selectedItem.name : "Chọn danh mục bài viết";

  const textField = (
    <Autocomplete.Select {...selectRestProps} value={value} placeholder={placeholder} onFocus={handleSelectFocus} />
  );

  return (
    <span ref={wrapperRef}>
      <Autocomplete
        header={<Autocomplete.HeaderSearch value={query} onChange={changeQuery} />}
        actionBefore={{
          primary: true,
          icon: PlusCircleOutlineIcon,
          content: "Tạo danh mục mới",
          onAction: () => {
            onCreate(query);
            if (wrapperRef.current) {
              // make popover close
              wrapperRef.current.querySelector("input")?.click();
            }
          },
        }}
        options={options}
        selected={value ? [value] : []}
        onSelect={handleChange}
        textField={textField}
        loading={loading}
        emptyState={<SelectEmptyState />}
        onLoadMoreResults={loadMore}
        willLoadMoreResults={hasMore}
      />
    </span>
  );
};
