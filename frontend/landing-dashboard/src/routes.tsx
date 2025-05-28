import ConfirmInvited from "./pages/ConfirmInvited";
import LoginStorePage from "./pages/LoginStorePage";
import RegisterStorePage from "./pages/RegisterStorePage";

export const routes = [
  {
    path: "/register",
    element: <RegisterStorePage />,
  },
  {
    path: "/confirm_invited",
    element: <ConfirmInvited />,
  },
  {
    path: "/*",
    element: <LoginStorePage />,
  },
];
