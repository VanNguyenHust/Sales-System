import styled from "@emotion/styled";
import { Button, Select2, TextField } from "@/ui-components";
import { StarMultipleIcon } from "@/ui-icons";

import { RichTextEditor } from "app/components/RichTextEditor/RichTextEditor";

import { rewritePropertiesMap, WritingStyleOptions } from "./constant";
import { useAIContext, useRewriteSuggest } from "./context";
import { SuggestPreview } from "./SuggestPreview";

export const RewriteSuggestBody = () => {
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
  } = useRewriteSuggest();

  const { onApplySuggestionRewrite, context } = useAIContext();

  const popoverSuggestion = context ? rewritePropertiesMap[context] : undefined;

  return (
    <StyledAiSuggestBody>
      <StyledAiSuggestBodyLeft className="suggest-body-left">
        <StyledRichTextInputWrapper>
          <RichTextEditor
            label="Mô tả"
            value={request.chosen_text}
            onChange={(e) => setRequest({ ...request, chosen_text: e })}
            id="rewrite-description"
            displayToolbar={false}
            maxLength={popoverSuggestion?.maxLength}
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
        <TextField
          label={popoverSuggestion?.otherReqLabel ?? "Yêu cầu khác (khách hàng mục tiêu,...)"}
          placeholder={popoverSuggestion?.otherReqPlaceholder ?? "Ví dụ: hướng đến tệp khách hàng dưới 30 tuổi"}
          value={request.other_req}
          onChange={(e) => setRequest({ ...request, other_req: e })}
        />
        <StyledGenerateButton>
          <Button
            icon={StarMultipleIcon}
            fullWidth
            primary={!suggestions.length}
            onClick={generateData}
            disabled={charCount === 0}
          >
            {popoverSuggestion?.buttonLabel ?? "Tạo nội dung bài viết"}
          </Button>
        </StyledGenerateButton>
      </StyledAiSuggestBodyLeft>
      <SuggestPreview
        wasCalled={wasCalled}
        loading={loading}
        suggestions={suggestions}
        currentSuggestionIndex={currentSuggestionIndex}
        setCurrentSuggestionIndex={setCurrentSuggestionIndex}
        onApplySuggestion={onApplySuggestionRewrite}
        showNotEnoughPointPost={showNotEnoughPointPost}
      />
    </StyledAiSuggestBody>
  );
};

const StyledAiSuggestBodyLeft = styled.div`
  display: grid;
  gap: 16px;
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
