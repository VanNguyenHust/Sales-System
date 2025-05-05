import { Permission } from "src/constants";

export function hasSomePermissions(perms: Permission[], requestPerms: Permission[]) {
  if (perms.includes("full")) {
    return true;
  }
  return requestPerms.some((perm) => perms.includes(perm));
}
