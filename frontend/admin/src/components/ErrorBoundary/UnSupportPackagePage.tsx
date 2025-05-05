import { Text } from "@/ui-components";

import UnSupportPackageSVG from "app/assets/images/unsupport-package.svg";
import { usePermission } from "app/features/auth/usePermission";

import { ErrorState } from "./components/ErrorState";

export default function UnSupportPackagePage() {
  const { hasSomePermissions } = usePermission();
  const hasPlanSetting = hasSomePermissions(["plans_settings"]);
  return (
    <ErrorState
      image={UnSupportPackageSVG}
      heading="Gói dịch vụ hiện tại không hỗ trợ tính năng này"
      action={
        hasPlanSetting
          ? {
              external: true,
              content: "Nâng cấp gói dịch vụ",
              url: "/admin/settings/plans/website",
            }
          : undefined
      }
    >
      <Text variant="bodyMd" as="p" alignment="center" color="slim">
        Bạn vui lòng nâng cấp lên gói cao hơn để sử dụng
      </Text>
    </ErrorState>
  );
}
