import { useCallback, useEffect, useRef, useState } from "react";
import { isArray } from "lodash-es";

import { DataFilterSource } from "../QuickFilterDropdown/QuickFilterField";

import SelectionDropDown, { OptionType, SelectionDropDownProps } from "./SelectionDropDown";

export interface SelectionDropDownFieldProps<T> extends Omit<SelectionDropDownProps, "onChange" | "options"> {
  fetchOptions: (query: string, page: number, limit: number) => Promise<DataFilterSource<T> | undefined>;
  value?: T | T[];
  renderOption: (option: T) => OptionType;
  onChange: (value: T | T[]) => void;
  limit?: number;
  id?: string;
}

export default function SelectionDropDownField<T>({
  renderOption,
  fetchOptions,
  value,
  limit = 10,
  onChange,
  id,
  ...props
}: SelectionDropDownFieldProps<T>) {
  const [options, setOptions] = useState<T[]>([]);
  const [metaData, setMetaData] = useState({
    currentPage: 0,
    totalPage: 0,
    totalItems: 0,
  });
  const [_value, setValue] = useState<T | T[] | undefined>(value);
  const [_query, setQuery] = useState<string>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      setMetaData({
        currentPage: 0,
        totalPage: 0,
        totalItems: 0,
      });
      setOptions([]);
      setValue(undefined);
      setQuery(undefined);
      setLoading(false);
    };
  }, []);
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
          if (page === metaData.currentPage) {
            return;
          }
        }
      }
      if (page === undefined) {
        page = 1;
      } else {
        if (page === metaData.currentPage) {
          return;
        }
      }
      setLoading(true);
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
      setLoading(false);
      return void 0;
    },
    [_query, fetchOptions, limit, metaData.currentPage]
  );
  return (
    <SelectionDropDown
      {...props}
      id={id}
      options={options.map(renderOption)}
      isLoading={loading}
      page={metaData.currentPage}
      total={metaData.totalItems}
      limit={limit}
      closed={() => {
        setMetaData({
          currentPage: 0,
          totalPage: 0,
          totalItems: 0,
        });
        setOptions([]);
        setValue(value);
        setQuery(undefined);
        setLoading(false);
      }}
      onQueryChange={(query) => {
        handleFetchOptions({
          query: query.query,
          page: query.page,
        })
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
      onChange={(selected) => {
        if (Array.isArray(selected)) {
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
        } else {
          const variant = options.find((o) => renderOption(o).value === selected);
          const selectedVariant = variant
            ? {
                value: renderOption(variant).value,
                variant,
              }
            : undefined;
          if (variant) {
            refSelectedVariant.current = selectedVariant ? [selectedVariant] : [];
            onChange(variant);
          }
        }
      }}
    />
  );
}
