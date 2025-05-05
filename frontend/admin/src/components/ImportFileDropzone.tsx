import { useEffect, useId, useState } from "react";
import styled from "@emotion/styled";
import { Button, DropZone, Icon, Labelled, Link, Stack, Text, useTheme } from "@/ui-components";
import { CloseSmallIcon, CloudUpIcon, FileLinesIcon } from "@/ui-icons";
import { upperFirst } from "lodash-es";

import { formatFileSize } from "app/utils/file";

type Props = {
  /** @default "xls/xlsx" */
  fileType?: "xls" | "xls/xlsx";
  maxFileSizeInMB?: number;
  value?: File;
  onChange(file?: File): void;
  error?: string;
};

export function ImportFileDropzone({ fileType = "xls/xlsx", maxFileSizeInMB, error, value: file, onChange }: Props) {
  const theme = useTheme();
  const [innerError, setInnerError] = useState("");
  const id = useId();
  const hasFile = !!file;
  const description = [
    maxFileSizeInMB ? `Tối đa ${maxFileSizeInMB}MB` : undefined,
    fileType === "xls/xlsx" ? "định dạng .xlsx hoặc .xls" : fileType === "xls" ? "định dạng .xls" : undefined,
  ]
    .filter(Boolean)
    .join(", ");

  useEffect(() => setInnerError(""), [file]);

  return (
    <Stack vertical>
      <Labelled id={id} error={innerError}>
        <DropZone
          id={id}
          onDropAccepted={(files) => {
            const file = files[0];
            if (maxFileSizeInMB && file.size > maxFileSizeInMB * 1024 * 1024) {
              setInnerError(`Kích thước file không được vượt quá ${maxFileSizeInMB}MB`);
            } else {
              onChange(file);
            }
          }}
          allowMultiple={false}
          disabled={hasFile}
          type="file"
          accept={
            fileType === "xls"
              ? "application/vnd.ms-excel"
              : fileType === "xls/xlsx"
              ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              : undefined
          }
          onDropRejected={() => setInnerError("File không đúng định dạng")}
        >
          <StyledUpload>
            <Icon source={CloudUpIcon} color={hasFile ? "base" : "interactive"} />
            <Text as="span" variant="bodyMd">
              Kéo thả file vào đây hoặc{" "}
              {hasFile ? <>tải lên từ thiết bị</> : <Link removeUnderline>tải lên từ thiết bị</Link>}
            </Text>
            {description ? (
              <Text as="span" variant="bodyMd" color="subdued">
                ({upperFirst(description)})
              </Text>
            ) : undefined}
          </StyledUpload>
        </DropZone>
        {error ? (
          <StyledTextError>
            <Text as="p" color="critical">
              {error}
            </Text>
          </StyledTextError>
        ) : null}
      </Labelled>
      {file ? (
        <StyledDisplayFile>
          <Stack wrap={false} spacing="baseTight">
            <FileLinesIcon color={theme.colors.icon} width={36} height={36} />
            <Stack.Item fill>
              <Text as="span" variant="bodyMd" alignment="start">
                {file.name}
              </Text>
              <Text as="span" variant="bodySm" alignment="start">
                {formatFileSize(file.size)}
              </Text>
            </Stack.Item>
            <Button plain icon={CloseSmallIcon} size="medium" onClick={() => onChange(undefined)} />
          </Stack>
        </StyledDisplayFile>
      ) : null}
    </Stack>
  );
}

const StyledDisplayFile = styled.div`
  display: flex;
  padding: ${(p) => p.theme.spacing(3)};
  background-color: ${(p) => p.theme.colors.surfaceNeutral};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  > * {
    flex: 1;
  }
  svg {
    vertical-align: top;
  }
`;

const StyledUpload = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.spacing(5, 0)};
  display: grid;
  grid-gap: ${(p) => p.theme.spacing(1)};
  span:first-of-type {
    width: 36px;
    height: 36px;
  }
`;

const StyledTextError = styled.div`
  margin-top: ${(p) => p.theme.spacing(1)};
`;
