import { Navigate as NavigateRRD, type NavigateProps } from "react-router-dom";

import { NavigateOptions, NavigateTo } from "./types";
import { resolveTo } from "./utils";

interface Props extends Omit<NavigateProps, "to">, NavigateOptions {
  to: NavigateTo;
}
/**
 * @deprecated Using Navigate in Navigate2
 */
export const Navigate = ({ to, state, toast, ...rest }: Props) => {
  if (!state && toast) {
    state = { toast };
  }
  return <NavigateRRD to={resolveTo(to)} state={state} {...rest} />;
};
