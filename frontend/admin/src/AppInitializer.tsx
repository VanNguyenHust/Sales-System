import { useStoreInfo } from "./features/auth/useStoreInfo";

const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  useStoreInfo();
  return <>{children}</>;
};

export default AppInitializer;
