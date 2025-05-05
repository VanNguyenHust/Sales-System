import { useCallback, useState } from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { FormLayout, Frame, Layout, Navigation, Page, Stack, Text, TopBar } from "@/ui-components";
import { LogOutIcon } from "@/ui-icons";

import inactivedAccountImg from "app/assets/images/inactived_account.svg";
import sapoLogo from "app/assets/images/sapo-logo.svg";
import { AppLayout } from "app/components/AppLayout";
import { DocumentTitle } from "app/components/DocumentTitle";
import { useCurrentUser } from "app/utils/useCurrentUser";
import { useToggle } from "app/utils/useToggle";

export function InActiveAccountPage() {
  return (
    <AppLayout>
      <Frame
        navigation={<Navigation location="/" />}
        topBar={<TopBar userMenu={<UserMenu />} searchField={<div />} />}
        logo={{
          source: sapoLogo,
          width: 130,
          url: "/admin/dashboard",
        }}
      >
        <DocumentTitle title="Tài khoản bị hạn chế" />
        <StyledContainer>
          <Layout>
            <Layout.Section oneHalf>
              <StyledContentContainer>
                <Stack vertical>
                  <Text as="h1" variant="heading2xl">
                    Tài khoản của bạn đang ngừng kích hoạt!
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Vui lòng liên hệ với chủ cửa hàng để khôi phục quyền truy cập
                  </Text>
                </Stack>
              </StyledContentContainer>
            </Layout.Section>
            <Layout.Section oneHalf>
              <StyledImageWrapper>
                <img width="100%" src={inactivedAccountImg} />
              </StyledImageWrapper>
            </Layout.Section>
          </Layout>
        </StyledContainer>
      </Frame>
    </AppLayout>
  );
}

function UserMenu() {
  const { value: isUserMenuOpen, toggle: toggleUserMenuOpen } = useToggle(false);
  const [imgUrl, setImgUrl] = useState<string | undefined>(undefined);
  const currentUser = useCurrentUser();

  const handleLogout = useCallback(() => {
    window.location.href = "/admin/authorization/logout";
  }, []);

  const url = currentUser.avatar?.src;

  return (
    <>
      {/** only set avatar image when url success load  */}
      {url ? <HiddenImage src={url} onLoad={() => setImgUrl(url)} /> : null}
      <TopBar.UserMenu
        actions={[
          {
            items: [{ icon: LogOutIcon, content: "Đăng xuất", onAction: handleLogout }],
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

const StyledContainer = styled.div`
  min-height: 90vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  ${(p) =>
    p.theme.breakpoints.down("md") &&
    css`
      padding: ${p.theme.spacing(5, 0)};
    `}

  & > div {
    height: 100%;
    width: 100%;
    align-items: center;
  }
  & > div > div {
    height: 100%;
  }
`;

const StyledContentContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
`;

const StyledImageWrapper = styled.div`
  display: flex;
  height: 100%;
  align-content: center;
  justify-content: center;
  align-items: center;
`;
