import React from "react";
import styled from "@emotion/styled";
import { Frame, Icon, Navigation, TopBar } from "@/ui-components";
import { SettingsIcon, TextAlignJustifyIcon } from "@/ui-icons";

// import sapoLogo from "app/assets/images/sapo-logo.svg";
// import { isSapoMobileBridge } from "app/utils/mobile";

type Props = {
  children?: React.ReactNode;
};

export function AdminSkeleton({ children }: Props) {
  return (
    <Frame
      logo={{
        // source: sapoLogo,
        width: 130,
        url: "/admin/dashboard",
      }}
      topBar={
        // !isSapoMobileBridge && (
          <TopBar
            searchField={
              <StyledSearchField>
                <StyledMobileToggleWrapper>
                  <Icon source={TextAlignJustifyIcon} />
                </StyledMobileToggleWrapper>
              </StyledSearchField>
            }
            userMenu={<StyledUserMenu />}
            secondaryMenu={<StyledSecondaryMenu />}
          />
        // )
      }
      navigation={
        // !isSapoMobileBridge && (
          <Navigation location="/">
            <StyledNavMiddle />
            <StyledNavBottom>
              <Navigation.Section
                separator
                items={[
                  {
                    label: "Cấu hình",
                    icon: SettingsIcon,
                    disabled: true,
                  },
                ]}
              />
            </StyledNavBottom>
          </Navigation>
        // )
      }
    >
      {children}
    </Frame>
  );
}

const StyledMobileToggleWrapper = styled.div`
  color: ${(p) => p.theme.colors.iconDisabled};
  margin-left: ${(p) => p.theme.spacing(2)};
  margin-right: ${(p) => p.theme.spacing(2)};
  padding: ${(p) => p.theme.spacing(2)};
  ${(p) => p.theme.breakpoints.up("md")} {
    display: none;
  }
`;

const StyledSearchField = styled.div`
  display: flex;
  &::after {
    content: "";
    height: ${(p) => p.theme.components.form.controlHeight};
    flex: 1;
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
    background-color: ${(p) => p.theme.colors.backgroundStrong};
  }
`;

const StyledUserMenu = styled.div`
  height: ${(p) => p.theme.components.form.controlHeight};
  width: 48px;
  border-radius: ${(p) => p.theme.shape.borderRadius("base")};
  background-color: ${(p) => p.theme.colors.backgroundStrong};
  ${(p) => p.theme.breakpoints.up("md")} {
    height: calc(${(p) => p.theme.components.form.controlHeight} - ${(p) => p.theme.spacing(2)});
    width: calc(${(p) => p.theme.components.topBar.usernameMaxWidth} * 0.7);
  }
`;

const StyledSecondaryMenu = styled.div`
  display: flex;
  gap: ${(p) => p.theme.spacing(2)};

  &::before,
  &::after {
    content: "";
    height: ${(p) => p.theme.components.form.controlHeight};
    width: ${(p) => p.theme.components.form.controlHeight};
    border-radius: ${(p) => p.theme.shape.borderRadius("base")};
    background-color: ${(p) => p.theme.colors.backgroundStrong};
  }
`;

const StyledNavMiddle = styled.div`
  flex: 1 0 auto;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledNavBottom = styled.div`
  position: sticky;
  bottom: 0;
  background: ${(p) => p.theme.components.navigation.backgroundColor};
`;
