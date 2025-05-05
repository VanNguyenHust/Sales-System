import { Tourguide } from "./tourguide";
import { CurrentUser } from "./user";

export interface AuthState {
  isLoading: boolean;
  account: CurrentUser["user"];
  tourGuides: Tourguide[];
}
