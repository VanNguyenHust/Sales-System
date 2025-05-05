import { useNavigate } from "react-router-dom";
import { Navigation } from "@/ui-components";
import { PlusCircleOutlineIcon } from "@/ui-icons";

import { usePermission } from "app/features/auth/usePermission";
import { useSelector } from "app/types";

import { SkeletonNavigationSection } from "./SkeletonNavigationSection";
import { useApp } from "./useApp";

export function AppSection() {
  const navigate = useNavigate();
  const pathname = useSelector((state) => state.ui.locationPathname);

  const { items: appItems, isLoading } = useApp();

  const { hasSomePermissions } = usePermission();

  const title = "Ứng dụng";

  if (isLoading) {
    return <SkeletonNavigationSection title={title} separator />;
  }

  return (
    <Navigation.Section
      title={title}
      separator
      items={appItems}
      action={
        hasSomePermissions(["applications", "limited_applications"])
          ? {
              icon: PlusCircleOutlineIcon,
              tooltip: {
                content: "Quản lý ứng dụng",
                preferredPosition: "above",
              },
              accessibilityLabel: "Quản lý ứng dụng",
              onClick: () => navigate("/admin/apps", { replace: pathname === "/admin/apps" }),
            }
          : undefined
      }
    />
  );
}
