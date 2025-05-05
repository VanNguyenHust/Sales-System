import { JSX } from "react";
import { useParams } from "react-router-dom";

import { NotFoundPage } from "src/components/ErrorBoundary";
import { ValidateParamOptions } from "src/types/routes";

interface Props {
  children: React.ReactNode;
  validateParams: ValidateParamOptions;
}

export const ValidateParam = ({ children, validateParams }: Props): JSX.Element => {
  const params = useParams();

  const isValid = Object.keys(validateParams).every((param) => {
    const value = params[param];
    const rule = validateParams[param];
    if (rule === "id") {
      if (value && /^\d+$/.test(value)) {
        return true;
      }
      return false;
    } else {
      throw new Error(`Unsupported validate rule: ${rule}`);
    }
  });
  if (!isValid) {
    return <NotFoundPage />;
  }

  return <>{children}</>;
};
