import { Helpdesk } from "./Helpdesk";
import { Notification } from "./Notification";

export function SecondaryMenu() {
  const secondaryMenuMarkup = (
    <>
      <Helpdesk />
      <Notification />
    </>
  );

  return secondaryMenuMarkup;
}
