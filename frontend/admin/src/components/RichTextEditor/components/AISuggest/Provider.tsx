import { useMemo } from "react";

import { AiSuggestionsContext } from "app/types";

import { AIContext, AIContextType } from "./context";
import { RewriteSuggestProvider } from "./RewriteSuggestProvider";
import { SuggestProvider } from "./SuggestProvider";

type Props = {
  content: string;
  context?: AiSuggestionsContext;
  extraContext?: AIContextType["extraContext"];
  children: React.ReactNode;
  selectionContent?: string;
  onApplySuggestion(value: string): void;
  onApplySuggestionRewrite(value: string): void;
};

export function Provider({
  children,
  context,
  content,
  extraContext,
  onApplySuggestion,
  onApplySuggestionRewrite,
  selectionContent,
}: Props) {
  return (
    <AIContext.Provider
      value={useMemo(
        () => ({
          onApplySuggestion,
          onApplySuggestionRewrite,
          content,
          isShowHTML: false,
          context,
          extraContext,
          selectionContent,
        }),
        [content, context, extraContext, onApplySuggestion, onApplySuggestionRewrite, selectionContent]
      )}
    >
      <RewriteSuggestProvider>
        <SuggestProvider>{children}</SuggestProvider>
      </RewriteSuggestProvider>
    </AIContext.Provider>
  );
}
