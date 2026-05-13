import { useState } from "react";

import { useEffect } from "react";

import { useParams, Link } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";

import {
  createTestRunVersion,
  getTestRunVersions,
} from "@/utils/api/testrunversion.api";

import {
  getTestRunsByVersion,
  updateTestRun,
} from "@/utils/api/testrun.api";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

import { getTestCases } from "@/utils/api/testcase.api";

import { BugModal } from "@/components/BugModal";

import { useAuth } from "@/context/AuthContext";

import { can } from "@/utils/api/permissions";

export default function TestRun() {

  const {
    projectId,
    moduleId,
    screenId,
  } = useParams();

  const { user } = useAuth();

  const role = user?.role || "";

  const [testResults, setTestResults] =
    useState<any>({});

  const [bugModalOpen, setBugModalOpen] =
    useState(false);

  const [selectedTestCase, setSelectedTestCase] =
    useState<any>(null);

  const [
    isActualModalOpen,
    setIsActualModalOpen,
  ] = useState(false);

  const [selectedTc, setSelectedTc] =
    useState<any>(null);

  const [actualValue, setActualValue] =
    useState("");

  const [selectedVersion, setSelectedVersion] =
    useState("");

  // =========================================
  // TEST CASES
  // =========================================

  const { data } = useQuery({

    queryKey: ["testcases", screenId],

    queryFn: () =>
      getTestCases(screenId as string),

    enabled: !!screenId,

  });

  const testCases = Array.isArray(data)
    ? data
    : data?.results || [];

  // =========================================
  // VERSIONS
  // =========================================

  const { data: versionsData } = useQuery({

    queryKey: ["testrunversions"],

    queryFn: getTestRunVersions,

  });

  const versions = Array.isArray(
    versionsData
  )
    ? versionsData
    : versionsData?.results || [];

   useEffect(() => {

  if (
    versions.length > 0 &&
    !selectedVersion
  ) {

    setSelectedVersion(
      versions[0].uuid
    );

  }

}, [versions]);

  // =========================================
  // TEST RUNS
  // =========================================

  const { data: runsData, refetch } =
    useQuery({

      queryKey: [
        "testruns",
        selectedVersion,
      ],

      queryFn: () =>
        getTestRunsByVersion(
          selectedVersion
        ),

      enabled: !!selectedVersion,

    });

  const testRuns = Array.isArray(runsData)
    ? runsData
    : runsData?.results || [];

  // =========================================
  // PASS
  // =========================================

  const handlePassChange = (
    tcId: string,
    checked: boolean
  ) => {

    setTestResults((prev: any) => ({

      ...prev,

      [tcId]: {

        ...prev[tcId],

        pass: checked,

        fail: checked
          ? false
          : prev[tcId]?.fail,

      },

    }));

  };

  // =========================================
  // FAIL
  // =========================================

  const handleFailChange = (
    tc: any,
    checked: boolean
  ) => {

    setTestResults((prev: any) => ({

      ...prev,

      [tc.uuid]: {

        ...prev[tc.uuid],

        pass: checked
          ? false
          : prev[tc.uuid]?.pass,

        fail: checked,

      },

    }));

    if (checked) {

      setSelectedTestCase(tc);

      setBugModalOpen(true);

    }

  };

  // =========================================
  // ACTUAL
  // =========================================

  const handleActualChange = (
    tcId: string,
    value: string
  ) => {

    setTestResults((prev: any) => ({

      ...prev,

      [tcId]: {

        ...prev[tcId],

        actual: value,

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
              <Link to="/projects">
                Projects
              </Link>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>

              <Link
                to={`/projects/${projectId}/modules`}
              >
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

              <BreadcrumbPage>
                Test Run
              </BreadcrumbPage>

            </BreadcrumbItem>

          </BreadcrumbList>

        </Breadcrumb>

        {/* HEADER */}

        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-semibold">
            Test Run
          </h1>

          <div className="flex gap-3">

            {/* VERSION SELECT */}

            <select

              value={selectedVersion}

              onChange={(e) =>
                setSelectedVersion(
                  e.target.value
                )
              }

              className="
                border
                rounded-xl
                px-4
                py-2
                bg-white
              "
            >

              <option value="">
                Select Version
              </option>

              {versions.map((version: any) => (

                <option
                  key={version.uuid}
                  value={version.uuid}
                >
                  {version.version_number}
                </option>

              ))}

            </select>

          </div>

        </div>

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
                  Expected
                </th>

                <th className="p-3 text-center">
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

             {testRuns.map((tc: any) => (

                <tr
                  key={tc.uuid}
                  className="border-b"
                >

                  <td className="p-3">
                    {tc.uuid.slice(0, 6)}
                  </td>

                  <td className="p-3">
                    {tc.title}
                  </td>

                  <td className="p-3">
                    {tc.expected_results}
                  </td>

                  {/* ACTUAL */}

                  <td className="p-3 text-center">

                    <button

                      disabled={
                        !can(
                          role,
                          "testruns",
                          "update"
                        )
                      }

                      onClick={() => {

                        setSelectedTc(tc);

                        setActualValue(
                          testResults[tc.uuid]
                            ?.actual || ""
                        );

                        setIsActualModalOpen(
                          true
                        );

                      }}

                      className="
                        border
                        px-4
                        py-2
                        rounded-lg
                      "
                    >

                      {testResults[tc.uuid]
                        ?.actual || "Add +"}

                    </button>

                  </td>

                  {/* PASS */}

                  <td className="text-center">

                    <button

                      disabled={
                        !can(
                          role,
                          "testruns",
                          "update"
                        )
                      }

                      onClick={() =>
                        handlePassChange(
                          tc.uuid,
                          !testResults[
                            tc.uuid
                          ]?.pass
                        )
                      }

                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition

                        ${
                          testResults[tc.uuid]
                            ?.pass
                            ? "bg-green-600"
                            : "bg-gray-300"
                        }
                      `}
                    >

                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition

                          ${
                            testResults[
                              tc.uuid
                            ]?.pass
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
                        !can(
                          role,
                          "testruns",
                          "update"
                        )
                      }

                      onClick={() =>
                        handleFailChange(
                          tc,
                          !testResults[
                            tc.uuid
                          ]?.fail
                        )
                      }

                      className={`relative inline-flex h-6 w-12 items-center rounded-full transition

                        ${
                          testResults[tc.uuid]
                            ?.fail
                            ? "bg-red-600"
                            : "bg-gray-300"
                        }
                      `}
                    >

                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition

                          ${
                            testResults[
                              tc.uuid
                            ]?.fail
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

      {/* ACTUAL MODAL */}

      {isActualModalOpen && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[500px]">

            <textarea

              value={actualValue}

              onChange={(e) =>
                setActualValue(
                  e.target.value
                )
              }

              className="
                border
                w-full
                p-3
                rounded
                min-h-[150px]
              "
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() =>
                  setIsActualModalOpen(
                    false
                  )
                }
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

                    await updateTestRun({

                      uuid: selectedTc.uuid,

                      data: {

                        run_status:
                          testResults[
                            selectedTc.uuid
                          ]?.fail
                            ? "failed"
                            : testResults[
                                selectedTc.uuid
                              ]?.pass
                            ? "passed"
                            : "not_started",

                        actual_result:
                          actualValue,

                        notes:
                          "Executed",

                      },

                    });

                    setIsActualModalOpen(
                      false
                    );

                  } catch (err) {

                    console.error(err);

                  }

                }}

                className="
                  bg-black
                  text-white
                  px-4
                  py-2
                  rounded
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
        onClose={() =>
          setBugModalOpen(false)
        }
        testCase={selectedTestCase}
        projectId={projectId}
        moduleId={moduleId}
        screenId={screenId}
        actualResult={
          testResults[selectedTestCase?.uuid]
            ?.actual
        }
      />

    </div>

  );

}