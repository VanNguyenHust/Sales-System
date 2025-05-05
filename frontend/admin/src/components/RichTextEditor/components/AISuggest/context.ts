import { createContext, SetStateAction, useContext } from "react";

import { AiSuggestionsContentModifyRequest, AiSuggestionsContentRequest, AiSuggestionsContext } from "app/types";

export type AIContextType = {
  /** Áp dụng gợi ý */
  onApplySuggestion: (suggestion: string) => void;
  /** Áp dụng gợi ý viết lại */
  onApplySuggestionRewrite: (suggestion: string) => void;
  /** Nội dung được chọn */
  selectionContent?: string;
  /** Nội dung của editor */
  content?: string;
  /** Context của gợi ý */
  context?: AiSuggestionsContext;
  /** Thông tin bổ sung */
  extraContext?: {
    /** Có phải là Mô tả ngắn không */
    isShortContext?: boolean;
    /** Nội dung cần mô tả */
    shortContext?: string;
    /** Số ký tự tối đa */
    maxChars?: number;
  };
};

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAIContext = () => {
  const context = useContext(AIContext);

  if (!context) {
    throw new Error("Missing context RichTextEditorAIContext");
  }
  return context;
};

export type SuggestContextType = {
  loading: boolean;
  wasCalled: boolean;
  request: AiSuggestionsContentRequest;
  suggestions: string[];
  currentSuggestionIndex: number;
  setCurrentSuggestionIndex(value: SetStateAction<number>): void;
  allowPrev: boolean;
  allowNext: boolean;
  charCount: number;
  setCharCount(value: number): void;
  showNotEnoughPointPost: boolean;
  setRequest(request: AiSuggestionsContentRequest): void;
  currentSuggestion: string;
  generateData(): Promise<void>;
};

export const SuggestContext = createContext<SuggestContextType | undefined>(undefined);

export const useSuggest = () => {
  const context = useContext(SuggestContext);
  if (!context) {
    throw new Error("Missing context SuggestContext");
  }
  return context;
};

export type RewriteSuggestContextType = {
  loading: boolean;
  wasCalled: boolean;
  rewriteAction: AiSuggestionsContentModifyRequest["action"];
  setRewriteAction(value: AiSuggestionsContentModifyRequest["action"]): void;
  suggestions: string[];
  generateData(action?: AiSuggestionsContentModifyRequest["action"]): Promise<void>;
  currentSuggestionIndex: number;
  setCurrentSuggestionIndex(value: SetStateAction<number>): void;
  currentSuggestion: string;
  allowPrev: boolean;
  allowNext: boolean;
  charCount: number;
  setCharCount(value: number): void;
  request: AiSuggestionsContentModifyRequest;
  setRequest(value: AiSuggestionsContentModifyRequest): void;
  showNotEnoughPointPost: boolean;
};

export const RewriteSuggestContext = createContext<RewriteSuggestContextType | undefined>(undefined);

export const useRewriteSuggest = () => {
  const context = useContext(RewriteSuggestContext);

  if (!context) {
    throw new Error("Missing context RewriteSuggestContext");
  }
  return context;
};
