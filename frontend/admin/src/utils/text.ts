export type IsSearchTextMatchOptions = {
  /**
   * set case sensitive when search
   * @default false
   */
  caseSensitive?: boolean;
  /**
   * Search prefix
   * @default false
   */
  prefix?: boolean;

  /**
   * Vietnamese processing
   * @default false
   */
  vietnamese?: boolean;
};

export function isSearchTextMatch(
  text: string,
  query: string,
  options?: IsSearchTextMatchOptions
): boolean {
  const setting: IsSearchTextMatchOptions = {
    caseSensitive: false,
    prefix: false,
    ...options,
  };
  if (setting.vietnamese) {
    query = nfcNormalize(query);
    text = nfcNormalize(text);
    if (new RegExp(viToneRegexStr).test(query)) {
      // keep it
    } else if (new RegExp(viMarkRegexStr).test(query)) {
      const options: NormalizeVietnameseOptions = { transformType: "tone" };
      text = normalizeVietnamese(text, options);
      query = normalizeVietnamese(query, options);
    } else {
      const options: NormalizeVietnameseOptions = {
        transformType: "tone_mark",
      };
      text = normalizeVietnamese(text, options);
      query = normalizeVietnamese(query, options);
    }
  }
  if (!setting.caseSensitive) {
    if (setting.prefix) {
      return text.toLocaleLowerCase().startsWith(query.toLocaleLowerCase());
    }
    return text.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) >= 0;
  } else {
    if (setting.prefix) {
      return text.startsWith(query);
    }
    return text.indexOf(query) >= 0;
  }
}

export type NormalizeVietnameseOptions = {
  transformType: "tone" | "tone_mark";
};
type Dict = { [key: string]: string };
const viInitialToneDict: Dict = {
  "a|à|á|ạ|ả|ã": "a",
  "â|ầ|ấ|ậ|ẩ|ẫ": "â",
  "ă|ằ|ắ|ặ|ẳ|ẵ": "ă",
  "i|ì|í|ị|ỉ|ĩ": "i",
  "y|ỳ|ý|ỵ|ỷ|ỹ": "y",
  "o|ò|ó|ọ|ỏ|õ": "o",
  "ô|ồ|ố|ộ|ổ|ỗ": "ô",
  "ơ|ờ|ớ|ợ|ở|ỡ": "ơ",
  "e|è|é|ẹ|ẻ|ẽ": "e",
  "ê|ề|ế|ệ|ể|ễ": "ê",
  "u|ù|ú|ụ|ủ|ũ": "u",
  "ư|ừ|ứ|ự|ử|ữ": "ư",

  "A|À|Á|Ạ|Ả|Ã": "A",
  "Â|Ầ|Ấ|Ậ|Ẩ|Ẫ": "Â",
  "Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ": "Ă",
  "I|Ì|Í|Ị|Ỉ|Ĩ": "I",
  "Y|Ỳ|Ý|Ỵ|Ỷ|Ỹ": "Y",
  "O|Ò|Ó|Ọ|Ỏ|Õ": "O",
  "Ô|Ồ|Ố|Ộ|Ổ|Ỗ": "Ô",
  "Ơ|Ờ|Ớ|Ợ|Ở|Ỡ": "Ơ",
  "E|È|É|Ẹ|Ẻ|Ẽ": "E",
  "Ê|Ề|Ế|Ệ|Ể|Ễ": "Ê",
  "U|Ù|Ú|Ụ|Ủ|Ũ": "U",
  "Ư|Ừ|Ứ|Ự|Ử|Ữ": "Ư",
};

const viInitialMarkDict: Dict = {
  "a|â|ă": "a",
  "o|ô|ơ": "o",
  "e|ê": "e",
  "u|ư": "u",
  "d|đ": "d",

  "A|Â|Ă": "A",
  "O|Ô|Ơ": "O",
  "E|Ê": "E",
  "U|Ư": "U",
  "D|Đ": "D",
};
const viToneDict = Object.keys(viInitialToneDict).reduce((acc, key) => {
  const value = viInitialToneDict[key];
  key.split("|").forEach((token) => {
    if (token !== value) {
      acc[token] = value;
    }
  });
  return acc;
}, {} as Dict);
const viToneRegexStr = Object.keys(viToneDict).join("|");

const viMarkDict = Object.keys(viInitialMarkDict).reduce((acc, key) => {
  const value = viInitialMarkDict[key as keyof typeof viInitialMarkDict];
  key.split("|").forEach((token) => {
    if (token !== value) {
      acc[token] = value;
    }
  });
  return acc;
}, {} as Dict);
const viMarkRegexStr = Object.keys(viMarkDict).join("|");

export function normalizeVietnamese(
  str: string,
  options?: NormalizeVietnameseOptions
) {
  let result = nfcNormalize(str);
  if (
    options?.transformType === "tone" ||
    options?.transformType === "tone_mark"
  ) {
    result = result.replace(
      new RegExp(viToneRegexStr, "g"),
      (matched) => viToneDict[matched]
    );
  }
  if (options?.transformType === "tone_mark") {
    result = result.replace(
      new RegExp(viMarkRegexStr, "g"),
      (matched) => viMarkDict[matched]
    );
  }
  return result;
}

export const encodeCommaString = (
  text: string,
  type: "encode" | "decode" = "encode"
) => {
  if (type === "encode") {
    return text.replace(/,/g, "&comma;");
  } else {
    return text.replace(/&comma;/g, ",");
  }
};

function nfcNormalize(s: string) {
  if (typeof s.normalize === "function") {
    return s.normalize();
  }
  return s;
}

export function safeJSONParse(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.log("safeJSONParse error", error);
    return undefined;
  }
}
