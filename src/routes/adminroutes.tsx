import { Routes, Route, Navigate } from "react-router-dom";
import { ProjectsPage }from "@/pages/admin/projects/ProjectsPage";
import { Layout } from "@/components/layout/AppLayout";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout/>}>
      <Route path="/" element={<Navigate to="/projects" />} />
      <Route path="/projects" element={<ProjectsPage />} />

      {/* Edge case inside admin */}
      <Route path="*" element={<Navigate to="/projects" />} />
      </Route>
    </Routes>
  );
}