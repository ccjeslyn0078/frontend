import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminroutes";

// fake auth check (replace later with real logic)
const isAuthenticated = true; 

export default function Root() {
  return (
    <Routes>


      {/* Admin Protected Routes */}
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

      {/* Edge Case 1: Unknown route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}