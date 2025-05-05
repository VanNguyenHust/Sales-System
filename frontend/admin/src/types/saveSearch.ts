export interface SaveSearch {
  id?: number | string;
  type?: string;
  name?: string;
  created_on?: Date;
  modified_on?: Date;
  query?: string;
  is_default?: boolean;
}

export interface SaveSearchRequest {
  id?: number | string;
  name: string;
  query: string;
  type: string;
}
