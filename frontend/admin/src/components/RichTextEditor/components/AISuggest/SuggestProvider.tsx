import { useCallback, useEffect, useMemo, useState } from "react";

import { isClientError } from "app/client";
import { AiSuggestionsContentRequest } from "app/types";
import { isEmptyString } from "app/utils/form/predicates";
import { showErrorToast } from "app/utils/toast";

import {
  useGenerateAIArticleContentMutation,
  useGenerateAIArticleShortContentMutation,
  useGenerateAIPageContentMutation,
  useGenerateAIProductDescriptionMutation,
  useGenerateAIProductShortDescriptionMutation,
} from "./api";
import { WritingStyleOptions } from "./constant";
import { SuggestContext, SuggestContextType, useAIContext } from "./context";

type Props = {
  children: React.ReactNode;
};

export function SuggestProvider({ children }: Props) {
  const { context, extraContext } = useAIContext();
  const [generateAIArticleContent] = useGenerateAIArticleContentMutation();
  const [generateAIPageContent] = useGenerateAIPageContentMutation();
  const [generateAIProductDescription] = useGenerateAIProductDescriptionMutation();
  const [generateAIArticleShortContent] = useGenerateAIArticleShortContentMutation();
  const [generateAIProductShortDescription] = useGenerateAIProductShortDescriptionMutation();
  const [showNotEnoughPointPost, setShowNotEnoughPointPost] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [wasCalled, setWasCalled] = useState(false);
  const [request, setRequest] = useState<AiSuggestionsContentRequest>({
    format: "html",
    writing_style: WritingStyleOptions[0],
    writing_type: "detail",
    description: "",
  });

  useEffect(() => {
    if (extraContext?.shortContext) {
      setRequest((prev) => ({ ...prev, description: extraContext.shortContext || "" }));
    }
  }, [extraContext]);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(1);

  const generateData = useCallback(async () => {
    if (extraContext?.maxChars && charCount > extraContext.maxChars) {
      showErrorToast(`Vượt quá số ký tự tối đa (${extraContext.maxChars})`);
      return;
    }
    setLoading(true);
    setWasCalled(true);
    try {
      let response = "";
      if (context === "article") {
        if (extraContext?.isShortContext)
          response = (await generateAIArticleShortContent(request).unwrap()).data?.short_content;
        else response = (await generateAIArticleContent(request).unwrap()).data?.content;
      }
      if (context === "page") {
        response = (await generateAIPageContent(request).unwrap()).data?.content;
      }
      if (context === "product") {
        if (extraContext?.isShortContext)
          response = (await generateAIProductShortDescription(request).unwrap()).data?.short_description;
        else response = (await generateAIProductDescription(request).unwrap()).data?.description;
      }
      if (isEmptyString(response)) return;
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
  }, [
    charCount,
    context,
    extraContext?.isShortContext,
    extraContext?.maxChars,
    generateAIArticleContent,
    generateAIArticleShortContent,
    generateAIPageContent,
    generateAIProductDescription,
    generateAIProductShortDescription,
    request,
    suggestions.length,
  ]);

  const currentSuggestion = suggestions[currentSuggestionIndex - 1];
  const allowPrev = currentSuggestionIndex > 1;
  const allowNext = currentSuggestionIndex < suggestions.length;

  const memorizedContext = useMemo(
    (): SuggestContextType => ({
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
      request,
      showNotEnoughPointPost,
      suggestions,
      wasCalled,
    ]
  );

  return <SuggestContext.Provider value={memorizedContext}>{children}</SuggestContext.Provider>;
}
