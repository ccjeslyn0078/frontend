import { Routes, Route, Navigate } from "react-router-dom";
import { ProjectsPage } from "@/pages/admin/projects/ProjectsPage";
import { Layout } from "@/components/layout/AppLayout";
import { SelectionView } from "../pages/admin/projects/projectoptions/SelectionView";
import { TestCaseList } from "../pages/admin/projects/projectoptions/TestCasesPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        {/* Default */}
        <Route path="/" element={<Navigate to="/projects" />} />

        {/* Step 1: Projects */}
        <Route path="/projects" element={<ProjectsPage />} />

        {/* Step 2: Selection Page */}
        <Route
          path="/projects/:projectId/:option"
          element={<SelectionView />}
        />

        {/* Step 3: Final Pages (nested deeper) */}
        <Route
          path="/projects/:projectId/:option/:moduleId/test-cases"
          element={<TestCaseList />}
        />

        {/* Add these too (IMPORTANT for your options) */}
        <Route
          path="/projects/:projectId/:option/:moduleId/test-run"
          element={<div>Test Run Page</div>}
        />

        <Route
          path="/projects/:projectId/:option/:moduleId/bugs"
          element={<div>Bugs Page</div>}
        />

        {/* Catch */}
        <Route path="*" element={<Navigate to="/projects" />} />
      </Route>
    </Routes>
  );
}