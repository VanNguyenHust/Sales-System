import { Frame } from "@/ui-components";

import sapoLogo from "app/assets/images/sapo-logo.svg";
import { AppLayout } from "app/components/AppLayout";
import { LeavePageProvider } from "app/components/leave-page/LeavePageProvider";
import { GlobalUI as LegacyGlobalUI } from "app/components/Legacy";
import { Provider as NavigateProvider } from "app/components/Navigate/Provider";
import { MobileBridgeProvider } from "app/features/mobile-bridge";
import { setNavigationCollapsed } from "app/state/reducers";
import { useDispatch, useSelector } from "app/types";
import { isSapoMobileBridge } from "app/utils/mobile";
import { ToastProvider } from "app/utils/toast/ToastProvider";
import { useToggle } from "app/utils/useToggle";

import { NavBar } from "../NavBar";
import { TopBar } from "../TopBar";

import { Chatbot } from "./Chatbot";
import { TrackingScript } from "./TrackingScript";

type Props = {
  children: React.ReactNode;
};

export function AdminFrame({ children }: Props) {
  const navigationCollapsed = useSelector((state) => state.ui.navbarCollapsed);
  const dispatch = useDispatch();
  const toggleNavigationCollapsed = () => dispatch(setNavigationCollapsed(!navigationCollapsed));
  const { value: isNavigationMobileShow, toggle: toggleNavigationMobileShow } = useToggle(false);
  const fullscreen = useSelector(
    (state) => state.ui.legacyFullscreen || state.appBridge.fullscreen || isSapoMobileBridge
  );
  return (
    <AppLayout>
      <TrackingScript />
      <Chatbot />
      <Frame
        navigation={!fullscreen ? <NavBar /> : undefined}
        topBar={!fullscreen ? <TopBar toggleNavigationMobile={toggleNavigationMobileShow} /> : undefined}
        logo={{
          source: sapoLogo,
          width: 130,
          url: "/admin/dashboard",
        }}
        showMobileNavigation={isNavigationMobileShow}
        onNavigationDismiss={toggleNavigationMobileShow}
        navigationCollapseAction={{
          collapsed: navigationCollapsed,
          onToggle: toggleNavigationCollapsed,
        }}
      >
        <MobileBridgeProvider>
          <LeavePageProvider>
            <LegacyGlobalUI />
            <NavigateProvider>
              <ToastProvider>{children}</ToastProvider>
            </NavigateProvider>
          </LeavePageProvider>
        </MobileBridgeProvider>
      </Frame>
    </AppLayout>
  );
}
