// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite/client" />
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_LANGUAGE: string;
  readonly VITE_CLIENT_DELAY: string;
  readonly VITE_DEV_ENABLE_MSW: string;
  readonly VITE_DEV_ENABLE_REACT_STRICT_MODE: string;
  readonly VITE_ONLINE_STORE_CLIENT_ID: string;
  readonly VITE_MARKETPLACE_ALIAS: string;
  readonly VITE_SOCIAL_ALIAS: string;
  readonly VITE_SSO_PROFILE_URL: string;
  readonly VITE_POS_CLIENT_ID: string;
  readonly VITE_SOCIAL_CLIENT_ID: string;
  /* shopee */
  readonly VITE_SHOPEE_CLIENT_ID: string;
  readonly VITE_SHOPEE_ALIAS: string;
  /* tiki */
  readonly VITE_TIKI_CLIENT_ID: string;
  readonly VITE_TIKI_ALIAS: string;
  /* lazada */
  readonly VITE_LAZADA_CLIENT_ID: string;
  readonly VITE_LAZADA_ALIAS: string;
  /* tiktok */
  readonly VITE_TIKTOK_CLIENT_ID: string;
  readonly VITE_TIKTOK_ALIAS: string;
  /* facebook */
  readonly VITE_FACEBOOK_SHOPPING_CLIENT_ID: string;
  readonly VITE_FACEBOOK_SHOPPINH_ALIAS: string;
  /* app config print */
  readonly VITE_APP_CONFIG_PRINT_CLIENT_ID: string;

  readonly VITE_SAPO_EXPRESS_CLIENT_ID: string;
  readonly VITE_FEATURE_FLAGS: string;
  /** cdn url base, for example: https://bizweb.dktcdn.net/dev/admin/frontend-staging */
  readonly VITE_MEDIA_BASE_URL: string;
  readonly VITE_DEV_PERMISSIONS: string;
  readonly VITE_DEV_FEATURE_FLAGS: string;
  readonly VITE_CDN_DOMAIN: string;
  /* stock transfer */
  readonly VITE_STOCK_TRANSFER_VALUE_FOR_ALIASES: string;
  /* Clarity */
  readonly VITE_CLARITY_KEY: string;

  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SENTRY_ENVIRONMENT: string;
  // from ci/cd setup
  readonly VITE_SENTRY_RELEASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
