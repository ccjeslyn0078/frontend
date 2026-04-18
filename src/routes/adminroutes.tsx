import { Routes, Route } from "react-router-dom";
import { ProjectsPage } from "@/pages/admin/projects/ProjectsPage";
import Layout from "@/components/layout/AppLayout";
import { SelectionView } from "../pages/admin/projects/projectoptions/SelectionView";
import { TestCaseList } from "../pages/admin/projects/projectoptions/TestCasesPage";

function Dashboard() {
  return <div className="p-6 text-gray-700">Dashboard</div>;
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* ✅ Dashboard (NO redirect) */}
        <Route path="/" element={<Dashboard />} />

        {/* Projects */}
        <Route path="/projects" element={<ProjectsPage />} />

        <Route
          path="/projects/:projectId/:option"
          element={<SelectionView />}
        />

        <Route
          path="/projects/:projectId/:option/:moduleId/test-cases"
          element={<TestCaseList />}
        />

        <Route
          path="/projects/:projectId/:option/:moduleId/test-run"
          element={<div>Test Run Page</div>}
        />

        <Route
          path="/projects/:projectId/:option/:moduleId/bugs"
          element={<div>Bugs Page</div>}
        />
      </Route>
    </Routes>
  );
}