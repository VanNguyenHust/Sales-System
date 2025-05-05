import { useEffect, useRef, useState } from "react";
import { Toast } from "@/ui-components";

import type { JobData } from "app/utils/useJobPoller";

type JobType = Partial<JobData>;

type Props = {
  template?: JobType["template"];
  job: JobType;
};

type State = {
  status: JobType["status"];
  startMessage: string;
  doneMessage: string;
};

const MIN_DURATION_MILLIS = 1000;

export function JobToast({ job: { status, error, template: jobTemplate }, template }: Props) {
  const [state, setState] = useState<State>();

  const timeRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setState((state) => {
      if (state?.status === status || !status) {
        return state;
      }
      const message = (jobTemplate ?? template ?? "")
        .replace("%status", status)
        .replace("%error", error ?? "")
        .replace("%progress", getProgressStatus(status, error));
      if (status === "created") {
        timeRef.current = Date.now();
        clearTimeout(timeoutRef.current);
        return {
          status,
          startMessage: message,
          doneMessage: "",
        };
      } else {
        const newState: State = {
          status,
          startMessage: "",
          doneMessage: message,
        };
        const delta = Date.now() - (timeRef.current ?? 0);
        if (delta > MIN_DURATION_MILLIS) {
          return newState;
        }
        timeoutRef.current = setTimeout(() => setState(newState), MIN_DURATION_MILLIS - delta);
        return state;
      }
    });
  }, [error, jobTemplate, status, template]);

  if (!state) {
    return null;
  }

  const { startMessage, doneMessage, status: jobStatus } = state;

  return (
    <>
      {startMessage && (
        <Toast
          content={startMessage}
          duration={30000}
          success
          onDismiss={() => setState({ ...state, startMessage: "" })}
        />
      )}
      {doneMessage && (
        <Toast
          content={doneMessage}
          error={jobStatus === "failure"}
          success={jobStatus !== "failure"}
          onDismiss={() => setState({ ...state, doneMessage: "" })}
        />
      )}
    </>
  );
}

function getProgressStatus(status: JobType["status"], error?: string): string {
  if (status === "created") {
    return "đang được thực hiện";
  }
  if (status === "success") {
    return "thành công";
  }
  return `thất bại${error ? `: ${error}` : ""}`;
}
