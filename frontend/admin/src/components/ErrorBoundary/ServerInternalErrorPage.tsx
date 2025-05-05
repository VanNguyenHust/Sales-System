import { useEffect } from "react";
import { EmptyState, Page, Text } from "@/ui-components";
// eslint-disable-next-line import/named
import { captureException } from "@sentry/react";

import Error500SVG from "app/assets/images/error-500.svg";

type Props = {
  error: unknown;
};

export function ServerInternalErrorPage({ error }: Props) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <Page>
      <EmptyState image={Error500SVG} heading="Có lỗi xảy ra!">
        <Text variant="bodyLg" as="p" alignment="center">
          Hiện tại, hệ thống đang gặp sự cố về kỹ thuật. <br />
          Chúng tôi đang cố gắng khắc phục trong thời gian sớm nhất. Mong quý khách thông cảm về sự bất tiện này
        </Text>
      </EmptyState>
    </Page>
  );
}
