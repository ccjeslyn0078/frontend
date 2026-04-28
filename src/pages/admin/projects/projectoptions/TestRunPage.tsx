import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { createTestRun } from "@/utils/api/testrun.api";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

import { getTestCases } from "@/utils/api/testcase.api";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { BugModal } from "@/components/BugModal";

import { getRole, can } from "@/utils/api/permissions"; // ✅ added

export default function TestRun() {
  const { projectId, moduleId, screenId } = useParams();

  const role = getRole(); // ✅ ONLY ONCE

  const [testResults, setTestResults] = useState<any>({});
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);

  // FETCH
  const { data } = useQuery({
    queryKey: ["testcases", screenId],
    queryFn: () => getTestCases(screenId as string),
    enabled: !!screenId,
  });

  const testCases = Array.isArray(data) ? data : data?.results || [];

  const handlePassChange = (tcId: string, checked: boolean) => {
    setTestResults((prev: any) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        pass: checked,
        fail: checked ? false : prev[tcId]?.fail,
      },
    }));
  };

  const handleFailChange = (tc: any, checked: boolean) => {
    setTestResults((prev: any) => ({
      ...prev,
      [tc.uuid]: {
        ...prev[tc.uuid],
        pass: checked ? false : prev[tc.uuid]?.pass,
        fail: checked,
      },
    }));

    // OPEN BUG MODAL
    if (checked) {
      setSelectedTestCase(tc);
      setBugModalOpen(true);
    }
  };

  const handleActualChange = (tcId: string, value: string) => {
    setTestResults((prev: any) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        actual: value,
        pass: prev[tcId]?.pass ?? true,
        fail: prev[tcId]?.fail ?? false,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* BREADCRUMB */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="flex gap-2 text-sm text-gray-500">
            <BreadcrumbItem>
              <Link to="/projects">Projects</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={`/projects/${projectId}/modules`}>
                Modules
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to={`/projects/${projectId}/modules/${moduleId}/screens`}>
                Screens
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Test Run</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* HEADER */}
        <h1 className="text-2xl font-semibold mb-4">Test Run</h1>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white border rounded-xl">
          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">TC ID</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Expected</th>
                <th className="p-3 text-left">Actual</th>
                <th className="p-3 text-center">Pass</th>
                <th className="p-3 text-center">Fail</th>
              </tr>
            </thead>

            <tbody>
              {testCases.map((tc: any) => (
                <tr key={tc.uuid} className="border-b">

                  <td className="p-3">{tc.uuid.slice(0, 6)}</td>
                  <td className="p-3">{tc.title}</td>
                  <td className="p-3">{tc.expected_results}</td>

                  {/* ACTUAL */}
                  <td className="p-3">
                    <div className="flex flex-col gap-2">

                      {/* 🔥 DISABLE FOR REVIEWER */}
                      <Textarea
                        disabled={!can(role, "testruns", "update")}
                        value={testResults[tc.uuid]?.actual || ""}
                        onChange={(e) =>
                          handleActualChange(tc.uuid, e.target.value)
                        }
                      />

                      {/* 🔥 DONE BUTTON PERMISSION */}
                      {can(role, "testruns", "create") && (
                        <button
                          onClick={async () => {
                            const result = testResults[tc.uuid];

                            if (!result?.actual) {
                              alert("Enter actual result");
                              return;
                            }

                            try {
                              await createTestRun({
                                test_case: tc.uuid,
                                actual_results: result.actual,
                                status: result.fail ? "fail" : "pass",
                              });
                            } catch (err) {
                              console.error("ERROR:", err);
                            }
                          }}
                          className="self-end bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                        >
                          Done
                        </button>
                      )}

                    </div>
                  </td>

                  {/* 🔥 DISABLE CHECKBOXES FOR REVIEWER */}
                  <td className="text-center">
                    <Checkbox
                      disabled={!can(role, "testruns", "update")}
                      checked={testResults[tc.uuid]?.pass || false}
                      onCheckedChange={(val) =>
                        handlePassChange(tc.uuid, val as boolean)
                      }
                    />
                  </td>

                  <td className="text-center">
                    <Checkbox
                      disabled={!can(role, "testruns", "update")}
                      checked={testResults[tc.uuid]?.fail || false}
                      onCheckedChange={(val) =>
                        handleFailChange(tc, val as boolean)
                      }
                    />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>

      {/* BUG MODAL (unchanged) */}
      <BugModal
        isOpen={bugModalOpen}
        onClose={() => setBugModalOpen(false)}
        testCase={selectedTestCase}
        projectId={projectId}
        moduleId={moduleId}
        screenId={screenId}
        actualResult={testResults[selectedTestCase?.uuid]?.actual}
      />
    </div>
  );
}