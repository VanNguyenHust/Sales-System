import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FieldPath, FieldPathValue, FieldValues } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";

interface UseDraftFiltersOption<TFieldValues extends FieldValues> {
  defaultQuery?: string;
  defaultValues?: TFieldValues;
  emptyValues: TFieldValues;
  rules?: Partial<{
    [K in FieldPath<TFieldValues>]: undefined | ((value: NonNullable<FieldPathValue<TFieldValues, K>>) => boolean);
  }>;
  onSubmit(data: TFieldValues): void;
  onQuerySubmit?(data: string): void;
}

type SetValue = <TFieldName extends FieldPath<TFieldValues>, TFieldValues extends FieldValues>(
  prev: FieldPathValue<TFieldValues, TFieldName>
) => FieldPathValue<TFieldValues, TFieldName>;

interface UseDraftFiltersReturn<TFieldValues extends FieldValues> {
  draftFilters: TFieldValues;
  appliedFilters: {
    [K in FieldPath<TFieldValues>]: undefined | { value: NonNullable<FieldPathValue<TFieldValues, K>> };
  };
  query: string;
  setDraftFilter<TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName,
    value: FieldPathValue<TFieldValues, TFieldName> | SetValue
  ): void;
  patchDraftFilter<TFieldName extends FieldPath<TFieldValues>>(
    name: TFieldName,
    value: Partial<FieldPathValue<TFieldValues, TFieldName>>
  ): void;
  clearDraftFilter<TFieldName extends FieldPath<TFieldValues>>(name: TFieldName): void;
  resetDraftFilter<TFieldName extends FieldPath<TFieldValues>>(name: TFieldName): void;
  resetDraftFilters(): void;
  submitDraftFilters(): void;
  clearDraftFilters(): void;
  clearFilter<TFieldName extends FieldPath<TFieldValues>>(key: TFieldName): void;
  setQuery(value: string): void;
  clearQuery(): void;
  labelValueFor<TFieldName extends FieldPath<TFieldValues>>(
    key: TFieldName,
    labelFunc: (value: NonNullable<FieldPathValue<TFieldValues, TFieldName>>) => string
  ): { key: string; label: string; onRemove(): void }[];
  labelValueForOption<TFieldName extends FieldPath<TFieldValues>>(
    key: TFieldName,
    options: { label: string; value: FieldPathValue<TFieldValues, TFieldName> }[],
    defaultLabel?: string
  ): { key: string; label: string; onRemove(): void }[];
  labelValueForArray<TFieldName extends FieldPath<TFieldValues>>(
    key: TFieldName,
    labelKeyFunc?: (value: NonNullable<FieldPathValue<TFieldValues, TFieldName>>[number]) => string,
    labelValueFunc?: (value: NonNullable<FieldPathValue<TFieldValues, TFieldName>>[number]) => string
  ): { key: string; label: string; onRemove(): void }[];
}

export function useDraftFilters<TFieldValues extends FieldValues>({
  defaultQuery,
  defaultValues,
  emptyValues,
  rules,
  onSubmit,
  onQuerySubmit,
}: UseDraftFiltersOption<TFieldValues>): UseDraftFiltersReturn<TFieldValues> {
  const [query, setQuery] = useState(defaultQuery ?? "");
  const [filters, setFilters] = useState(defaultValues ?? emptyValues);
  const [draftFilters, setDraftFilters] = useState(defaultValues ?? emptyValues);

  const debouncedOnQueryChange = useDebouncedCallback(onQuerySubmit ?? noOp, 500);

  const onSubmitRef = useRef(onSubmit);
  const onQuerySubmitRef = useRef(onQuerySubmit);
  const emptyValuesRef = useRef(emptyValues);
  const rulesRef = useRef(rules);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    onQuerySubmitRef.current = onQuerySubmit;
  }, [onQuerySubmit]);

  useEffect(() => {
    rulesRef.current = rules;
  }, [rules]);

  useEffect(() => {
    if (defaultValues) {
      setFilters(defaultValues);
      setDraftFilters(defaultValues);
    }
  }, [defaultValues]);

  useEffect(() => {
    setQuery(defaultQuery ?? "");
  }, [defaultQuery]);

  const submitDraftFilters: UseDraftFiltersReturn<TFieldValues>["submitDraftFilters"] = () => {
    let data = draftFilters;
    if (rulesRef.current) {
      for (const key in rulesRef.current) {
        const rule = rulesRef.current[key as keyof typeof rulesRef.current];
        const value = data[key];
        if (value === emptyValuesRef.current[key]) {
          continue;
        }
        if (rule && !rule(value)) {
          data = { ...data, [key]: emptyValuesRef.current[key] };
        }
      }
    }
    setFilters(data);
    onSubmitRef.current?.(data);
  };
  const clearDraftFilter: UseDraftFiltersReturn<TFieldValues>["clearDraftFilter"] = (key) => {
    setDraftFilters((prev) => ({ ...prev, [key]: emptyValuesRef.current[key] }));
  };
  const clearDraftFilters: UseDraftFiltersReturn<TFieldValues>["clearDraftFilters"] = () => {
    setDraftFilters(emptyValuesRef.current);
  };
  const resetDraftFilter: UseDraftFiltersReturn<TFieldValues>["resetDraftFilter"] = (key) => {
    setDraftFilters((prev) => ({ ...prev, [key]: filters[key] }));
  };
  const resetDraftFilters: UseDraftFiltersReturn<TFieldValues>["resetDraftFilters"] = () => {
    setDraftFilters(filters);
  };
  const setDraftFilter: UseDraftFiltersReturn<TFieldValues>["setDraftFilter"] = (key, value) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: typeof value === "function" ? (value as SetValue)(prev[key]) : value,
    }));
  };
  const patchDraftFilter: UseDraftFiltersReturn<TFieldValues>["patchDraftFilter"] = (key, patch) => {
    setDraftFilters((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch },
    }));
  };
  const clearFilter: UseDraftFiltersReturn<TFieldValues>["clearFilter"] = (key) => {
    const newDraftFilters = { ...draftFilters, [key]: emptyValuesRef.current[key] };
    setDraftFilters(newDraftFilters);
    setFilters(newDraftFilters);
    onSubmitRef.current?.(newDraftFilters);
  };

  const handleQueryChange: UseDraftFiltersReturn<TFieldValues>["setQuery"] = (value) => {
    setQuery(value);
    debouncedOnQueryChange(value);
  };

  const clearQuery: UseDraftFiltersReturn<TFieldValues>["clearQuery"] = () => {
    debouncedOnQueryChange.cancel();
    setQuery("");
    onQuerySubmitRef.current?.("");
  };

  const labelValueFor: UseDraftFiltersReturn<TFieldValues>["labelValueFor"] = (key, labelFunc) => {
    if (draftFilters[key] === emptyValuesRef.current[key]) {
      return [];
    }
    const rule = rulesRef.current?.[key];
    if (rule && !rule(draftFilters[key])) {
      return [];
    }
    return [
      {
        key: "unused",
        label: labelFunc(draftFilters[key]),
        onRemove: () => setDraftFilters((prev) => ({ ...prev, [key]: emptyValuesRef.current[key] })),
      },
    ];
  };

  const labelValueForArray: UseDraftFiltersReturn<TFieldValues>["labelValueForArray"] = (
    key,
    labelKeyFunc,
    labelValueFunc
  ) => {
    if (draftFilters[key] === emptyValuesRef.current[key]) {
      return [];
    }
    const rule = rulesRef.current?.[key];
    if (rule && !rule(draftFilters[key])) {
      return [];
    }
    if (!labelKeyFunc) {
      labelKeyFunc = (value) => value.toString();
    }
    if (!labelValueFunc) {
      labelValueFunc = labelKeyFunc;
    }
    const values = draftFilters[key] as any[];
    return values.map((value) => ({
      key: labelKeyFunc(value),
      label: labelValueFunc(value),
      onRemove: () =>
        setDraftFilters((prev) => ({
          ...prev,
          [key]: values.filter((v) => labelKeyFunc(v) !== labelKeyFunc(value)),
        })),
    }));
  };

  const labelValueForOption: UseDraftFiltersReturn<TFieldValues>["labelValueForOption"] = (
    key,
    options,
    defaultLabel
  ) => {
    if (draftFilters[key] === emptyValuesRef.current[key]) {
      return [];
    }
    const rule = rulesRef.current?.[key];
    if (rule && !rule(draftFilters[key])) {
      return [];
    }
    for (const option of options) {
      if (option.value === draftFilters[key]) {
        return [
          {
            key: "unused",
            label: option.label,
            onRemove: () => setDraftFilters((prev) => ({ ...prev, [key]: emptyValuesRef.current[key] })),
          },
        ];
      }
    }
    if (defaultLabel) {
      return [
        {
          key: "unused",
          label: defaultLabel,
          onRemove: () => setDraftFilters((prev) => ({ ...prev, [key]: emptyValuesRef.current[key] })),
        },
      ];
    }
    return [];
  };

  const appliedFilters = useMemo(() => {
    const rs = {} as UseDraftFiltersReturn<TFieldValues>["appliedFilters"];
    Object.keys(filters).forEach((key) => {
      const value = filters[key] ?? emptyValuesRef.current[key];
      if (value !== emptyValuesRef.current[key]) {
        rs[key as keyof typeof rs] = { value };
      }
    });
    return rs;
  }, [filters]);

  return {
    query,
    draftFilters,
    appliedFilters,
    submitDraftFilters: useCallback(submitDraftFilters, [draftFilters]),
    clearDraftFilter: useCallback(clearDraftFilter, []),
    resetDraftFilter: useCallback(resetDraftFilter, [filters]),
    resetDraftFilters: useCallback(resetDraftFilters, [filters]),
    setDraftFilter: useCallback(setDraftFilter, []),
    patchDraftFilter: useCallback(patchDraftFilter, []),
    clearDraftFilters: useCallback(clearDraftFilters, []),
    clearFilter: useCallback(clearFilter, [draftFilters]),
    setQuery: useCallback(handleQueryChange, [debouncedOnQueryChange]),
    clearQuery: useCallback(clearQuery, [debouncedOnQueryChange]),
    labelValueFor: useCallback(labelValueFor, [draftFilters]),
    labelValueForArray: useCallback(labelValueForArray, [draftFilters]),
    labelValueForOption: useCallback(labelValueForOption, [draftFilters]),
  };
}

function noOp() {}

export function findLabel(options: { label: string; value: any }[], value: any, defaultLabel = ""): string {
  for (const option of options) {
    if (option.value === value) {
      return option.label;
    }
  }
  return defaultLabel;
}
