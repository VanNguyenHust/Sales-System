import Cookies from "js-cookie";

import { useSelector } from "app/types";

const storeFeatureFlagValues = [
  "omni_v3",
  "use_online_store_channel",
  "use_pos_channel",
  "use_market_place_channel",
  "use_social_channel",
  "manage_orders",
  "manage_discounts",
  "manage_shippings",
  "manage_payments",
  "use_checkouts",
  "manage_cash_journal",
  "enable_shipping_new_provider",
  "use_facebook_shopping_channel",
  "manage_catalogs",
  "manage_metafield_definitions",
] as const;

const frontendFeatureFlagValues = ["frontend_payment_method_vpbank_gateway"] as const;

type StoreFeatureFlag = (typeof storeFeatureFlagValues)[number];

type FrontendFeatureFlag = (typeof frontendFeatureFlagValues)[number];

export type FeatureFlag = StoreFeatureFlag | FrontendFeatureFlag;

export type FeatureFlags = { [key in FeatureFlag]?: boolean };

let ff: FeatureFlags;
let frontendFlags: FeatureFlags;

export function useFeatureFlag() {
  const fromStoreFeature = useSelector((state) => state.tenant.feature) ?? {};
  const isEnabledFeature = (key: FeatureFlag): boolean => {
    if (!ff) {
      ff = readFeatureFlags(fromStoreFeature);
    }
    if (key in ff) {
      return ff[key] ?? false;
    }
    return false;
  };

  const hasFeatureValue = (key: FeatureFlag, verifyValue?: boolean) => {
    if (!ff) {
      ff = readFeatureFlags(fromStoreFeature);
    }

    let value: boolean | undefined = false;

    if (key in ff) {
      value = ff[key];
    }
    return value === verifyValue;
  };

  return {
    isEnabledFeature,
    hasFeatureValue,
  };
}

export function isEnabledFrontendFeature(key: FrontendFeatureFlag) {
  if (!frontendFlags) {
    frontendFlags = readFeatureFlags() as unknown as FeatureFlags;
  }
  if (key in frontendFlags) {
    const value = frontendFlags[key as FeatureFlag] as any;
    if (value === "true" || value === "false") {
      return value === "true";
    }
    return true;
  }
  return false;
}

function readFeatureFlags(storeFeature?: Record<string, boolean>) {
  const fromCookie = Cookies.get("feature_flags");
  const fromEnv = import.meta.env.VITE_FEATURE_FLAGS;
  const fromDev = import.meta.env.VITE_DEV_FEATURE_FLAGS;
  const rs: FeatureFlags = {};
  if (fromDev) {
    for (const token of fromDev.split(",")) {
      const { key, value } = santilizeToken(token);
      rs[key] = value;
    }
    return rs;
  }

  if (fromEnv) {
    for (const token of fromEnv.split(",")) {
      const { key, value } = santilizeToken(token);
      rs[key] = value;
    }
  }

  if (fromCookie) {
    for (const token of fromCookie.split(",")) {
      const { key, value } = santilizeToken(token);
      rs[key] = value;
    }
  }

  if (storeFeature) {
    for (const key in storeFeature) {
      rs[key as FeatureFlag] = storeFeature[key];
    }
  }

  return rs;
}

function santilizeToken(featureFlag: string): { key: FeatureFlag; value: boolean } {
  const tokens = featureFlag.split("=");
  if (tokens.length === 2) {
    return { key: tokens[0] as FeatureFlag, value: tokens[1].toLowerCase() === "true" };
  }
  return { key: featureFlag as FeatureFlag, value: true };
}
