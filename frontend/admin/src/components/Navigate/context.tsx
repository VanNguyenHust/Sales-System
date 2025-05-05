import { createContext } from "react";

export interface NavigateContextType {
  /** Link được dùng để trở lại màn danh sách từ màn chi tiết, query url trước đó của màn danh sách sẽ được khôi phục  */
  backLink?: string;
  /** Link được dùng để trở lại sau khi đóng modal setting  */
  previousSettingLink?: string;
}

export const NavigateContext = createContext<NavigateContextType | undefined>(undefined);
