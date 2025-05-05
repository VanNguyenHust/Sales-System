import { EmptyState, Link, Text } from "@/ui-components";

import Error404SVG from "app/assets/images/error-404.svg";

import { ErrorState } from "./components/ErrorState";

export function NotFoundPage() {
  return (
    <ErrorState
      image={Error404SVG}
      heading="Không tìm thấy trang"
      action={{
        content: "Quay lại trang chủ",
        url: "/admin",
      }}
      secondaryAction={{
        external: true,
        content: "Liên hệ hỗ trợ",
        url: "https://support.sapo.vn",
      }}
    >
      <Text variant="bodyMd" as="p" alignment="center" color="slim">
        Chúng tối rất tiếc vì không tìm thấy trang web bạn truy cập.
      </Text>
    </ErrorState>
  );
}
