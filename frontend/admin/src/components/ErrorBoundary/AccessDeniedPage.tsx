import { Text } from "@/ui-components";

import AccessDeniedSVG from "app/assets/images/access-denied.svg";
import { useSelector } from "app/types";

import { ErrorState } from "./components/ErrorState";

export default function AccessDeniedPage() {
  const tenantState = useSelector((state) => state.tenant.tenant);
  return (
    <ErrorState image={AccessDeniedSVG} heading="Bạn không có quyền truy cập chức năng này">
      <Text variant="bodyMd" as="p" alignment="center" color="slim">
        Hãy liên hệ với{" "}
        <Text as="span" fontWeight="bold">
          {tenantState?.store_owner}
        </Text>{" "}
        để được cấp quyền.
      </Text>
    </ErrorState>
  );
}
