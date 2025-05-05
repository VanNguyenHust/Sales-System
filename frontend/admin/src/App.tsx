import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { AdminSkeleton } from "./features/admin/components/AdminSkeleton";

export function App() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <Outlet />
    </Suspense>
  );
}
