import { AiSuggestionsContext } from "app/types";

import { AIContextType } from "./context";

export type AIProps = {
  aiSuggestContext?: AiSuggestionsContext;
  aiSuggestExtraContext?: AIContextType["extraContext"];
};
