export interface UploadTargetRequest {
  filename: string;
  file_size: number;
  mime_type: string;
  http_method: "POST";
  resource:
    | "customers_import"
    | "customers_export"
    | "products_export"
    | "products_import"
    | "orders_export"
    | "catalogs_import"
    | "combos_import"
    | "packsizes_import";
}

export interface UploadTarget {
  url: string;
  key: string;
  parameters: {
    name: string;
    value: string;
  }[];
}

export interface UploadTargetResponse {
  upload_target: UploadTarget;
}
