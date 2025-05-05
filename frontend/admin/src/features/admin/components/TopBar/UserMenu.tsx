import { useCallback, useState } from "react";
import styled from "@emotion/styled";
import { type Action, TopBar as UITopBar } from "@/ui-components";
import { BoxIcon, LogOutIcon, UserCircleIcon } from "@/ui-icons";

import { usePermission } from "app/features/auth/usePermission";
import { filterNonNull } from "app/utils/arrays";
import { isTrialPackageWithPackageName } from "app/utils/package";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useTenant } from "app/utils/useTenant";
import { useToggle } from "app/utils/useToggle";

const PROFILES_URL = import.meta.env.VITE_SSO_PROFILE_URL;

export function UserMenu() {
  const { value: isUserMenuOpen, toggle: toggleUserMenuOpen } = useToggle(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const { tenant } = useTenant();
  const currentUser = useCurrentUser();
  const { hasSomePermissions } = usePermission();

  const handleLogout = useCallback(() => {
    window.location.href = "/admin/authorization/logout";
  }, []);

  const url = currentUser.avatar?.src;

  return (
    <>
      {/** only set avatar image when url success load  */}
      {url ? <HiddenImage src={url} onLoad={() => setImgUrl(url)} /> : null}
      <UITopBar.UserMenu
        actions={[
          {
            items: filterNonNull<Action>([
              {
                icon: UserCircleIcon,
                content: "Tài khoản của bạn",
                external: tenant.sso,
                url: tenant.sso ? `${PROFILES_URL}/vi/accounts` : `/admin/settings/account/${currentUser.id}`,
              },
              hasSomePermissions(["plans_settings"])
                ? {
                    icon: BoxIcon,
                    content: "Thông tin gói dịch vụ",
                    external: true,
                    url: isTrialPackageWithPackageName(tenant.plan_name)
                      ? `${PROFILES_URL}/stores`
                      : `${PROFILES_URL}/stores/${tenant.sapo_domain}`,
                  }
                : null,
              { icon: LogOutIcon, content: "Đăng xuất", onAction: handleLogout },
            ]),
          },
          {
            items: [
              { content: "Điều khoản dịch vụ", url: "https://support.sapo.vn/quy-dinh-su-dung", external: true },
              { content: "Chính sách bảo mật", url: "https://support.sapo.vn/chinh-sach-bao-mat", external: true },
            ],
          },
        ]}
        name={currentUser.name}
        initials={currentUser.first_name.substring(0, 2)}
        avatar={imgUrl}
        open={isUserMenuOpen}
        onToggle={toggleUserMenuOpen}
      />
    </>
  );
}

const HiddenImage = styled.img`
  display: none;
  width: 0;
  height: 0;
  visibility: hidden;
`;
