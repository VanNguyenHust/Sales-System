import { useCallback } from "react";

import { CurrencyResponse, Tenant, useSelector } from "app/types";

interface UseTenantReturn {
  tenant: Tenant;
  getAdminRelativePath(urlOrPath: string): string | undefined;
  getOnlineStoreUrl(path: string): string;
  /**
   * @param precision - default value: 2
   */
  formatNumber(value: number, precision?: number): string;
}

export function useTenant(currencyResponse?: CurrencyResponse): UseTenantReturn {
  const tenant = useSelector((state) => state.tenant.tenant);
  const currency = useSelector((state) => currencyResponse ?? state.tenant.currency);

  if (!tenant || !currency) {
    throw new Error("Tenant is not be initialized");
  }

  const formatNumber: UseTenantReturn["formatNumber"] = (value, precision = 2) => {
    if (isNaN(value)) {
      return "0";
    }
    const numberString = Math.round(value) !== value ? value.toFixed(precision) : value.toString();
    return formatNumberString(String(parseFloat(numberString)));
  };

  const getAdminRelativePath: UseTenantReturn["getAdminRelativePath"] = useCallback(
    (urlOrPath) => {
      if (!urlOrPath) {
        return undefined;
      }
      if (urlOrPath.startsWith("/")) {
        return urlOrPath;
      }
      try {
        const url = new URL(urlOrPath);
        if (url.hostname === location.hostname || url.hostname === tenant.sapo_domain) {
          return url.pathname + url.search + url.hash;
        }
      } catch (e) {
        // ignore invalid url
      }
      return undefined;
    },
    [tenant.sapo_domain]
  );

  const getOnlineStoreUrl: UseTenantReturn["getOnlineStoreUrl"] = useCallback(
    (path) => {
      if (tenant.force_ssl) {
        return `https://${tenant.domain}${path}`;
      }
      return `http://${tenant.domain}${path}`;
    },
    [tenant]
  );

  return {
    tenant,
    formatNumber,
    getAdminRelativePath,
    getOnlineStoreUrl,
  };
}

const currencyThousandRegex = /(\d)(?=(\d\d\d)+(?!\d))/g;

function formatNumberString(numberString: string, thousands = ",", decimal = ".") {
  const parts = numberString.split(".");
  const beforeDecimalAmount = parts[0].replace(currencyThousandRegex, `$1${thousands}`);
  const afterDecimalAmount = parts[1] ? decimal + parts[1] : "";
  return beforeDecimalAmount + afterDecimalAmount;
}
