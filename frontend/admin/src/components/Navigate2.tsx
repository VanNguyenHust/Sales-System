import { useEffect } from "react";
import { type NavigateProps } from "react-router-dom";

import { useNavigate } from "app/utils/useNavigate";
import { useToast } from "app/utils/useToast";

interface Props extends NavigateProps {
  toastSuccess?: string;
  toastError?: string;
}

/**
 * Universal Navigate
 *
 * - in web: using react router dom navigate and toast ui component
 * - in mobible bridge: using toast action and redirect action
 */
export function Navigate({ toastError, toastSuccess, to, ...navigateOptions }: Props) {
  const navigate = useNavigate();
  const { showToast, showErrorToast } = useToast();

  useEffect(() => {
    if (toastError) {
      showErrorToast(toastError);
    } else if (toastSuccess) {
      showToast(toastSuccess);
    }
    navigate(to, navigateOptions);
  }, [navigate, navigateOptions, showErrorToast, showToast, to, toastError, toastSuccess]);

  return null;
}
