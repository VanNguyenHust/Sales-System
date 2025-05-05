import { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";

import {
  useGetCurrenciesQuery,
  useGetCurrentUserQuery,
  useGetStoreFeatureQuery,
  useGetTenantWithCurrencyAndSettingQuery,
} from "src/api";
import { AppLayout } from "src/components/AppLayout";
import { ServerInternalErrorPage } from "src/components/ErrorBoundary";
import { useSelector } from "src/types";
import { setCsrf } from "src/utils/csrf";
import { sentryEnrichTenantInfo } from "src/utils/instrument";

import { AdminSkeleton } from "../AdminSkeleton";
import { InActiveAccountPage } from "../InActiveAccountPage";
import { MigrateRunningPage } from "../MigrateRunningPage";
import { OnboardingFrame } from "../Onboarding/OnboardingFrame";
import {
  SETTING_KEY_MIGRATE_STATUS,
  SETTING_KEY_ONBOARDING,
  SETTING_KEY_PACKAGE_TITLE,
  StatusMigrate,
  StatusOnBoarding,
} from "../Onboarding/types";

import { AdminFrame } from "./AdminFrame";

type Props = {
  children?: React.ReactNode;
};

export function AdminLayout({ children }: Props) {
  const {
    data: currentUser,
    isLoading: isLoadingCurrentUser,
    error: errorUser,
  } = useInitUser();
  const {
    tenant,
    activeStoreSettings,
    isLoading,
    error: errorInit,
  } = useInitQuery({
    skip: !currentUser || !currentUser.user.active,
  });
  const initializing = useSelector((state) => state.tenant.initializing);

  const renderError = (error: unknown) => {
    if (isStatusResponse(error) && error.status === 401) {
      window.location.href = buildLoginUrl();
      return null;
    }
    return <ServerInternalErrorPage error={error} />;
  };

  const loadingMarkup =
    isLoading || isLoadingCurrentUser ? <AdminSkeleton /> : null;

  const errorMarkup =
    errorInit || errorUser ? renderError(errorUser ?? errorInit) : null;

  useEffect(() => {
    sentryEnrichTenantInfo({
      tenant,
      user: currentUser,
    });
  }, [currentUser, tenant]);

  const { showOnboarding, packageTitle, isMigrating } = useMemo(
    () => ({
      showOnboarding:
        activeStoreSettings?.find(
          (setting) => setting.setting_key === SETTING_KEY_ONBOARDING
        )?.setting_value === StatusOnBoarding.INCOMPLETE || false,
      packageTitle:
        activeStoreSettings?.find(
          (setting) => setting.setting_key === SETTING_KEY_PACKAGE_TITLE
        )?.setting_value || "",
      isMigrating:
        (activeStoreSettings?.find(
          (setting) => setting.setting_key === SETTING_KEY_MIGRATE_STATUS
        )?.setting_value ?? StatusMigrate.COMPLETED) !==
        StatusMigrate.COMPLETED,
    }),
    [activeStoreSettings]
  );

  if (!currentUser || isLoadingCurrentUser) {
    return (
      <AppLayout>
        {loadingMarkup}
        {errorMarkup}
      </AppLayout>
    );
  }
  if (!currentUser.user.active) {
    return <InActiveAccountPage />;
  }
  if (!tenant || initializing) {
    return (
      <AppLayout>
        {loadingMarkup}
        {errorMarkup}
      </AppLayout>
    );
  }

  if (showOnboarding) return <OnboardingFrame packageTitle={packageTitle} />;
  if (isMigrating) return <MigrateRunningPage />;
  return <AdminFrame>{children ?? <Outlet />}</AdminFrame>;
}

const INTERVAL = 15 * 60 * 1000; // 15 minutes

function useInitQuery(options?: { skip?: boolean }) {
  const skip = options?.skip;
  const {
    data: tenantBootstrap,
    isLoading: isLoadingTenant,
    error: errorTenant,
  } = useGetTenantWithCurrencyAndSettingQuery(undefined, { skip });
  const { isLoading: isLoadingCurrencies, error: errorCurrencies } =
    useGetCurrenciesQuery(undefined, { skip });

  const { isLoading: isLoadingStoreFeature, error: errorStoreFeature } =
    useGetStoreFeatureQuery(undefined, { skip });

  const error = errorTenant || errorCurrencies || errorStoreFeature;

  return {
    tenant: tenantBootstrap?.tenant,
    activeStoreSettings: tenantBootstrap
      ? tenantBootstrap?.settings.filter((setting) =>
          [
            SETTING_KEY_ONBOARDING,
            SETTING_KEY_PACKAGE_TITLE,
            SETTING_KEY_MIGRATE_STATUS,
          ].includes(setting.setting_key)
        )
      : [],
    isLoading: isLoadingTenant || isLoadingCurrencies || isLoadingStoreFeature,
    error,
  };
}

function useInitUser() {
  const {
    data,
    error,
    isLoading,
    refetch: refetchUser,
  } = useGetCurrentUserQuery();

  // polling session để refresh csrf và refresh admin session cookie, nếu lỗi sẽ điều hướng user đến trang login
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined = undefined;
    if (!error) {
      timeout = setInterval(refetchUser, INTERVAL);
    }
    return () => {
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, [error, refetchUser]);

  const csrf = data?.csrf_token;

  useEffect(() => {
    if (csrf) {
      setCsrf(csrf);
    }
  }, [csrf]);

  return { data, isLoading, error };
}

function buildLoginUrl() {
  return `/admin/authorization/login?returnUrl=${encodeURIComponent(
    window.location.pathname + window.location.search
  )}`;
}

function isStatusResponse(error: unknown): error is { status: number } {
  return !!error && typeof error === "object" && "status" in error;
}
