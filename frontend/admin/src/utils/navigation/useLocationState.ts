import { useLocation } from "react-router-dom";

import { NavigateState } from "./state";

export function useLocationState(): NavigateState {
  const { state } = useLocation();

  return state ?? {};
}
