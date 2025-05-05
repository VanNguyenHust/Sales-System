import { OptionDescriptor, SectionDescriptor } from "../types";

import { arraysAreEqual } from "./arrays";

type Descriptor = SectionDescriptor | OptionDescriptor;

export function isSection(arr: Descriptor[]): arr is SectionDescriptor[] {
  return typeof arr[0] === "object" && Object.prototype.hasOwnProperty.call(arr[0], "options");
}

export function createNormalizedOptions(
  options: OptionDescriptor[] = [],
  sections: SectionDescriptor[] = [],
  title?: string
): SectionDescriptor[] {
  const section = { title, options };
  return [section, ...sections].filter((item) => item.options.length > 0);
}

export function optionArraysAreEqual(firstArray: Descriptor[], secondArray: Descriptor[]) {
  if (isSection(firstArray) && isSection(secondArray)) {
    return arraysAreEqual<SectionDescriptor>(firstArray, secondArray, testSectionsPropEquality);
  }
  return arraysAreEqual(firstArray, secondArray);
}

function testSectionsPropEquality(previousSection: SectionDescriptor, currentSection: SectionDescriptor) {
  return (
    previousSection.title === currentSection.title && arraysAreEqual(previousSection.options, currentSection.options)
  );
}
