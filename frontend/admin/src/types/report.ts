export interface ExportReportRequest {
  query: string;
  format?: string;
  handle?: string;
  excludes?: string[];
  download?: boolean;
}

export interface ExportReportResponse {
  url?: string;
  status: number;
}

export type ExportReportSummaryRequest = {
  source_names: string[];
  location_names: string[];
  from_date: string;
  to_date: string;
  from_date_previous_term?: string;
  to_date_previous_term?: string;
};

export type ExportReportSummaryResponse = {
  data: string;
};

export type TrackingExportReportRequest = {
  query: TrackingReportQuery;
  format?: string;
  handle?: string;
  download?: boolean;
};

export interface ReportResultColumn {
  field: string;
  type: string;
  format: string;
}

export interface ReportResult {
  columns: ReportResultColumn[];
  data: any[][];
  summary: any[];
  count: number;
}

export interface ReportAggregates {
  [key: string]: {
    name: string;
  };
}

export interface ReportProperties {
  [label: string]: {
    [key: string]: string;
  };
}

export interface ReportDataResponse {
  [key: string]: string | number | boolean | null;
}

export interface QueryReportResponse {
  format: {
    [key: string]: "timestamp" | "number" | "string" | "boolean" | "price" | "percent";
  };
  data: ReportDataResponse[];
  summary: {
    [key: string]: string | number | boolean | null;
  };
  count: number;
  aggregates?: ReportAggregates;
  properties?: ReportProperties;
}

export interface MinQueryReportResult {
  columns: ReportResultColumn[];
  data: any[][];
  summary: any[];
}
export interface MinQueryReportResponse {
  format: {
    [key: string]: "timestamp" | "number" | "string" | "boolean" | "price" | "percent";
  };
  data: {
    [key: string]: string | number | boolean | null;
  }[];
  summary: {
    [key: string]: string | number | boolean | null;
  };
}

export interface ReportTrackingAggregates {
  [label: string]: {
    [key: string]: {
      name: string;
    };
  };
}

export interface TrackingQueryReportResponse extends MinQueryReportResponse {
  aggregates?: ReportTrackingAggregates;
  properties?: ReportProperties;
}

export interface QueryReportWithInfiniteRequest {
  sqlQuery: string;
  page: number;
  limit: number;
}

export interface CustomReport {
  id: number;
  title: string;
  query: string;
  created_on: Date;
  modified_on: Date;
  settings?: string;
  category?: string;
  type: number;
}

export interface CustomReportResponse {
  report: CustomReport;
}

export interface CustomReportsResponse {
  reports: CustomReport[];
}

export interface CustomReportRequest {
  title: string;
  query?: string;
  type?: number;
  settings?: string;
  category?: string;
}

export type TrackingReportQuery = {
  type: TrackingReportType;
  table?: string;
  aggregators: TrackingReportAggregator[];
  dimension?: TrackingReportDimension;
  dimensions?: TrackingReportDimension[];
  filter: TrackingReportFilter;
  intervals: TrackingReportInterval[];
  limit: number;
  time_group_by?: string;
  order_by?: string;
  descending?: boolean;
  timezone: string;
  lang: string;
  context?: TrackingReportContext;
};

export type TrackingReportType = "topN" | "timeseries" | "groupBy" | "timeBoundary" | "search" | "scan";

export type TrackingReportTable = "page-views" | "product-actions";

export type TrackingReportAggregator = {
  field: string;
};

export type TrackingReportDimension = {
  type: "default" | "simple";
  dimension: string;
};

export type TrackingReportContext = {
  query_id?: string;
  timeout?: number;
  use_cache?: boolean;
  by_segment?: boolean;
  finalize?: boolean;
  chunk_period?: string;
  min_top_n_threshold?: number;
  skip_empty_buckets?: boolean;
  sort_by_dims_first?: boolean;
  populate_cache?: boolean;
  use_result_level_cache?: boolean;
  populate_result_level_cache?: boolean;
  priority?: number;
};

export type TrackingReportFilter = {
  type: "selector" | "and" | "or" | "not" | "interval";
  dimension?: string;
  value?: string;
  filter?: TrackingReportFilter;
  filters?: TrackingReportFilter[];
};

export type TrackingReportInterval = {
  start: string;
  end: string;
};

export interface TrackingCustomReportQuery {
  name: string;
  table: TrackingReportTable;
  store_id: number;
  query: TrackingReportQuery;
}

export type ReportCartRuleRequest = {
  page: number;
  size: number;
  sort: string;
  consequent?: number;
  antecedent?: number;
};

type ProductCartRuleImage = {
  id: number;
  src: string;
  file_name: string | null;
  size: number;
  alt: string;
};

export type ProductCartRule = {
  id: number;
  name: string;
  alias: string;
  summary: string | null;
  image: ProductCartRuleImage | null;
};

export type CartRule = {
  antecedent: ProductCartRule;
  consequent: ProductCartRule;
  shared_cart: number;
  confidence: number;
  lift: number;
  store_id: number;
};
