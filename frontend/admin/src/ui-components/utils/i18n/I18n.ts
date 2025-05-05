import { get, merge } from "lodash-es";

const REPLACE_REGEX = /{([^}]*)}/g;

interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export class I18n {
  private translation: TranslationDictionary = {};

  /**
   * @param translation A locale object or array of locale objects that overrides default translations.
   * If specifying an array then your desired language dictionary should come first, followed by your fallback language dictionaries
   */
  constructor(translation: TranslationDictionary | TranslationDictionary[]) {
    // slice the array to make a shallow copy of it, so we don't accidentally
    // modify the original translation array
    if (Array.isArray(translation)) {
      this.translation = {};
      const transList = translation.slice().reverse();
      for (const trans of transList) {
        this.translation = merge(this.translation, trans);
      }
    } else {
      this.translation = translation;
    }
  }

  translate(id: string, replacements?: { [key: string]: string | number }): string {
    const text = get(this.translation, id, "");

    if (!text) {
      return "";
    }
    if (typeof text !== "string") {
      const translatedData = JSON.stringify(text);
      throw new Error(`Error in translation for key '${id}'. Expect translate string, got: '${translatedData}'`);
    }

    if (replacements) {
      return text.replace(REPLACE_REGEX, (match: string) => {
        const replacement: string = match.substring(1, match.length - 1)!;

        if (replacements[replacement] === undefined) {
          const replacementData = JSON.stringify(replacements);

          throw new Error(
            `Error in translation for key '${id}'. No replacement found for key '${replacement}'. The following replacements were passed: '${replacementData}'`
          );
        }

        // This could be a string or a number, but JS doesn't mind which it gets
        // and can handle that cast internally. So let it, to save us calling
        // toString() on what's already a string in 90% of cases.
        return replacements[replacement] as string;
      });
    }

    return text;
  }

  translationKeyExists(path: string): boolean {
    return Boolean(get(this.translation, path));
  }
}
