import { useSelector } from "src/types";

export function useCurrentUser() {
  const user = useSelector((state) => state.auth.account);
  if (!user) {
    throw new Error("Current user is not be initialized");
  }

  return user;
}
