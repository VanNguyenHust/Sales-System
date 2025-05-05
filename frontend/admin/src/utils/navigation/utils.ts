import { type To } from "react-router-dom";

import { toQueryString } from "../url";

import { NavigateTo, ToResource } from "./types";

export function resolveTo(to: NavigateTo): To {
  if (isResourcePath(to)) {
    let path = `/admin/${to.name}`;
    if (to.resource) {
      path = to.resource.create ? `/admin/${to.name}/create` : `/admin/${to.name}/${to.resource.id}`;
    }
    if (to.search) {
      path = `${path}${to.search}`;
    } else if (to.params) {
      path = `${path}${toQueryString(to.params)}`;
    }
    return path;
  } else {
    return to;
  }
}

function isResourcePath(to: NavigateTo): to is ToResource {
  return typeof to === "object" && "name" in to;
}
