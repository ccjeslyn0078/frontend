import { Routes, Route } from "react-router-dom";
import { ProjectsPage } from "@/pages/admin/projects/ProjectsPage";
import Layout from "@/components/layout/AppLayout";
import { TestCaseList } from "../pages/admin/projects/projectoptions/TestCasesPage";
import { Modules } from "@/pages/admin/projects/Modules"; // ✅ IMPORT THIS
import {Screens} from "@/pages/admin/projects/Screens";

function Dashboard() {
  return <div className="p-6 text-gray-700">Dashboard</div>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />

        {/* ✅ Modules Page (AFTER clicking a project) */}
        <Route
          path="/projects/:projectId/modules"
          element={<Modules />}
        />

        {/* Screens */}
        <Route
          path="/projects/:projectId/modules/:moduleId/Screens"
          element={<Screens />}
        />
        
        {/* Test Cases */}
        <Route
          path="/projects/:projectId/:option/:moduleId/test-cases"
          element={<TestCaseList />}
        />

        {/* Test Run */}
        <Route
          path="/projects/:projectId/:option/:moduleId/test-run"
          element={<div>Test Run Page</div>}
        />

        {/* Bugs */}
        <Route
          path="/projects/:projectId/:option/:moduleId/bugs"
          element={<div>Bugs Page</div>}
        />

      </Route>
    </Routes>
  );
}