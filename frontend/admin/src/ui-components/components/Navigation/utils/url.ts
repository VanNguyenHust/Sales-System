export function normalizePathname(pathname: string) {
  const barePathname = pathname.split("?")[0].split("#")[0];
  return barePathname.endsWith("/") ? barePathname : `${barePathname}/`;
}

export function safeEqual(path1: string, path2: string) {
  return normalizePathname(path1) === normalizePathname(path2);
}

export function safeStartsWith(path: string, prefix: string) {
  return normalizePathname(path).startsWith(normalizePathname(prefix));
}
