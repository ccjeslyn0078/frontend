import React, { useState } from "react";

import { Link, useParams } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import API from "@/utils/api/fetchclient";

import {
  createTestRunVersion,
  getTestRunVersions,
  updateTestRunVersion,
  deleteTestRunVersion,
} from "@/utils/api/testrunversion.api";

import {
  getRole,
  can,
} from "../../../../utils/api/permissions";

import {
  Search,
  Pencil,
  Trash2,
  Layers3,
  CheckCircle2,
  FileText,
  PlayCircle,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

const TestRunVersions = () => {

  const queryClient =
    useQueryClient();

  const {
    projectId,
    moduleId,
    screenId,
  } = useParams();

  const [projects, setProjects] =
    useState<any[]>([]);

  const [modules, setModules] =
    useState<any[]>([]);

  const [screens, setScreens] =
    useState<any[]>([]);

  const [openModal, setOpenModal] =
    useState(false);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [
    editingVersionId,
    setEditingVersionId,
  ] = useState("");

  const [search, setSearch] =
    useState("");

  const role = getRole();

  const [formData, setFormData] =
    useState({

      project_id: "",

      module_id: "",

      screen: "",

      version_number: "",

      version_status: "draft",

      notes: "",

    });

  // =========================================
  // GET VERSIONS
  // =========================================

const {
  data,
  isLoading,
} = useQuery({

  queryKey: [
    "testrunversions",
    screenId,
  ],

  queryFn: () =>
    getTestRunVersions(),

  staleTime:
    1000 * 60 * 5,

  refetchOnWindowFocus:
    false,

});

const versions =
  Array.isArray(data)
    ? data
    : data?.results || [];

  // =========================================
  // CREATE MUTATION
  // =========================================

  const createMutation =
    useMutation({

      mutationFn:
        createTestRunVersion,

      onSuccess: () => {

        queryClient.invalidateQueries({

          queryKey: [
            "testrunversions",
          ],

        });

        resetForm();

      },

    });

  // =========================================
  // UPDATE MUTATION
  // =========================================

  const updateMutation =
    useMutation({

      mutationFn:
        updateTestRunVersion,

      onSuccess: () => {

        queryClient.invalidateQueries({

          queryKey: [
            "testrunversions",
          ],

        });

        alert(
          "Version Updated Successfully"
        );

        resetForm();

      },

    });

  // =========================================
  // DELETE MUTATION
  // =========================================

  const deleteMutation =
    useMutation({

      mutationFn:
        deleteTestRunVersion,

      onMutate: async (
        uuid: string
      ) => {

        await queryClient.cancelQueries({

          queryKey: [
            "testrunversions",
          ],

        });

        const previousVersions =
          queryClient.getQueryData([
            "testrunversions",
            screenId,
          ]);

        queryClient.setQueryData(
          [
            "testrunversions",
            screenId,
          ],
          (old: any) =>

            old?.filter(
              (v: any) =>
                v.uuid !== uuid
            ) || []
        );

        return {
          previousVersions,
        };

      },

      onError: (
        err,
        uuid,
        context: any
      ) => {

        queryClient.setQueryData(
          [
            "testrunversions",
            screenId,
          ],
          context.previousVersions
        );

      },

      onSettled: () => {

        queryClient.invalidateQueries({

          queryKey: [
            "testrunversions",
          ],

        });

      },

    });

  // =========================================
  // FETCH PROJECTS
  // =========================================

  const fetchProjects = async () => {

    try {

      const res = await API(
        "/projects/",
        {
          method: "GET",
        }
      );

      setProjects(
        Array.isArray(res)
          ? res
          : res?.results || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // =========================================
  // FETCH MODULES
  // =========================================

  const fetchModules = async (
    projectId: string
  ) => {

    try {

      const res = await API(
        `/modules/?project=${projectId}`,
        {
          method: "GET",
        }
      );

      setModules(
        Array.isArray(res)
          ? res
          : res?.results || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // =========================================
  // FETCH SCREENS
  // =========================================

  const fetchScreens = async (
    moduleId: string
  ) => {

    try {

      const res = await API(
        `/screens/?module=${moduleId}`,
        {
          method: "GET",
        }
      );

      setScreens(
        Array.isArray(res)
          ? res
          : res?.results || []
      );

    } catch (err) {

      console.log(err);

    }

  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {

    setOpenModal(false);

    setIsEditMode(false);

    setEditingVersionId("");

    setModules([]);

    setScreens([]);

    setFormData({

      project_id: "",

      module_id: "",

      screen: "",

      version_number: "",

      version_status: "draft",

      notes: "",

    });

  };

  // =========================================
  // CREATE VERSION
  // =========================================

  const createVersion = async () => {

    try {

    createMutation.mutate({

  screen:
    formData.screen,

});

    } catch (err) {

      console.log(err);

      alert(
        "Failed to create version"
      );

    }

  };

  // =========================================
  // UPDATE VERSION
  // =========================================

  const updateVersion = async () => {

    try {

      updateMutation.mutate({

        uuid:
          editingVersionId,

        data: {

          screen:
            formData.screen,

          version_number:
            formData.version_number,

          version_status:
            formData.version_status,

          notes:
            formData.notes,

        },

      });

    } catch (err) {

      console.log(err);

      alert(
        "Failed to update version"
      );

    }

  };

  // =========================================
  // DELETE VERSION
  // =========================================

  const deleteVersion = async (
    uuid: string
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this version?"
      );

    if (!confirmDelete) return;

    deleteMutation.mutate(
      uuid
    );

  };

  // =========================================
  // FILTERED DATA
  // =========================================

 const filteredVersions =
  Array.isArray(versions)
    ? versions.filter(
        (version: any) =>
          version.version_number
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      )
    : [];

  if (isLoading) {

    return (

      <div className="p-8">
        Loading...
      </div>

    );

  }

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* BREADCRUMB */}

      <Breadcrumb className="mb-6">

        <BreadcrumbList>

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
              Test Run Versions
            </BreadcrumbPage>

          </BreadcrumbItem>

        </BreadcrumbList>

      </Breadcrumb>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Test Run Versions
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage test run versions.
        </p>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">

            <Layers3 className="text-blue-600" />

          </div>

          <h2 className="text-3xl font-bold">
            {versions.length}
          </h2>

          <p className="text-gray-500 mt-2">
            Total Versions
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">

            <CheckCircle2 className="text-green-600" />

          </div>

          <h2 className="text-3xl font-bold">

            {
              versions.filter(
                (v: any) =>
                  v.version_status ===
                  "published"
              ).length
            }

          </h2>

          <p className="text-gray-500 mt-2">
            Published
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-5">

            <FileText className="text-yellow-600" />

          </div>

          <h2 className="text-3xl font-bold">

            {
              versions.filter(
                (v: any) =>
                  v.version_status ===
                  "draft"
              ).length
            }

          </h2>

          <p className="text-gray-500 mt-2">
            Drafts
          </p>

        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-5">

            <PlayCircle className="text-purple-600" />

          </div>

          <h2 className="text-3xl font-bold">
            {
              versions.reduce(
                (
                  sum: number,
                  version: any
                ) =>
                  sum +
                  (
                    version.total_executions || 0
                  ),
                0
              )
            }
          </h2>

          <p className="text-gray-500 mt-2">
            Total Executions
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 w-full md:w-[400px] border">

          <Search
            size={18}
            className="text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by version number..."
            className="outline-none bg-transparent w-full"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        {can(
          role!,
          "testruns",
          "create"
        ) && (

          <button
            onClick={async () => {

              resetForm();

              await fetchProjects();

              setOpenModal(true);

            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-medium"
          >
            + Create New Version
          </button>

        )}

      </div>

      {/* TABLE */}

      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border">

        <table className="w-full">

          <thead className="bg-gray-50 text-gray-500 text-sm">

            <tr>

              <th className="text-left px-6 py-5">
                Version Number
              </th>

              <th className="text-left px-6 py-5">
                Status
              </th>

              <th className="text-left px-6 py-5">
                Created At
              </th>

              <th className="text-left px-6 py-5">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredVersions.length > 0 ? (

              filteredVersions.map(
                (version: any) => (

                  <tr
                    key={version.uuid}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-5 font-medium">
                      {version.version_number}
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          version.version_status ===
                          "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >

                        {version.version_status}

                      </span>

                    </td>

                    <td className="px-6 py-5">

                      {new Date(
                        version.created_at
                      ).toLocaleDateString()}

                    </td>

                    <td className="px-6 py-5">

                      <div className="flex gap-4">

                        {can(
                          role!,
                          "testruns",
                          "update"
                        ) && (

                          <button
                            onClick={async (e) => {

                              e.stopPropagation();

                              setIsEditMode(true);

                              setEditingVersionId(
                                version.uuid
                              );

                              setFormData({

                                project_id:
                                  version.project || "",

                                module_id:
                                  version.module || "",

                                screen:
                                  version.screen || "",

                                version_number:
                                  version.version_number || "",

                                version_status:
                                  version.version_status || "draft",

                                notes:
                                  version.notes || "",

                              });

                              await fetchModules(
                                version.project
                              );

                              await fetchScreens(
                                version.module
                              );

                              setOpenModal(true);

                            }}
                            className="text-blue-600"
                          >

                            <Pencil size={18} />

                          </button>

                        )}

                        {can(
                          role!,
                          "testruns",
                          "delete"
                        ) && (

                          <button
                            onClick={(e) => {

                              e.stopPropagation();

                              deleteVersion(
                                version.uuid
                              );

                            }}
                            className="text-red-600"
                          >

                            <Trash2 size={18} />

                          </button>

                        )}

                      </div>

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-20 text-gray-400"
                >

                  No test run versions found.

                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {openModal && (

        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

          <div className="bg-white rounded-3xl w-[900px] max-w-[95vw] p-8 shadow-xl">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">

                {isEditMode
                  ? "Edit Test Run Version"
                  : "Create New Test Run Version"}

              </h2>

              <button
                onClick={resetForm}
                className="text-2xl"
              >
                ×
              </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <select
                className="border rounded-xl p-4"
                value={formData.project_id}
                onChange={async (e) => {

                  const value =
                    e.target.value;

                  setFormData({

                    ...formData,

                    project_id: value,

                    module_id: "",

                    screen: "",

                  });

                  await fetchModules(
                    value
                  );

                }}
              >

                <option value="">
                  Select Project
                </option>

                {projects.map((project: any) => (

                  <option
                    key={project.uuid}
                    value={project.uuid}
                  >

                    {project.title}

                  </option>

                ))}

              </select>

              <select
                className="border rounded-xl p-4"
                value={formData.module_id}
                onChange={async (e) => {

                  const value =
                    e.target.value;

                  setFormData({

                    ...formData,

                    module_id: value,

                    screen: "",

                  });

                  await fetchScreens(
                    value
                  );

                }}
              >

                <option value="">
                  Select Module
                </option>

                {modules.map((module: any) => (

                  <option
                    key={module.uuid}
                    value={module.uuid}
                  >

                    {module.name}

                  </option>

                ))}

              </select>

              <select
                className="border rounded-xl p-4"
                value={formData.screen}
                onChange={(e) =>

                  setFormData({

                    ...formData,

                    screen:
                      e.target.value,

                  })

                }
              >

                <option value="">
                  Select Screen
                </option>

                {screens.map((screen: any) => (

                  <option
                    key={screen.uuid}
                    value={screen.uuid}
                  >

                    {screen.name}

                  </option>

                ))}

              </select>

              <input
                type="text"
                placeholder="Version Number"
                className="border rounded-xl p-4"
                value={formData.version_number}
                onChange={(e) =>

                  setFormData({

                    ...formData,

                    version_number:
                      e.target.value,

                  })

                }
              />

              <select
                className="border rounded-xl p-4"
                value={formData.version_status}
                onChange={(e) =>

                  setFormData({

                    ...formData,

                    version_status:
                      e.target.value,

                  })

                }
              >

                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

              </select>

            </div>

            <textarea
              placeholder="Notes"
              className="border rounded-xl p-4 w-full mt-5 h-32"
              value={formData.notes}
              onChange={(e) =>

                setFormData({

                  ...formData,

                  notes:
                    e.target.value,

                })

              }
            />

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={resetForm}
                className="px-6 py-3 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={
                  isEditMode
                    ? updateVersion
                    : createVersion
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >

                {isEditMode
                  ? "Update Version"
                  : "Create Version"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default TestRunVersions;