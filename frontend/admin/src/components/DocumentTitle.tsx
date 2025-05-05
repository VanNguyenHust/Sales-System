import { useEffect } from "react";

import { useSelector } from "app/types";

interface Props {
  title: string;
  /**
   * Relative title với tên shop
   * @default true
   */
  relative?: boolean;
}

export function DocumentTitle({ title: titleProp, relative = true }: Props) {
  const { tenant } = useSelector((state) => state.tenant);

  useEffect(() => {
    document.title = [relative && tenant ? tenant.name : undefined, titleProp].filter(Boolean).join(" | ");
  }, [relative, tenant, titleProp]);
  return null;
}
