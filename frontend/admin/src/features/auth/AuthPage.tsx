import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem("admin_token", token || "");
    navigate("/admin/dashboard");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5faff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>Đang xác thực...</div>
    </div>
  );
}
