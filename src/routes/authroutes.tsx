import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* default */}
      <Route path="" element={<Navigate to="/auth/login" />} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/auth/login" />} />
    </Routes>
  );
}