import { useCallback } from "react";

import { Permission } from "src/constants";
import { useSelector } from "src/types";

import { hasSomePermissions as hasPermissions } from "./utils";

type UserPermissionReturn = {
  /**
   * Trả về true nếu user hiện tại có một trong các quyền được liệt kê hoặc user đó có quyền full`
   * */
  hasSomePermissions(perms: Permission[]): boolean;
  /**
   * Trả về danh sách chi nhánh mà user hiện tại có quyền được chỉ định.
   *
   * Trong trường user đó có quyền full`, `undefined` được trả về với ý nghĩa danh sách chi nhánh không bị giới hạn
   * */
  limitedLocationsForPermission(perm: Permission): number[] | undefined;
  /**
   * Trả về danh sách chi nhánh mà user hiện tại có một trong số quyền được chỉ định.
   *
   * Trong trường user đó có quyền full`, `undefined` được trả về với ý nghĩa danh sách chi nhánh không bị giới hạn
   * */
  limitedLocationsForSomePermissions(perm: Permission[]): number[] | undefined;
  /**
   * Trả về true nếu user hiện tại được phân quyền chỉ định vào chi nhánh
   * */
  hasLocationPermission(locationId: number, perm: Permission): boolean;
  hasSomeLocationPermissions(locationId: number, permissions: Permission[]): boolean;
};

/** Hook util hỗ trợ check phân quyền */
export function usePermission(): UserPermissionReturn {
  const {
    account: { permissions, user_permissions },
  } = useSelector((state) => state.auth);

  const hasSomePermissions: UserPermissionReturn["hasSomePermissions"] = useCallback(
    (perms) => hasPermissions(permissions, perms),
    [permissions]
  );

  const limitedLocationsForPermission: UserPermissionReturn["limitedLocationsForPermission"] = useCallback(
    (perm) => {
      if (permissions.includes("full")) {
        return undefined;
      }
      const limitedLocations: number[] = [];
      for (const detailPerm of user_permissions) {
        if (detailPerm.merge_permissions.includes(perm)) {
          limitedLocations.push(detailPerm.location_id);
        }
      }
      return limitedLocations;
    },
    [permissions, user_permissions]
  );

  const limitedLocationsForSomePermissions: UserPermissionReturn["limitedLocationsForSomePermissions"] = useCallback(
    (perms) => {
      if (permissions.includes("full")) {
        return undefined;
      }
      const limitedLocations: number[] = [];
      for (const detailPerm of user_permissions) {
        if (perms.some((perm) => detailPerm.merge_permissions.includes(perm))) {
          limitedLocations.push(detailPerm.location_id);
        }
      }
      return limitedLocations;
    },
    [permissions, user_permissions]
  );

  const hasLocationPermission: UserPermissionReturn["hasLocationPermission"] = useCallback(
    (locationId, perm) => {
      if (permissions.includes("full")) {
        return true;
      }
      for (const detailPerm of user_permissions) {
        if (detailPerm.merge_permissions.includes(perm) && locationId === detailPerm.location_id) {
          return true;
        }
      }
      return false;
    },
    [permissions, user_permissions]
  );

  const hasSomeLocationPermissions: UserPermissionReturn["hasSomeLocationPermissions"] = useCallback(
    (locationId, requestPermissions) => {
      if (permissions.includes("full")) {
        return true;
      }
      const locationPermissionInfo = user_permissions.find((item: any) => item.location_id === locationId);
      if (!locationPermissionInfo) return false;
      return requestPermissions.some((perm) => locationPermissionInfo.merge_permissions.includes(perm));
    },
    [permissions, user_permissions]
  );

  return {
    hasSomePermissions,
    limitedLocationsForPermission,
    hasLocationPermission,
    limitedLocationsForSomePermissions,
    hasSomeLocationPermissions,
  };
}
