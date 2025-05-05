export enum PackageName {
  Trial = "Dùng thử",
  eBronze = "eBronze",
  eGold = "eGold",
  ePlatinum = "ePlatinum",
  eDiamond = "eDiamond",
  Development = "Development",
  FPage = "F-Page",
  FPageTrial = "F-Page Dùng thử",
  FPageeBronze = "F-Page eBronze",
  FPageeGold = "F-Page eGold",
  FPageeDiamond = "F-Page eDiamond",
  BuyButton = "Buy Button",
  Plus = "Plus",
  eDiamondNew = "eDiamond New",
  Advanced = "Advanced",
  AdvancedSapo = "AdvancedSapo",
  Training = "Training",
  EWEB = "EWEB",
  ESOCIAL = "ESOCIAL",
  OMNI = "OMNI",
  EWEB_TRIAL = "EWEB_TRIAL",
  ESOCIAL_TRIAL = "ESOCIAL_TRIAL",
  OMNI_TRIAL = "OMNI_TRIAL",
  ENTERPRISE = "ENTERPRISE",
  SAPO_UP = "SAPO_UP",
  WEB_PRO = "WEB_PRO",
  WEB_PREMIUM = "WEB_PREMIUM",
  PLATINUM = "PLATINUM",
  WEB_PRO_UP = "WEB_PRO_UP",
  RETAIL_MASTER = "RETAIL_MASTER",
  WEB_BRAND = "WEB_BRAND",
  WEB_TRIAL_V3 = "WEB_TRIAL_V3",
  WEB_BRAND_V3 = "WEB_BRAND_V3",
  WEB_STANDARD_V3 = "WEB_STANDARD_V3",
  WEB_MASTER_V3 = "WEB_MASTER_V3",
  GO_MASTER_V3 = "GO_MASTER_V3",
  OMNI_TRIAL_V3 = "OMNI_TRIAL_V3",
  RETAIL_PRO_V3 = "RETAIL_PRO_V3",
  OMNI_PLUS_V3 = "OMNI_PLUS_V3",
  BASE_OMNI_V3 = "BASE_OMNI_V3",
}

export const isTrialPackageWithPackageName = (planName: string) => {
  switch (planName) {
    case PackageName.Trial:
    case PackageName.Development:
    case PackageName.FPageTrial:
    case PackageName.Training:
    case PackageName.EWEB_TRIAL:
    case PackageName.ESOCIAL_TRIAL:
    case PackageName.OMNI_TRIAL:
    case PackageName.WEB_TRIAL_V3:
    case PackageName.OMNI_TRIAL_V3:
      return true;
    default:
      return false;
  }
};

export enum Package {
  Trial = 1,
  eBronze = 2,
  eGold = 3,
  ePlatinum = 4,
  eDiamond = 5,
  Development = 6,
  FPage = 7,
  FPageTrial = 8,
  FPageeBronze = 9,
  FPageeGold = 10,
  FPageeDiamond = 11,
  BuyButton = 12,
  Plus = 13,
  eDiamondNew = 14,
  Advanced = 15,
  AdvancedSapo = 16,
  Training = 17,
  EWEB = 18,
  ESOCIAL = 19,
  OMNI = 20,
  EWEB_TRIAL = 21,
  ESOCIAL_TRIAL = 22,
  OMNI_TRIAL = 23,
  ENTERPRISE = 24,
  SAPO_UP = 25,
  WEB_PRO = 26,
  WEB_PREMIUM = 27,
  PLATINUM = 28,
  WEB_PRO_UP = 29,
  RETAIL_MASTER = 30,
  WEB_BRAND = 31,
  WEB_TRIAL_V3 = 32,
  WEB_BRAND_V3 = 33,
  WEB_STANDARD_V3 = 34,
  WEB_MASTER_V3 = 35,
  GO_MASTER_V3 = 36,
  OMNI_TRIAL_V3 = 37,
  RETAIL_PRO_V3 = 38,
  OMNI_PLUS_V3 = 39,
  BASE_OMNI_V3 = 40,
}

export const isTrialPackageWithPackageId = (storePackageId: number) => {
  switch (storePackageId) {
    case Package.Trial:
    case Package.Development:
    case Package.FPageTrial:
    case Package.Training:
    case Package.EWEB_TRIAL:
    case Package.ESOCIAL_TRIAL:
    case Package.OMNI_TRIAL:
    case Package.WEB_TRIAL_V3:
    case Package.OMNI_TRIAL_V3:
      return true;
    default:
      return false;
  }
};
