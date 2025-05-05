export interface CountResponse {
  count: number;
}

export interface ApiFieldError {
  code: string;
  message: string;
  fields: string[];
}

export type ApiError = { error: string } | { errors: ApiFieldError[] } | { errors: { [key: string]: string[] } };

export interface PhoneRegion {
  id: string;
  text: string;
}

export interface PhoneRegionsResponse {
  regions: PhoneRegion[];
}

export type Job = {
  id: number;
  done: boolean;
  failure_reason?: string | null;
};

export type JobResponse = {
  job: Job;
};
