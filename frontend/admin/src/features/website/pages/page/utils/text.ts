import { htmlToNormalText, toNormalText } from "app/utils/toNormalText";

export const SEO_TITLE_MAX_LENGTH = 70;
export const SEO_DESCRIPTION_MAX_LENGTH = 320;
export const ALIAS_MAX_LENGTH = 150;

export const toAlias = (text: string) => toNormalText(text, "-").slice(0, ALIAS_MAX_LENGTH);
export const toSeoTitle = (text: string) => text.slice(0, SEO_TITLE_MAX_LENGTH);
export const toSeoDescription = (text: string) => htmlToNormalText(text).slice(0, SEO_DESCRIPTION_MAX_LENGTH);

export const stripHtmlNewlines = (content: string) => {
  if (content) {
    let result = content.replace(/(<([^>]+)>)/gi, "");
    result = result.replace(/(\r\n|\n|\r)/gm, "");
    return result;
  }
  return content;
};
