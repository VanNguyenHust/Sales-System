import * as Sentry from "@sentry/react";

import { IS_PROD } from "app/constants";
import { CurrentUser, Tenant } from "app/types";

function setup() {
  if (import.meta.env.VITE_SENTRY_DSN && IS_PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
      release: import.meta.env.VITE_SENTRY_RELEASE,
      integrations: [],
      autoSessionTracking: false,
    });
  }
}

setup();

type EnrichTenantInfoOptions = {
  tenant?: Tenant;
  user?: CurrentUser;
};

export function sentryEnrichTenantInfo({ tenant, user }: EnrichTenantInfoOptions) {
  if (tenant) {
    // eslint-disable-next-line import/namespace
    Sentry.setTag("tenant", tenant.sapo_domain);
  }

  if (user) {
    // eslint-disable-next-line import/namespace
    Sentry.setUser({
      email: user.user.email,
      username: user.user.name,
      id: user.user.id,
    });
  }
}
