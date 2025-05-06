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
