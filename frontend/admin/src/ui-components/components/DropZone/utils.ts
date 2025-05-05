import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash-es";

import { useComponentDidMount } from "../../utils/useComponentDidMount";

import { DropZoneEvent, DropZoneSize } from "./types";

const dragEvents = ["dragover", "dragenter", "drop"];

export function getDataTransferFiles(e: DropZoneEvent) {
  let files: File[] | DataTransferItem[] = [];
  if (isDragEvent(e)) {
    if (e.dataTransfer) {
      if (e.dataTransfer.files.length) {
        files = Array.from(e.dataTransfer.files);
      } else if (e.dataTransfer.items.length) {
        // Chrome is the only browser that allows to read the file list on drag
        // events and uses `items` instead of `files` in this case.
        files = Array.from(e.dataTransfer.items);
      }
    }
  } else if (e.target.files) {
    files = Array.from(e.target.files);
  }
  return files;
}

export function fileAccepted(file: File, acceptedFiles: string | undefined) {
  if (file.type === "application/x-moz-file") {
    return true;
  }
  if (acceptedFiles) {
    const fileName = file.name || "";
    const mimeType = file.type || "";
    const baseMimeType = mimeType.replace(/\/.*$/, "");
    const acceptedFilesArray = Array.isArray(acceptedFiles) ? acceptedFiles : acceptedFiles.split(",");

    return acceptedFilesArray.some((type) => {
      const validType = type.trim();
      if (validType.startsWith(".")) {
        return fileName.toLowerCase().endsWith(validType.toLowerCase());
      } else if (validType.endsWith("/*")) {
        // This is something like a image/* mime type
        return baseMimeType === validType.replace(/\/.*$/, "");
      }
      return mimeType === validType;
    });
  }
  return true;
}

function isDragEvent(event: DropZoneEvent): event is DragEvent {
  return dragEvents.indexOf(event.type) > 0;
}

export function useDropZoneSize(variableHeight?: boolean): {
  size: DropZoneSize;
  measuring: boolean;
  nodeRef: React.RefObject<HTMLDivElement | null>;
} {
  const [size, setSize] = useState<DropZoneSize>("large");
  const [measuring, setMeasuring] = useState(true);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adjustSize = useCallback(
    debounce(
      () => {
        if (!nodeRef.current) {
          return;
        }
        if (variableHeight) {
          setMeasuring(false);
          return;
        }

        let size: DropZoneSize = "large";
        const width = nodeRef.current.getBoundingClientRect().width;

        if (width < 100) {
          size = "small";
        } else if (width < 350) {
          size = "medium";
        }

        setSize(size);
        setMeasuring(false);
      },
      50,
      { trailing: true }
    ),
    []
  );

  useComponentDidMount(adjustSize);

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }

    const observer = new ResizeObserver(adjustSize);
    observer.observe(nodeRef.current);

    return () => {
      observer.disconnect();
    };
  }, [adjustSize]);

  return { size, measuring, nodeRef };
}
