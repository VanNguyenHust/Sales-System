import { useEffect, useState } from "react";

export function useSwitchPagination(changing: boolean) {
  const [isSwitching, setSwitching] = useState(false);

  const beginSwitch = () => {
    setSwitching(true);
  };

  useEffect(() => {
    setSwitching((state) => {
      if (!state) {
        return false;
      }
      if (changing) {
        return true;
      }
      return false;
    });
  }, [changing]);

  return { isSwitching, beginSwitch };
}
