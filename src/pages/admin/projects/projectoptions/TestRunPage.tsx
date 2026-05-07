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
import { BugModal } from "@/components/BugModal";

// ✅ UPDATED IMPORT
import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/api/permissions";

export default function TestRun() {
  const { projectId, moduleId, screenId } = useParams();

  // ✅ GET ROLE FROM AUTH CONTEXT
  const { user } = useAuth();
  const role = user?.role || "";

  const [testResults, setTestResults] = useState<any>({});
  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [selectedTestCase, setSelectedTestCase] = useState<any>(null);

  const [isActualModalOpen, setIsActualModalOpen] = useState(false);
  const [selectedTc, setSelectedTc] = useState<any>(null);
  const [actualValue, setActualValue] = useState("");

  const { data } = useQuery({
    queryKey: ["testcases", screenId],
    queryFn: () => getTestCases(screenId as string),
    enabled: !!screenId,
  });

  const testCases = Array.isArray(data)
    ? data
    : data?.results || [];

  // ✅ PASS TOGGLE
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

  // ✅ FAIL TOGGLE
  const handleFailChange = (tc: any, checked: boolean) => {
    setTestResults((prev: any) => ({
      ...prev,
      [tc.uuid]: {
        ...prev[tc.uuid],
        pass: checked ? false : prev[tc.uuid]?.pass,
        fail: checked,
      },
    }));

    if (checked) {
      setSelectedTestCase(tc);
      setBugModalOpen(true);
    }
  };

  // ✅ ACTUAL RESULT
  const handleActualChange = (tcId: string, value: string) => {
    setTestResults((prev: any) => ({
      ...prev,
      [tcId]: {
        ...prev[tcId],
        actual: value,

        // ✅ FIXED AUTO PASS ISSUE
        pass: prev[tcId]?.pass ?? false,
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
              <Link
                to={`/projects/${projectId}/modules/${moduleId}/screens`}
              >
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
        <h1 className="text-2xl font-semibold mb-4">
          Test Run
        </h1>

        {/* TABLE */}
        <div className="overflow-x-auto bg-white border rounded-xl">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr>

                <th className="p-3 text-left">
                  TC ID
                </th>

                <th className="p-3 text-left">
                  Title
                </th>

                <th className="p-3 text-left">
                  Steps
                </th>

                <th className="p-3 text-left">
                  Expected
                </th>

                <th className="p-3 text-center w-[220px]">
                  Actual 
                </th>

                <th className="p-3 text-center">
                  Pass
                </th>

                <th className="p-3 text-center">
                  Fail
                </th>

              </tr>
            </thead>

            <tbody>

              {testCases.map((tc: any) => (

                <tr key={tc.uuid} className="border-b">

                  {/* TC ID */}
                  <td className="p-3">
                    {tc.uuid.slice(0, 6)}
                  </td>

                  {/* TITLE */}
                  <td className="p-3">
                    {tc.title}
                  </td>

                  {/* STEPS */}
                  <td className="p-3">

                    {tc.steps &&
                    typeof tc.steps === "object" ? (

                      <div className="space-y-1">

                        {Object.entries(tc.steps).map(
                          ([key, value]: any) => (

                            <div
                              key={key}
                              className="text-xs"
                            >
                              <span className="font-medium">
                                {key}:
                              </span>{" "}
                              {value}
                            </div>

                          )
                        )}

                      </div>

                    ) : (

                      <span className="text-gray-400 text-xs">
                        No steps
                      </span>

                    )}

                  </td>

                  {/* EXPECTED */}
                  <td className="p-3">
                    {tc.expected_results}
                  </td>

                  {/* ACTUAL */}
                  <td className="p-3 w-[220px] text-center">

                    <button
                      disabled={
                        !can(role, "testruns", "update")
                      }

                      onClick={() => {

                        setSelectedTc(tc);

                        setActualValue(
                          testResults[tc.uuid]?.actual || ""
                        );

                        setIsActualModalOpen(true);

                      }}

                      className="
                        h-9
                        w-[190px]
                        border
                        border-gray-300
                        bg-gray-50
                        text-gray-700
                        rounded-lg
                        hover:bg-gray-100
                        transition
                        text-sm
                        cursor-pointer
                        disabled:opacity-50
                        px-3
                        truncate
                      "
                    >

                      {testResults[tc.uuid]?.actual
                        ? testResults[tc.uuid].actual.length > 18
                          ? testResults[tc.uuid].actual.slice(
                              0,
                              18
                            ) + "..."
                          : testResults[tc.uuid].actual
                        : "Add +"}

                    </button>

                  </td>

                  {/* PASS */}
                  <td className="text-center">

                    <button
                      disabled={
                        !can(role, "testruns", "update")
                      }

                      onClick={() =>
                        handlePassChange(
                          tc.uuid,
                          !testResults[tc.uuid]?.pass
                        )
                      }

                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition cursor-pointer

                        ${
                          testResults[tc.uuid]?.pass
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }

                        disabled:opacity-50
                      `}
                    >

                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition

                          ${
                            testResults[tc.uuid]?.pass
                              ? "translate-x-6"
                              : "translate-x-1"
                          }
                        `}
                      />

                    </button>

                  </td>

                  {/* FAIL */}
                  <td className="text-center">

                    <button
                      disabled={
                        !can(role, "testruns", "update")
                      }

                      onClick={() =>
                        handleFailChange(
                          tc,
                          !testResults[tc.uuid]?.fail
                        )
                      }

                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition cursor-pointer

                        ${
                          testResults[tc.uuid]?.fail
                            ? "bg-red-600"
                            : "bg-gray-300"
                        }

                        disabled:opacity-50
                      `}
                    >

                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition

                          ${
                            testResults[tc.uuid]?.fail
                              ? "translate-x-6"
                              : "translate-x-1"
                          }
                        `}
                      />

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ACTUAL RESULT MODAL */}
      {isActualModalOpen && (

        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[500px] shadow-xl">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold">
                Actual Result
              </h2>

              <button
                onClick={() =>
                  setIsActualModalOpen(false)
                }
                className="text-2xl cursor-pointer"
              >
                ×
              </button>

            </div>

            {/* TEXTAREA */}
            <textarea
              value={actualValue}

              onChange={(e) =>
                setActualValue(e.target.value)
              }

              placeholder="Enter actual result..."

              className="
                border
                w-full
                p-3
                rounded
                min-h-[150px]
                focus:outline-none
                focus:ring-2
                focus:ring-gray-300
              "
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() =>
                  setIsActualModalOpen(false)
                }

                className="
                  px-4
                  py-2
                  border
                  rounded
                  cursor-pointer
                  hover:bg-gray-100
                "
              >
                Cancel
              </button>

              <button
                onClick={async () => {

                  handleActualChange(
                    selectedTc.uuid,
                    actualValue
                  );

                  try {

                    await createTestRun({
                      test_case: selectedTc.uuid,

                      actual_results: actualValue,

                      status:
                        testResults[selectedTc.uuid]
                          ?.fail
                          ? "fail"
                          : testResults[selectedTc.uuid]
                              ?.pass
                          ? "pass"
                          : "pending",
                    });

                    setIsActualModalOpen(false);

                  } catch (err) {
                    console.error(err);
                  }

                }}

                className="
                  bg-gray-900
                  text-white
                  px-4
                  py-2
                  rounded
                  hover:bg-black
                  cursor-pointer
                "
              >
                Done
              </button>

            </div>

          </div>

        </div>

      )}

      {/* BUG MODAL */}
      <BugModal
        isOpen={bugModalOpen}
        onClose={() => setBugModalOpen(false)}
        testCase={selectedTestCase}
        projectId={projectId}
        moduleId={moduleId}
        screenId={screenId}
        actualResult={
          testResults[selectedTestCase?.uuid]?.actual
        }
      />

    </div>
  );
}