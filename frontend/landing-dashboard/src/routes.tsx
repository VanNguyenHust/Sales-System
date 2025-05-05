import LoginStorePage from "./pages/LoginStorePage";
import RegisterStorePage from "./pages/RegisterStorePage";

export const routes = [
  {
    path: "/register",
    element: <RegisterStorePage />,
  },
  {
    path: "/*",
    element: <LoginStorePage />,
  },
];
