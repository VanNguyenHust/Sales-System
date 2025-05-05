import { useCurrentUser } from "./useCurrentUser";
import { useTenant } from "./useTenant";

export function useContactInfo() {
  const {
    tenant: { email: shopEmail },
  } = useTenant();

  const { email: accountEmail } = useCurrentUser();

  return {
    contactEmail: accountEmail ? accountEmail : shopEmail,
    accountHasEmail: !!accountEmail,
  };
}
