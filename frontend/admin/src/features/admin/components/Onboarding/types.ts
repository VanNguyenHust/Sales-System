import React from "react";

export const SETTING_KEY_ONBOARDING = "CompleteOnboarding";
export const SETTING_KEY_PACKAGE_TITLE = "RegisterPackageTitle";
export const SETTING_KEY_MIGRATE_STATUS = "migrate_status";

export enum StatusOnBoarding {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete",
}

export enum StatusMigrate {
  COMPLETED = "completed",
  RUNNING = "running",
  PENDING = "pending",
}

export type StepItem = {
  value: number;
  title: string;
};

export enum ChannelEnum {
  ONLINE_STORE = "online_store",
  POS = "pos",
  FACEBOOK = "facebook",
  TIKTOKSHOP = "tiktok",
  SHOPEE = "shopee",
  LAZADA = "lazada",
  TIKI = "tiki",
  SOCIAL = "social",
}

export type ChannelOption = {
  icon: React.ReactElement;
  value: ChannelEnum;
  title: string;
  description: string;
  disabled?: boolean;
};

export enum PackageTitle {
  EWEB_V3 = "eweb_v3",
  RETAIL_PRO_V3 = "retail_pro_v3",
  SOCIAL_V3 = "social_v3",
  OMNI_V3 = "omni_v3",
  SAPO_GO_V3 = "sapo_go_v3",
}
