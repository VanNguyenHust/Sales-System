import { Navigation } from "@/ui-components";

import MultiChannelChatIcon from "app/assets/icon/multi-channel-chat.svg?react";
import { usePermission } from "app/features/auth/usePermission";
import { filterNonNull } from "app/utils/arrays";

import { NavigationItemProps } from "./types";

export function SocialSection() {
  const { hasSomePermissions } = usePermission();

  return (
    <Navigation.Section
      separator
      items={filterNonNull<NavigationItemProps>([
        {
          label: "Chat đa kênh",
          url: `/admin/apps/${import.meta.env.VITE_SOCIAL_ALIAS}`,
          matchPaths: [`/admin/apps/${import.meta.env.VITE_SOCIAL_CLIENT_ID}`],
          icon: MultiChannelChatIcon,
          disabled: !hasSomePermissions(["applications", "limited_applications"]),
        },
      ])}
    />
  );
}
