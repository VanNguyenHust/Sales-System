import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Frame, Spinner } from "@/ui-components";

import { useCreateDataOnboardingMutation, useUpdateStoreSettingMutation } from "app/api";
import { AppLayout } from "app/components/AppLayout";
import { FACEBOOK_SHOPPING_ALIAS } from "app/features/setting/constants";
import { showErrorToast, ToastProvider } from "app/utils/toast/ToastProvider";

import { Onboarding } from "./Onboarding";
import { ChannelEnum, PackageTitle, SETTING_KEY_ONBOARDING, StatusOnBoarding } from "./types";

interface Props {
  packageTitle: string;
}

export function OnboardingFrame({ packageTitle }: Props) {
  const navigate = useNavigate();

  const [createDataOnboarding] = useCreateDataOnboardingMutation();
  const [updateStatusOnboarding] = useUpdateStoreSettingMutation();

  // Xử lý complete onboarding
  const handleCompleteOnboarding = useCallback(async () => {
    try {
      await createDataOnboarding({
        channels:
          packageTitle === PackageTitle.EWEB_V3
            ? [ChannelEnum.ONLINE_STORE, ChannelEnum.SOCIAL]
            : packageTitle === PackageTitle.RETAIL_PRO_V3
            ? [ChannelEnum.POS, ChannelEnum.SOCIAL]
            : [ChannelEnum.FACEBOOK, ChannelEnum.SOCIAL],
      }).unwrap();
      await updateStatusOnboarding({
        setting_key: SETTING_KEY_ONBOARDING,
        setting_value: StatusOnBoarding.COMPLETE,
      }).unwrap();
      if (packageTitle === PackageTitle.SOCIAL_V3) {
        navigate(`/admin/apps/${FACEBOOK_SHOPPING_ALIAS}`);
      }
    } catch {
      showErrorToast("Có lỗi xảy ra. Vui lòng thử lại sau!");
    }
  }, [createDataOnboarding, navigate, packageTitle, updateStatusOnboarding]);

  useEffect(() => {
    if (
      packageTitle === PackageTitle.SOCIAL_V3 ||
      packageTitle === PackageTitle.EWEB_V3 ||
      packageTitle === PackageTitle.RETAIL_PRO_V3
    ) {
      handleCompleteOnboarding();
    }
  }, [handleCompleteOnboarding, packageTitle]);

  return (
    <AppLayout>
      {packageTitle === PackageTitle.SOCIAL_V3 ||
      packageTitle === PackageTitle.EWEB_V3 ||
      packageTitle === PackageTitle.RETAIL_PRO_V3 ? (
        <StyledPageLoading>
          <Spinner />
        </StyledPageLoading>
      ) : (
        <Frame>
          <ToastProvider>
            <Onboarding packageTitle={packageTitle as PackageTitle} />
          </ToastProvider>
        </Frame>
      )}
    </AppLayout>
  );
}

const StyledPageLoading = styled.div`
  width: 100%;
  height: calc(100% - ${(p) => p.theme.components.topBar.height});
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${(p) => p.theme.components.topBar.height});
`;
