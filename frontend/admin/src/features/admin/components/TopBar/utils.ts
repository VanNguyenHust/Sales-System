import { GlobalSearchType } from "app/types";
import { assertUnreachable } from "app/utils/assert";

export function getUrlForItem(id: number, type: GlobalSearchType) {
  switch (type) {
    case GlobalSearchType.Product:
      return `/admin/products/${id}`;
    case GlobalSearchType.Order:
      return `/admin/orders/${id}`;
    case GlobalSearchType.Customer:
      return `/admin/customers/${id}`;
  }
  assertUnreachable(type);
}
