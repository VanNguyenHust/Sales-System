import { useMemo } from "react";
import { Card, Select2, SkeletonBodyText } from "@/ui-components";

import { useGetAssetsQuery, useGetThemesQuery } from "app/features/theme/api";

type Props = {
  type: "page" | "article" | "blog" | "collection" | "product";
  value?: string;
  disabled?: boolean;
  onChange(value: string): void;
};

export function TemplateLayoutCard({ type, value, disabled, onChange }: Props) {
  const { data: themes, isLoading: isLoadingThemes } = useGetThemesQuery(undefined, {
    skip: disabled,
  });
  const activeThemeId = useMemo(() => (themes || []).find((theme) => theme.role === "main")?.id, [themes]);
  const { data: templateAssets, isLoading: isLoadingAssets } = useGetAssetsQuery(
    {
      theme_id: activeThemeId ?? 0,
      bucket: "templates",
    },
    {
      skip: !activeThemeId || disabled,
    }
  );

  const options = useMemo(
    () =>
      (templateAssets ?? [])
        .filter((asset) => asset.key.startsWith(`templates/${type}`))
        .sort((a1, a2) => a1.key.localeCompare(a2.key))
        .map((asset) => {
          const templateLayout = asset.key.replace(/templates\/(.*)\.bwt/, "$1");
          return {
            label: templateLayout,
            value: templateLayout,
          };
        }),
    [templateAssets, type]
  );

  if (isLoadingAssets || isLoadingThemes) {
    return (
      <Card sectioned>
        <SkeletonBodyText />
      </Card>
    );
  }

  return (
    <Card title="Khung giao diện" sectioned>
      <Select2
        value={value ? value : type}
        placeholder="Chọn khung giao diện"
        options={options}
        onChange={onChange}
        disabled={disabled}
      />
    </Card>
  );
}
