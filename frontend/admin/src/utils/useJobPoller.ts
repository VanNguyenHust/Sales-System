import { useEffect, useRef, useState } from "react";

import { adminApi } from "app/api";
import { Job, JobResponse, useDispatch } from "app/types";

type JobStatus = "created" | "success" | "failure";

/**
 * Job progress template
 *
 * template placeholder:
 * - %progress: trạng thái tiến của job. ví dụ: đang được thực hiện, thất bại, ...
 *
 * @example
 * - Tiến trình %progress
 * */
type Template = string;

export type JobData = {
  isPolling: boolean;
  error?: string;
  status?: JobStatus;
  template?: Template;
};

type AvailableTags = Parameters<typeof adminApi.util.invalidateTags>[0];
type InvalidateTags = AvailableTags | ((error: boolean) => AvailableTags | undefined);

type StartJobOptions =
  | number
  | {
      jobId: number;
      template?: Template;
      invalidateTags?: InvalidateTags;
    };
type StartJob = (options: StartJobOptions) => Promise<void>;

type UseJobPollerReturn = [StartJob, JobData];
type UseJobPollerOptions = {
  /**
   * Polling interval in miliseconds
   * @default 1000
   */
  pollingInterval?: number;
  jobEndpointResolver?(jobId: number | string): string;
  invalidateTags?: InvalidateTags;
};

export function useJobPoller(options?: UseJobPollerOptions): UseJobPollerReturn {
  const dispatch = useDispatch();
  const pollingInterval = options?.pollingInterval ?? 1000;
  const jobEndpointResolver = options?.jobEndpointResolver ?? defaultResolveEndpoint;
  const globalInvalidateTags = options?.invalidateTags;
  const [isPolling, setPolling] = useState(false);
  const [error, setError] = useState<string>();
  const [status, setStatus] = useState<JobStatus>();
  const [template, setTemplate] = useState<string>();
  const timeRef = useRef<any>();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchJob = async (id: number): Promise<Job> => {
    try {
      const res = await fetch(jobEndpointResolver(id));
      if (res.status !== 200) {
        return {
          done: true,
          id,
          failure_reason: await res.text(),
        };
      }
      const data: JobResponse = await res.json();
      return data.job;
    } catch (e) {
      return {
        done: true,
        id,
        failure_reason: String(e),
      };
    }
  };

  const startJob: StartJob = (options) => {
    const jobId = typeof options === "number" ? options : options.jobId;
    const jobTemplate = typeof options === "object" ? options.template : undefined;
    const jobInvalidateTags = typeof options === "object" ? options.invalidateTags : undefined;
    const handleStatus = (status: JobStatus, error?: string) => {
      setStatus(status);
      setTemplate(jobTemplate);
      if (status === "created") {
        setPolling(true);
        setError(undefined);
        clearTimeout(timeRef.current);
      } else {
        setPolling(false);
        setError(error);
      }
    };
    return new Promise((resolve, reject) => {
      handleStatus("created");
      const poll = async () => {
        const res = await fetchJob(jobId);
        if (!isMounted.current) {
          return;
        }
        if (res.done) {
          if (res.failure_reason) {
            handleStatus("failure", res.failure_reason);
            reject(res.failure_reason);
          } else {
            handleStatus("success");
            resolve();
          }
          let tagsToInvalidate: AvailableTags | undefined;
          const invalidateTags = jobInvalidateTags ?? globalInvalidateTags;
          if (typeof invalidateTags === "function") {
            tagsToInvalidate = invalidateTags(!!res.failure_reason);
          } else {
            tagsToInvalidate = invalidateTags;
          }
          if (tagsToInvalidate && tagsToInvalidate.length) {
            dispatch(adminApi.util.invalidateTags(tagsToInvalidate));
          }
        } else {
          timeRef.current = setTimeout(poll, pollingInterval);
        }
      };
      poll();
    });
  };
  return [startJob, { isPolling, error, status, template }];
}

function defaultResolveEndpoint(jobId: number) {
  return `/admin/jobs/${jobId}.json`;
}
