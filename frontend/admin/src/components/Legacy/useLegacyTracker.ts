import { useEffect } from "react";

import { useToggle } from "app/utils/useToggle";

const TRACKER_ID = "__tracker__";
const POLL_INTERVAL = 50;

/**
 * Because switch between legacy page and react page has lag time to apply css, we use a css-tracker to detect
 */
export function useLegacyTracker() {
  const { value: isSwitching, setTrue, setFalse } = useToggle(true);

  useEffect(() => {
    let legacyTimer: NodeJS.Timeout;
    const trackLegacy = () => {
      setTrue();
      const tracker = document.getElementById(TRACKER_ID);
      if (tracker && tracker.offsetParent === null) {
        setFalse();
      } else {
        legacyTimer = setTimeout(trackLegacy, POLL_INTERVAL);
      }
    };

    trackLegacy();
    return () => {
      legacyTimer && clearTimeout(legacyTimer);
    };
  }, [setFalse, setTrue]);

  return isSwitching;
}
