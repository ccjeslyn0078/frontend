import { useState } from "react";
import { useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

import {
  mockTestCases,
  mockProjects,
  mockModules,
  mockScreens,
} from "../../../../data/mockData";

import { BugModal } from "@/components/BugModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function TestRun() {
  const { projectId, moduleId, screenId } = useParams();

  const [testResults, setTestResults] = useState<
    Record<string, { pass: boolean; fail: boolean; actualResult: string }>
  >({});

  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);

  const project = mockProjects.find((p) => String(p.id) === String(projectId));
  const module = mockModules.find((m) => String(m.id) === String(moduleId));
  const screen = mockScreens.find((s) => String(s.id) === String(screenId));

  const testCases =
    mockTestCases.filter(
      (tc) => String(tc.screenId) === String(screenId)
    ).length > 0
      ? mockTestCases.filter(
          (tc) => String(tc.screenId) === String(screenId)
        )
      : mockTestCases;

  const handlePassChange = (tcId: string, checked: boolean) => {
    setTestResults((prev) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        pass: checked,
        fail: checked ? false : prev[tcId]?.fail || false,
        actualResult: prev[tcId]?.actualResult || "",
      },
    }));
  };

  const handleFailChange = (
    tcId: string,
    checked: boolean,
    testCase: any
  ) => {
    setTestResults((prev) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        pass: checked ? false : prev[tcId]?.pass || false,
        fail: checked,
        actualResult: prev[tcId]?.actualResult || "",
      },
    }));

    if (checked) {
      setSelectedTestCase(testCase);
      setBugModalOpen(true);
    }
  };

  const handleActualResultChange = (tcId: string, value: string) => {
    setTestResults((prev) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        actualResult: value,
        pass: prev[tcId]?.pass || false,
        fail: prev[tcId]?.fail || false,
      },
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-sm text-gray-500 flex items-center gap-2">

            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/projects/${projectId}/modules`}>
                {project?.name || "Project"}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink href={`/projects/${projectId}/modules/${moduleId}/screens`}>
                {module?.name || "Module"}
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>
                {screen?.name || "Screen"}
              </BreadcrumbPage>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Test Run</BreadcrumbPage>
            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Test Run
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Execute and record test case results
          </p>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">

              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">TC ID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Expected</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actual</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Pass</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Fail</th>
                </tr>
              </thead>

              <tbody>
                {testCases.map((tc) => (
                  <tr key={tc.id} className="border-b hover:bg-gray-50">

                    <td className="px-6 py-4">{tc.id}</td>
                    <td className="px-6 py-4">{tc.title}</td>
                    <td className="px-6 py-4">{tc.description}</td>
                    <td className="px-6 py-4">{tc.expectedResult}</td>

                    {/* ✅ FIXED TEXTAREA */}
                    <td className="px-6 py-4">
                      <Textarea
                        value={testResults[tc.id]?.actualResult || ""}
                        onChange={(e) =>
                          handleActualResultChange(tc.id, e.target.value)
                        }
                        placeholder="Enter actual result..."
                        className="w-[220px] h-[80px] resize-none overflow-auto text-sm"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(tc.priority)}`}>
                        {tc.priority}
                      </span>
                    </td>

                    <td className="text-center">
                      <Checkbox
                        checked={testResults[tc.id]?.pass || false}
                        onCheckedChange={(checked) =>
                          handlePassChange(tc.id, checked as boolean)
                        }
                      />
                    </td>

                    <td className="text-center">
                      <Checkbox
                        checked={testResults[tc.id]?.fail || false}
                        onCheckedChange={(checked) =>
                          handleFailChange(tc.id, checked as boolean, tc)
                        }
                      />
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>

      </div>

      <BugModal
        isOpen={bugModalOpen}
        onClose={() => setBugModalOpen(false)}
        testCase={selectedTestCase}
      />
    </div>
  );
}