import { useSelector } from "app/types";

export const useAIPermission = () => {
  const tenant = useSelector((state) => state.tenant.tenant);

  const hasAIPermission = !tenant?.plan_name?.toLowerCase().endsWith("trial_v3");

  return { hasAIPermission };
};
