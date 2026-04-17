import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminroutes";
import AuthRoutes from "./routes/authroutes";

const isAuthenticated = localStorage.getItem("auth") === "true";

export default function Root() {
  return (
    <Routes>

      {/* 🔑 DEFAULT → GO TO LOGIN FIRST */}
      <Route path="/" element={<Navigate to="/auth/login" replace />} />

      {/* AUTH ROUTES */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* PROTECTED ADMIN */}
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <AdminRoutes />
          ) : (
            <Navigate to="/auth/login" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/auth/login" replace />} />

    </Routes>
  );
}