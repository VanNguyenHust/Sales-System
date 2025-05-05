import { ChoiceControl } from "./ChoiceControl";
import { ChoiceListControl } from "./ChoiceListControl";
import { Control as Field } from "./Control";
import { TextControl } from "./TextControl";

export const Control = {
  Field,
  Text: TextControl,
  Choice: ChoiceControl,
  ChoiceList: ChoiceListControl,
};

export * from "./types";
export { submitErrors, submitSuccess, useCustomForm } from "./useCustomForm";
export { CustomFormProvider, useCustomFormContext } from "./useCustomFormContext";
export * from "./validators";
