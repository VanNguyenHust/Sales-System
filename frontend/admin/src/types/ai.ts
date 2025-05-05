export type AiSuggestionsContext = "product" | "article" | "page" | "blog";

export type AiSuggestionsContentRequest = {
  format: "html" | "text";
  other_req?: string;
  writing_style: string;
  writing_type: "short" | "detail";
  description: string;
};

export type AiSuggestionsContentResponse = {
  data: {
    content: string;
    short_content: string;
  };
};

export type AiSuggestionsContentModifyRequest = {
  format: "html" | "text";
  other_req?: string;
  writing_style: string;
  writing_type: "short" | "detail";
  description: string;
  chosen_text: string;
  action?: "option" | "rephrase" | "simplify" | "extend";
};

export type AiSuggestionsContentModifyResponse = {
  data: {
    new_chosen_text: string;
  };
};

export type AiSuggestionsNameRequest = {
  name_content: string;
  other_req?: string;
};
export type AiSuggestionsNameResponse = {
  data: {
    names: string;
  };
};

export type AiSuggestionsDescriptionRequest = {
  description_content: string;
  format?: "html" | "text";
  other_req?: string;
  write_style?: string;
  write_type?: "short" | "detail";
};
export type AiSuggestionsDescriptionResponse = {
  data: {
    description: string;
    short_description: string;
  };
};

export type AiSuggestionsDescriptionModifyRequest = {
  format: "html" | "text";
  description: string;
  chosen_text: string;
  writing_style: string;
  writing_type: "short" | "detail";
  other_req?: string;
  action?: "option" | "rephrase" | "simplify" | "extend";
};
export type AiSuggestionsDescriptionModifyResponse = {
  data: {
    new_chosen_text: string;
  };
};
