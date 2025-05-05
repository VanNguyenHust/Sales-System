import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { isClientError } from "app/client";
import { AiSuggestionsContentModifyRequest } from "app/types";
import { showErrorToast } from "app/utils/toast";

import {
  useGenerateAIArticleContentModifyMutation,
  useGenerateAIPageContentModifyMutation,
  useGenerateAIProductDescriptionModifyMutation,
} from "./api";
import { WritingStyleOptions } from "./constant";
import { RewriteSuggestContext, RewriteSuggestContextType, useAIContext } from "./context";

type Props = {
  children: ReactNode;
};

export function RewriteSuggestProvider({ children }: Props) {
  const { selectionContent, content, context, extraContext } = useAIContext();
  const [generateAIArticleContentModify] = useGenerateAIArticleContentModifyMutation();
  const [generateAIPageContentModify] = useGenerateAIPageContentModifyMutation();
  const [generateAIProductDescriptionModify] = useGenerateAIProductDescriptionModifyMutation();
  const [showNotEnoughPointPost, setShowNotEnoughPointPost] = useState(false);
  const [rewriteAction, setRewriteAction] = useState<AiSuggestionsContentModifyRequest["action"]>("option");
  const [loading, setLoading] = useState(false);
  const [wasCalled, setWasCalled] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(1);
  const [request, setRequest] = useState<AiSuggestionsContentModifyRequest>({
    format: "html",
    writing_style: WritingStyleOptions[0],
    writing_type: "detail",
    description: content || "",
    chosen_text: selectionContent || "",
  });
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setRequest((prev) => ({ ...prev, chosen_text: selectionContent || "" }));
  }, [selectionContent]);

  const generateData = useCallback(
    async (action?: AiSuggestionsContentModifyRequest["action"]) => {
      if (action) setRewriteAction(action);
      setLoading(true);
      setWasCalled(true);
      if (wasCalled) {
        if (extraContext?.maxChars && charCount > extraContext.maxChars) {
          showErrorToast(`Vượt quá số ký tự tối đa (${extraContext.maxChars})`);
          setLoading(false);
          return;
        }
      }
      const _request = {
        ...request,
        action: action ?? rewriteAction,
      };
      try {
        let response = "";
        if (context === "article") {
          response = (await generateAIArticleContentModify(_request).unwrap()).data.new_chosen_text;
        }
        if (context === "page") {
          response = (await generateAIPageContentModify(_request).unwrap()).data.new_chosen_text;
        }
        if (context === "product") {
          response = (await generateAIProductDescriptionModify(_request).unwrap()).data.new_chosen_text;
        }
        setSuggestions((pre) => [...pre, response]);
        setCurrentSuggestionIndex(suggestions.length + 1);
        setShowNotEnoughPointPost(false);
      } catch (error) {
        if (isClientError(error) && error.status === 422) {
          setShowNotEnoughPointPost(true);
        } else {
          showErrorToast("Không thể lấy gợi ý từ AI");
          setShowNotEnoughPointPost(false);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      charCount,
      context,
      extraContext?.maxChars,
      generateAIArticleContentModify,
      generateAIPageContentModify,
      generateAIProductDescriptionModify,
      rewriteAction,
      request,
      suggestions.length,
      wasCalled,
    ]
  );

  const currentSuggestion = suggestions[currentSuggestionIndex - 1];
  const allowPrev = currentSuggestionIndex > 1;
  const allowNext = currentSuggestionIndex < suggestions.length;

  const memorizedContext = useMemo(
    (): RewriteSuggestContextType => ({
      rewriteAction,
      setRewriteAction,
      suggestions,
      generateData,
      loading,
      currentSuggestionIndex,
      setCurrentSuggestionIndex,
      currentSuggestion,
      allowPrev,
      allowNext,
      wasCalled,
      request,
      setRequest,
      showNotEnoughPointPost,
      charCount,
      setCharCount,
    }),
    [
      allowNext,
      allowPrev,
      charCount,
      currentSuggestion,
      currentSuggestionIndex,
      generateData,
      loading,
      rewriteAction,
      request,
      showNotEnoughPointPost,
      suggestions,
      wasCalled,
    ]
  );

  return <RewriteSuggestContext.Provider value={memorizedContext}>{children}</RewriteSuggestContext.Provider>;
}
