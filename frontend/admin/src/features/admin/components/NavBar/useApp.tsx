import { ComponentProps } from "react";
import styled from "@emotion/styled";
import { Navigation } from "@/ui-components";
import { PinEmptyIcon } from "@/ui-icons";

import appNoImage from "app/assets/images/app-no-image.png";
import { useGetAppInstallationsQuery } from "app/features/app/api";
import { usePinActiveApp } from "app/features/app/hooks/usePinActiveApp";
import { AppCategory, useSelector } from "app/types";
import { useToggle } from "app/utils/useToggle";

import { NavBarAppDetail } from "./types";

type Item = ComponentProps<typeof Navigation.Section>["items"][number];

type UseAppReturn = {
  items: Item[];
  isLoading: boolean;
};

export function useApp(channel = false): UseAppReturn {
  const { data: appInstallations = [], isLoading } = useGetAppInstallationsQuery({
    category: AppCategory.apps_and_channels_for_navigation,
  });
  const { pin, pinned, channel: isActiveAppChannel } = usePinActiveApp();
  const activeApp = useSelector((state) => state.appDetail.app);
  const appBridgeNavigationMenu = useSelector((state) => state.appBridge.menu.navigationMenu);
  const { value: rollup, toggle: toggleRollup } = useToggle(true);
  const pathname = useSelector((state) => state.ui.locationPathname);

  const activeAppDetail: NavBarAppDetail | undefined =
    activeApp && activeApp.channel === channel && activeApp.apiKey !== import.meta.env.VITE_SOCIAL_CLIENT_ID
      ? {
          aliasOrKey: activeApp.alias ?? activeApp.apiKey,
          label: activeApp.title,
          icon: activeApp.icon,
          apiKey: activeApp.apiKey,
        }
      : undefined;

  const pinnedApps = appInstallations
    .filter(({ app }) => app.channel === channel)
    .map(({ app }) => ({
      aliasOrKey: app.alias ?? app.api_key,
      label: app.title,
      icon: app.icon.src,
      apiKey: app.api_key,
      external: !app.embedded,
    }));

  const apps: NavBarAppDetail[] = [];
  pinnedApps.forEach((app) => {
    apps.push(app);
  });
  if (activeAppDetail && !apps.find((a) => a.aliasOrKey === activeAppDetail.aliasOrKey)) {
    apps.push(activeAppDetail);
  }

  const items = apps.map((app): Item => {
    let subItems: Item["subNavigationItems"] = [];
    const adminAppBasePath = `/admin/apps/${app.aliasOrKey}`;
    const isActiveApp = activeAppDetail && activeAppDetail.aliasOrKey === app.aliasOrKey;
    if (isActiveApp) {
      //TODO: remove me when sapo express migrate to app bridge
      if (app.apiKey === import.meta.env.VITE_SAPO_EXPRESS_CLIENT_ID) {
        subItems = expressNavigationItems.map((item) => ({
          label: item.label,
          url: item.path === "/" ? adminAppBasePath : adminAppBasePath + item.path,
          exactMatch: item.path === "/",
        }));
      } else if (appBridgeNavigationMenu) {
        subItems = appBridgeNavigationMenu.items.map((item) => ({
          label: item.label,
          url: adminAppBasePath + item.destination.path,
          exactMatch: item.destination.path === "/",
          matches: appBridgeNavigationMenu.active ? item.id === appBridgeNavigationMenu.active : undefined,
        }));
      }
      const rollupAfter = 8;
      if (subItems.length > rollupAfter) {
        subItems = [
          ...subItems.slice(0, rollup ? rollupAfter - 1 : subItems.length),
          {
            label: rollup ? "Xem thêm" : "Thu gọn",
            onClick: toggleRollup,
            matches: true,
            url: pathname,
          },
        ];
      }
    }
    let iconUrl: string | undefined = undefined;
    if (typeof app.icon === "string") {
      iconUrl = app.icon;
    } else if (!app.icon) {
      iconUrl = appNoImage;
    }

    return {
      url: adminAppBasePath,
      label: app.label,
      external: app.external,
      truncateText: true,
      icon: iconUrl ? () => <StyledIconImage src={iconUrl} alt={app.label} /> : app.icon,
      secondaryActions:
        isActiveApp && !pinned
          ? [
              {
                icon: PinEmptyIcon,
                tooltip: {
                  content: isActiveAppChannel ? "Ghim kênh bán hàng" : "Ghim ứng dụng",
                },
                onClick: pin,
              },
            ]
          : undefined,
      subNavigationItems: subItems,
    };
  });

  return {
    items,
    isLoading,
  };
}

const StyledIconImage = styled.img``;
const expressNavigationItems = [
  { label: "Đối soát", path: "/cross_checking" },
  { label: "Quản lý vận đơn", path: "/delivery_customer_orders" },
];
