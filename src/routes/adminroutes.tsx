import { Routes, Route } from "react-router-dom";
import { ProjectsPage } from "@/pages/admin/projects/ProjectsPage";
import Layout from "@/components/layout/AppLayout";
import { Modules } from "@/pages/admin/projects/Modules";
import { Screens } from "@/pages/admin/projects/Screens";
import TestCasesPage from "@/pages/admin/projects/projectoptions/TestCasesPage";
import TestRunPage from "@/pages/admin/projects/projectoptions/TestRunPage";
import BugsPage from "@/pages/admin/projects/projectoptions/BugsPage";

function Dashboard() {
  return <div className="p-6 text-gray-700">Dashboard</div>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Projects list */}
        <Route path="projects" element={<ProjectsPage />} />

        {/* Modules inside a project */}
        <Route
          path="projects/:projectId/modules"
          element={<Modules />}
        />

        {/* Screens inside a module */}
        <Route
          path="projects/:projectId/modules/:moduleId/screens"
          element={<Screens />}
        />

        {/* Test Cases */}
        <Route
          path="projects/:projectId/modules/:moduleId/screens/:screenId/test-cases"
          element={<TestCasesPage />}
        />

        {/* Test Run */}
        <Route
          path="projects/:projectId/modules/:moduleId/screens/:screenId/test-run"
          element={<TestRunPage />}
        />

        {/* Bugs */}
        <Route
          path="projects/:projectId/modules/:moduleId/screens/:screenId/bugs"
          element={<BugsPage />}
        />

      </Route>
    </Routes>
  );
}