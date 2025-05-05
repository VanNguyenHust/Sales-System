import { useCallback } from "react";
import styled from "@emotion/styled";
import { Button, DropZone, Icon, Link, Stack, Text } from "@/ui-components";
import { CloseSmallIcon, CloudUpIcon, FileLinesIcon } from "@/ui-icons";

import { showErrorToast } from "app/utils/toast";

interface Props {
  value: File[];
  onChange: (files: File[]) => void;
}

export const FileDropZone = ({ value, onChange }: Props) => {
  const handleDrop = useCallback(
    (_droppedFiles: File[], acceptedFiles: File[]) => {
      const newFile = [...value].concat(acceptedFiles);
      const size = newFile.map((file) => file.size).reduce((a, b) => a + b, 0);
      if (newFile.length > 3) {
        showErrorToast(`Số lượng file quá giới hạn cho phép, bạn chỉ được đính kèm tối đa là 3 file.`);
      } else if (size > 1024000 * 15) {
        showErrorToast(`File đính kèm kích thước phải <= 15MB`);
      } else {
        onChange(newFile);
      }
    },
    [value, onChange]
  );

  const imageUpload = (
    <StyledImageUpload>
      <Icon source={CloudUpIcon} color="interactive" />
      <Text as="p" variant="bodyMd">
        Kéo thả file vào đây hoặc <Link removeUnderline>tải ảnh lên từ thiết bị</Link>
      </Text>
    </StyledImageUpload>
  );

  return (
    <StyledFile>
      <DropZone onDrop={handleDrop}>{imageUpload}</DropZone>
      <FileDisplay files={value} onChange={onChange} />
    </StyledFile>
  );
};

const StyledFile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.theme.spacing(4)};
`;
const StyledImageUpload = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.spacing(5, 0)};
  display: grid;
  grid-gap: ${(p) => p.theme.spacing(2)};
`;

interface FileDisplayProps {
  files?: File[];
  onChange: (files: File[]) => void;
}

const FileDisplay = ({ files, onChange }: FileDisplayProps) => {
  return (
    <Stack spacing="loose" vertical>
      {files &&
        files.map((file: File, index: number) => {
          const key = `FeedBackFile-${index}`;
          return (
            <StyledFileDisplay key={key}>
              <StyledIcon>
                <Icon source={FileLinesIcon} color="interactive" />
              </StyledIcon>
              <div style={{ flex: 1 }}>
                <Text as="p" variant="bodySm">
                  {file.name}
                </Text>
                <Text as="p" variant="bodySm">
                  {file.size / 1024000 < 1
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : `${(file.size / 10240000).toFixed(1)} MB`}
                </Text>
              </div>
              <StyledIcon>
                <Button
                  icon={CloseSmallIcon}
                  plain
                  onClick={() => {
                    const newFiles = [...files];
                    newFiles.splice(index, 1);
                    onChange(newFiles);
                  }}
                />
              </StyledIcon>
            </StyledFileDisplay>
          );
        })}
    </Stack>
  );
};

const StyledFileDisplay = styled.div`
  width: 100%;
  align-items: center;
  display: flex;
  padding: ${(p) => p.theme.spacing(2, 5)};
  gap: ${(p) => p.theme.spacing(4)};
  background-color: ${(p) => p.theme.colors.surfaceNeutral};
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
`;

const StyledIcon = styled.div`
  span {
    width: ${(p) => p.theme.spacing(6)};
    height: ${(p) => p.theme.spacing(6)};
  }
`;
