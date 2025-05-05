import { HideableStrictOption, SelectGroup, SelectOption, StrictGroup, StrictOption } from "./types";

export function normalizeOptions(
  options: string[] | StrictOption[] | SelectGroup[]
): HideableStrictOption[] | StrictGroup[] {
  if (isGroups(options)) {
    return options.map((option) => ({
      title: option.title,
      options: option.options.map((option) => {
        return isString(option) ? normalizeStringOption(option) : option;
      }),
    }));
  }
  if (isStrings(options)) {
    return options.map(normalizeStringOption);
  }
  return options;
}

export function normalizeOption(option: SelectOption | SelectGroup): HideableStrictOption | StrictGroup {
  if (isString(option)) {
    return normalizeStringOption(option);
  } else if (isGroup(option)) {
    const { title, options } = option;
    return {
      title,
      options: options.map((option) => {
        return isString(option) ? normalizeStringOption(option) : option;
      }),
    };
  }
  return option;
}

function normalizeStringOption(option: string): StrictOption {
  return {
    label: option,
    value: option,
  };
}

export function flattenOptions(options: (HideableStrictOption | StrictGroup)[]): HideableStrictOption[] {
  let flatOptions: HideableStrictOption[] = [];

  options.forEach((optionOrGroup) => {
    if (isGroup(optionOrGroup)) {
      flatOptions = flatOptions.concat(optionOrGroup.options);
    } else {
      flatOptions.push(optionOrGroup);
    }
  });

  return flatOptions;
}

export function getSelectedOption(
  options: HideableStrictOption[] | StrictGroup[],
  value: string
): StrictOption | undefined {
  for (const option of options) {
    if (isGroup(option)) {
      for (const sectionOption of option.options) {
        if (sectionOption.value === value) {
          return sectionOption;
        }
      }
    } else if (option.value === value) {
      return option;
    }
  }
}

function isString(option: SelectOption | SelectGroup): option is string {
  return typeof option === "string";
}

function isStrings(options: SelectOption[] | SelectGroup[]): options is string[] {
  if (options.length && typeof options[0] === "string") {
    return true;
  }
  return false;
}

export function isGroup(option: SelectOption | SelectGroup): option is SelectGroup {
  return typeof option === "object" && "options" in option && option.options !== null;
}

function isGroups(options: SelectOption[] | SelectGroup[]): options is SelectGroup[] {
  if (options.length && isGroup(options[0])) {
    return true;
  }
  return false;
}
