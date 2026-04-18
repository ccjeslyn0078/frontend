import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminroutes";
import AuthRoutes from "./routes/authroutes";
import { useAuth } from "./context/AuthContext";

export default function Root() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>

      {/* 🔑 DEFAULT → GO TO LOGIN FIRST */}

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