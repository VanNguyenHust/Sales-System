import { useNavigate } from "react-router-dom";
import { Navigation } from "@/ui-components";
import { PlusCircleOutlineIcon, PosIcon, VisibilityBlackIcon, WebsiteIcon } from "@/ui-icons";

import { useGetPublicationsQuery } from "app/features/app/api";
import { usePermission } from "app/features/auth/usePermission";
import { ONLINE_STORE_CLIENT_ID, POS_CLIENT_ID } from "app/features/setting/constants";
import { useSelector } from "app/types";
import { filterNonNull } from "app/utils/arrays";
import { useFeatureFlag } from "app/utils/useFeatureFlag";
import { useTenant } from "app/utils/useTenant";

import { SkeletonNavigationSection } from "./SkeletonNavigationSection";
import { NavigationItemProps } from "./types";
import { useApp } from "./useApp";

export function ChannelSection() {
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const pathname = useSelector((state) => state.ui.locationPathname);
  const { isEnabledFeature } = useFeatureFlag();
  const { hasSomePermissions } = usePermission();

  const { data: publications, isLoading: isLoadingPublications } = useGetPublicationsQuery({
    client_ids: [POS_CLIENT_ID, ONLINE_STORE_CLIENT_ID].join(","),
  });

  const posPublication = (publications || []).find((p) => p.client_id === POS_CLIENT_ID);
  const webPublication = (publications || []).find((p) => p.client_id === ONLINE_STORE_CLIENT_ID);

  const { items: channelItems, isLoading: isLoadingItems } = useApp(true);

  const handleViewWebsite = () => {
    window.open(`${location.protocol}//${tenant.domain}`);
  };

  const websiteItems: NavigationItemProps[] = [
    {
      label: "Giao diện",
      url: "/admin/themes",
      matchPaths: ["/admin/data/themes"],
      disabled: !hasSomePermissions(["themes"]),
    },
    {
      label: "Bài viết",
      url: "/admin/articles",
      matchPaths: ["/admin/blogs", "/admin/comments"],
      disabled: !hasSomePermissions(["pages"]),
    },
    {
      label: "Trang nội dung",
      url: "/admin/pages",
      disabled: !hasSomePermissions(["pages"]),
    },
    {
      label: "Menu",
      url: "/admin/links",
      matchPaths: ["/admin/redirects"],
      disabled: !hasSomePermissions(["links"]),
    },
    {
      label: "Tên miền",
      url: "/admin/settings/domains",
      disabled: !hasSomePermissions(["domains"]),
    },
    {
      label: "Thiết lập website",
      url: "/admin/preferences",
      disabled: !hasSomePermissions(["website_settings"]),
    },
  ];

  const title = "Kênh bán hàng";

  if (isLoadingPublications || isLoadingItems) {
    return <SkeletonNavigationSection title={title} separator />;
  }

  return (
    <Navigation.Section
      title={title}
      separator
      items={filterNonNull<NavigationItemProps>([
        isEnabledFeature("use_online_store_channel") && webPublication
          ? {
              label: "Website",
              url: websiteItems.find((item) => !item.disabled)?.url,
              icon: WebsiteIcon,
              disabled: websiteItems.every((item) => item.disabled),
              subNavigationItems: websiteItems,
              secondaryActions: [
                {
                  icon: VisibilityBlackIcon,
                  tooltip: {
                    content: "Xem website",
                  },
                  onClick: handleViewWebsite,
                },
              ],
            }
          : null,
        isEnabledFeature("use_pos_channel") && posPublication
          ? {
              label: "POS",
              url: "/admin/pos",
              icon: PosIcon,
            }
          : null,
        ...channelItems,
      ])}
      action={
        hasSomePermissions(["applications", "limited_applications"])
          ? {
              icon: PlusCircleOutlineIcon,
              tooltip: {
                content: "Quản lý kênh",
                preferredPosition: "above",
              },
              accessibilityLabel: "Quản lý kênh",
              onClick: () => navigate("/admin/settings/channels", { replace: pathname === "/admin/settings/channels" }),
            }
          : undefined
      }
    />
  );
}
