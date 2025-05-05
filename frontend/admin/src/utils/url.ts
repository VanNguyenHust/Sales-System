const cdnDomain = import.meta.env.VITE_CDN_DOMAIN;

/**
 * @param splitArray param thay vì ids[]=1,2 thì sẽ là ids[]=1&ids[]=2
 */

export const toQueryString = (obj: { [key: string]: any } | null | undefined, splitArray?: boolean) => {
  if (!obj) return "";

  const params = new URLSearchParams();
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      if (splitArray && Array.isArray(obj[key]) && obj[key].length > 1) {
        obj[key].forEach((value: string) => {
          params.append(key, value);
        });
      } else {
        params.append(key, obj[key]);
      }
    }
  }

  return params.toString().length ? `?${params.toString()}` : "";
};

/**
 * - thumb: Sử dụng cho ảnh thumb thường ở màn danh sách
 * - compact: Sử dụng cho ảnh to hơn thumb một chút thường cho phần preview upload ảnh
 * - grande: Không khác ảnh gốc là mấy
 */
export type ResizedImageType =
  | "compact"
  | "grande"
  | "thumb"
  | "small"
  | "medium"
  | "large"
  | "icon"
  | "pico"
  | "1024x1024"
  | "2048x2048";

/** Get original cdn image src */
const getOriginalMediaResizedSrc = (src: string) => {
  const url = parseSapoUrl(src);
  if (!url) {
    return src;
  }
  const pathPartial = url.pathname.split("/");
  const thumbIndex = pathPartial.indexOf("thumb");
  if (pathPartial.indexOf("thumb") !== 1) {
    return src;
  }
  const newPathPartial = pathPartial.filter((_, index) => index === 0 || index > thumbIndex + 1);
  return `${url.origin}${newPathPartial.join("/")}${url.search}`;
};

/**
 * Convert origin cdn image to optimized image
 * For example:
 * - trước: https://bizweb.dktcdn.net/dev/105/299/218/vouchers/banner-tpbank-v2.png?v=1701776042000
 * - sau: https://bizweb.dktcdn.net/thumb/compact/dev/105/299/218/vouchers/banner-tpbank-v2.png?v=1701776042000
 */
export function getMediaResizedImage(src: string, type: ResizedImageType) {
  const url = parseSapoUrl(src);
  if (!url) {
    return src;
  }
  if (url.pathname.toLowerCase().endsWith("svg")) {
    return src;
  }
  let pathname = url.pathname;
  if (pathname.startsWith("/thumb/")) {
    pathname = pathname.replace(/^\/thumb\/[^/]+/, "");
  }
  return `${url.origin}/thumb/${type}${pathname}${url.search}`;
}

/** Get media size from src */
export const getMediaSizeFromSrc = (src: string): { originSrc: string; size: ResizedImageType | "" } => {
  const emptyResult = { originSrc: src, size: "" as ResizedImageType | "" };
  const url = parseSapoUrl(src);
  if (!url) {
    return emptyResult;
  }
  const partialSrc = url.pathname.split("/");
  if (!url.pathname.startsWith("/thumb/") || url.pathname.toLowerCase().endsWith("svg")) {
    return emptyResult;
  }
  return {
    originSrc: getOriginalMediaResizedSrc(src),
    size: partialSrc[partialSrc.indexOf("thumb") + 1] as ResizedImageType,
  };
};

export const isSapoCdnUrl = (src: string) => {
  const url = parseSapoUrl(src);
  if (!url) {
    return false;
  }
  return url.hostname === cdnDomain;
};

function parseSapoUrl(
  url: string
): Pick<URL, "host" | "hostname" | "origin" | "protocol" | "pathname" | "search" | "hash" | "port"> | undefined {
  try {
    let doubleSlashUrl = false;
    if (url.startsWith("//")) {
      url = `http:${url}`;
      doubleSlashUrl = true;
    }
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return undefined;
    }

    return {
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      origin: doubleSlashUrl ? `//${parsed.host}` : parsed.origin,
      protocol: doubleSlashUrl ? "" : parsed.protocol,
    };
  } catch (e) {
    return undefined;
  }
}

/**
 * @param url app url
 * @param resources resource ids
 */
export function generateAppLinkUrl(url: string, resourceIds: string[]) {
  const parseUrl = new URL(url);
  resourceIds.forEach((r) => parseUrl.searchParams.append("ids[]", r));
  return parseUrl.toString();
}
