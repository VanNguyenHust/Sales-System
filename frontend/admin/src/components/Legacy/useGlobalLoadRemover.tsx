import { useEffect } from "react";

import { isLegacyPath } from "app/features/admin/routes";

export function useGlobalLoadRemover() {
  useEffect(() => {
    const content = document.querySelector("#content");
    if (content && !isLegacyPath(location.pathname)) {
      content.remove();
    }
  }, []);
}
