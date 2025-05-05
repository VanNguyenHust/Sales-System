import { useCallback, useEffect, useRef, useState } from "react";
import { type OptionDescriptor } from "@/ui-components";
import { isArray } from "lodash-es";

import QuickFilterDropdown, { QuickFilterDropdownProps } from "./QuickFilterDropdown";

interface QuickFilterFieldProps<T>
  extends Pick<
    QuickFilterDropdownProps,
    "withSelectAllAvailable" | "withOutPopover" | "withOutSearchable" | "singleSelection" | "limit"
  > {
  fetchOptions: (query: string, page: number, limit: number) => Promise<DataFilterSource<T> | undefined>;
  renderOption: (option: T) => OptionDescriptor;
  value?: T | T[];
  onChange: (value: T[]) => void;
  limit?: number;
}

export interface DataFilterSource<T> {
  data: T[];
  total: number;
}

function QuickFilterField<T>({
  fetchOptions,
  renderOption,
  value,
  onChange,
  limit = 10,
  ...props
}: QuickFilterFieldProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [metaData, setMetaData] = useState({
    currentPage: 0,
    totalPage: 0,
    totalItems: 0,
  });
  const [_value, setValue] = useState<T | T[] | undefined>(value);
  const [_query, setQuery] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [currentLimit, setCurrentLimit] = useState(limit);
  const refSelectedVariant = useRef<
    {
      value: string;
      variant?: T;
    }[]
  >([]);

  useEffect(() => {
    setValue(value);
    if (value) {
      if (isArray(value)) {
        refSelectedVariant.current = value.map((v) => {
          return {
            value: renderOption(v).value,
            variant: v,
          };
        });
      } else {
        refSelectedVariant.current = [
          {
            value: renderOption(value).value,
            variant: value,
          },
        ];
      }
    } else {
      refSelectedVariant.current = [];
    }
  }, [renderOption, value]);

  const handleFetchOptions = useCallback(
    async (filter: { query?: string; page?: number }) => {
      let { query, page } = filter;
      if (query === undefined) {
        query = _query;
      } else {
        if (query !== _query) {
          setQuery(query);
        } else {
          return;
        }
      }
      if (page === undefined) {
        page = 1;
      } else {
        if (page === metaData.currentPage) {
          return;
        }
      }
      const data = await fetchOptions(query || "", page, limit);
      if (page === 1) {
        setOptions(data?.data ?? []);
      } else {
        setOptions((prev) => [...prev, ...(data?.data ?? [])]);
      }
      setMetaData({
        currentPage: page,
        totalPage: Math.ceil((data?.total ?? 0) / 10),
        totalItems: data?.total ?? 0,
      });
      if (page === 1 && data?.total === data?.data.length) {
        setCurrentLimit(data?.total ?? 0);
      }
      setLoading(false);
      return void 0;
    },
    [_query, fetchOptions, limit, metaData.currentPage]
  );
  return (
    <QuickFilterDropdown
      {...props}
      options={options.map(renderOption)}
      totalItem={metaData.totalItems}
      page={metaData.currentPage}
      limit={currentLimit}
      onChange={(selected) => {
        const selectedVariant = selected.map((s) => {
          let variant = options.find((o) => renderOption(o).value === s);
          if (!variant && refSelectedVariant.current) {
            variant = refSelectedVariant.current.find((o) => renderOption(o.variant as T).value === s)?.variant;
          }
          return {
            value: s,
            variant,
          };
        });

        refSelectedVariant.current = selectedVariant;
        onChange(selectedVariant.filter((s) => !!s.variant).map((s) => s.variant as T));
      }}
      onChangeQuery={(query) => {
        setLoading(true);
        handleFetchOptions({ query })
          .then((_) => {})
          .catch((_) => {});
      }}
      onPageChange={(page) => {
        setLoading(true);
        handleFetchOptions({ page })
          .then((_) => {})
          .catch((_) => {});
      }}
      selected={
        _value
          ? Array.isArray(_value)
            ? _value.map(renderOption).map((s) => s.value)
            : [renderOption(_value).value]
          : []
      }
      isLoading={loading}
    />
  );
}

export default QuickFilterField;
