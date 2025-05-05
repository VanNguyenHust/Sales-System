import { useEffect } from "react";

import { exitLegacyFullscreen, openLegacyFullscreen } from "app/state/reducers";
import { useDispatch } from "app/types";

type Props = {
  fullscreen?: boolean;
};

/**
 * Exit fullscreen when unmount
 */
export function ExitFullscreen({ fullscreen }: Props) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (fullscreen) {
      dispatch(openLegacyFullscreen());
    }
    return () => {
      dispatch(exitLegacyFullscreen());
    };
  }, [dispatch, fullscreen]);
  return null;
}
