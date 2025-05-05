import styled from "@emotion/styled";
import { Button, Select2, Stack, Tag, Text, TextField } from "@/ui-components";
import { StarMultipleIcon, TextAlignLeftIcon } from "@/ui-icons";

import ShortParagraph from "app/assets/icon/short-paragraph.svg?react";
import { RichTextEditor } from "app/components/RichTextEditor/RichTextEditor";
import { isEmptyString } from "app/utils/form/predicates";

import { suggestPropertiesMap, WritingStyleOptions } from "./constant";
import { useAIContext, useSuggest } from "./context";
import { SuggestPreview } from "./SuggestPreview";

const secondaryColor = "#A3A8AF";
const primaryColor = "#0088FF";

export const SuggestBody = () => {
  const { onApplySuggestion, context, extraContext } = useAIContext();
  const {
    request,
    setRequest,
    loading,
    wasCalled,
    suggestions,
    currentSuggestionIndex,
    setCurrentSuggestionIndex,
    generateData,
    showNotEnoughPointPost,
    setCharCount,
    charCount,
  } = useSuggest();

  const suggestProperties = context ? suggestPropertiesMap[context] : undefined;

  return (
    <StyledAiSuggestBody>
      <StyledAiSuggestBodyLeft className="suggest-body-left">
        <Stack vertical>
          <StyledRichTextInputWrapper>
            <RichTextEditor
              label="Mô tả"
              value={request.description}
              onChange={(e) => setRequest({ ...request, description: e })}
              id="suggest-description"
              displayToolbar={false}
              maxLength={suggestProperties?.maxLength}
              showCharacterCount
              characterCountType="character"
              onCharacterCountChange={setCharCount}
              requiredIndicator
              maxHeight={170}
            />
          </StyledRichTextInputWrapper>
          <Select2
            label="Giọng văn"
            options={WritingStyleOptions.map((item) => ({ label: item, value: item }))}
            value={request.writing_style}
            onChange={(e) => setRequest({ ...request, writing_style: e })}
          />
          {extraContext?.isShortContext ? null : (
            <StyledWritingType>
              <Text as="span">Kiểu văn bản</Text>
              <div className="writing_type_tag">
                <Tag
                  secondary={request.writing_type !== "short"}
                  onClick={() => setRequest({ ...request, writing_type: "short" })}
                >
                  <div className="writing_type_tag_item">
                    <ShortParagraph
                      width={16}
                      height={16}
                      fill={request.writing_type === "short" ? primaryColor : secondaryColor}
                    />
                    Ngắn gọn
                  </div>
                </Tag>
                <Tag
                  secondary={request.writing_type !== "detail"}
                  onClick={() => setRequest({ ...request, writing_type: "detail" })}
                >
                  <div className="writing_type_tag_item">
                    <TextAlignLeftIcon
                      width={16}
                      height={16}
                      color={request.writing_type === "detail" ? primaryColor : secondaryColor}
                    />
                    Chi tiết
                  </div>
                </Tag>
              </div>
            </StyledWritingType>
          )}
          <TextField
            label={suggestProperties?.otherReqLabel ?? "Yêu cầu khác (khách hàng mục tiêu,...)"}
            placeholder={suggestProperties?.otherReqPlaceholder ?? "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi"}
            value={request.other_req ?? ""}
            onChange={(e) => setRequest({ ...request, other_req: e })}
          />
        </Stack>
        <StyledGenerateButton>
          <Button
            icon={StarMultipleIcon}
            fullWidth
            primary={!suggestions.length}
            onClick={generateData}
            disabled={charCount === 0 || isEmptyString(request.description) || loading}
          >
            {suggestProperties?.buttonLabel ?? "Tạo nội dung bài viết"}
          </Button>
        </StyledGenerateButton>
      </StyledAiSuggestBodyLeft>
      <SuggestPreview
        wasCalled={wasCalled}
        loading={loading}
        suggestions={suggestions}
        currentSuggestionIndex={currentSuggestionIndex}
        setCurrentSuggestionIndex={setCurrentSuggestionIndex}
        onApplySuggestion={onApplySuggestion}
        showNotEnoughPointPost={showNotEnoughPointPost}
      />
    </StyledAiSuggestBody>
  );
};

const StyledAiSuggestBodyLeft = styled.div`
  display: grid;
  margin-bottom: -16px;
  ${(p) => p.theme.breakpoints.up("md")} {
    .editor-content {
      max-width: 320px;
    }
  }
  .editor-content {
    max-width: calc(100vw - 32px);
  }
`;

const StyledGenerateButton = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 10000;
  padding: 16px 0px;
  background: #fff;
`;

const StyledWritingType = styled.div`
  display: flex;
  justify-content: space-between;
  .writing_type_tag {
    display: flex;
    gap: 8px;
    span {
      cursor: pointer;
    }
    .writing_type_tag_item {
      display: flex;
      gap: 8px;
    }
  }
`;

const StyledAiSuggestBody = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  ${(p) => p.theme.breakpoints.down("md")} {
    display: flex;
    flex-direction: column;
  }
`;

const StyledRichTextInputWrapper = styled.div`
  height: 220px;
  iframe {
    border-radius: ${(p) => p.theme.shape.borderRadius("large")} ${(p) => p.theme.shape.borderRadius("large")};
  }
`;
