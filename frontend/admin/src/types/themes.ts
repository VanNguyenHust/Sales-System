export type ThemeResponse = {
  id: number;
  name: string;
  role: "main" | "unpublished" | string;
  previewable: boolean;
  processing: boolean;
  created_on: string;
  modified_on?: string;
};

export type AssetResponse = {
  theme_id: number;
  key: string;
  content_type: string;
  size: number;
  created_on: string;
  modified_on?: string | null;
  public_url?: string | null;
  width?: number | null;
  height?: number | null;
};

export type AssetFilterRequest = {
  bucket?: string;
};
