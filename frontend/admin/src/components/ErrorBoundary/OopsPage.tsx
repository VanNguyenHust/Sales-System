import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import { Text } from "@/ui-components";
import { captureException } from "@sentry/react";

import oopsImage from "app/assets/images/error-oops.svg";

import { ErrorState } from "./components/ErrorState";

export function OopsPage() {
  const error = useRouteError();
  useEffect(() => {
    showErrorOverlay(error);
    captureException(error);
  }, [error]);

  return (
    <ErrorState image={oopsImage} heading="Oops!">
      <Text variant="bodyMd" as="p" alignment="center" color="slim">
        Hiện tại, hệ thống đang gặp sự cố về kỹ thuật. <br />
        Chúng tôi đang cố gắng khắc phục trong thời gian sớm nhất. Mong quý
        khách thông cảm về sự bất tiện này
      </Text>
    </ErrorState>
  );
}

// see: https://github.com/vitejs/vite/issues/2076
const showErrorOverlay = (err: any) => {
  // must be within function call because that's when the element is defined for sure.
  const ErrorOverlay = customElements.get("vite-error-overlay");
  // don't open outside vite environment
  if (!ErrorOverlay) {
    return;
  }
  const overlay = new ErrorOverlay(err);
  document.body.appendChild(overlay);
};
