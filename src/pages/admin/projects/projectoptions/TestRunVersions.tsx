import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Search,
  Eye,
  MoreVertical,
  Layers3,
  CheckCircle2,
  FileText,
  PlayCircle,
} from "lucide-react";

const TestRunVersions = () => {
  const [versions, setVersions] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [screens, setScreens] = useState<any[]>([]);

  const [openModal, setOpenModal] = useState(false);

  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    project_id: "",
    module_id: "",
    screen_id: "",
    version_number: "",
    version_status: "draft",
    notes: "",
  });

  useEffect(() => {
    fetchVersions();
    fetchProjects();
  }, []);

  const fetchVersions = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/test-run-versions/"
      );

      setVersions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/projects/"
      );

      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchModules = async (projectId: string) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/modules/?project=${projectId}`
      );

      setModules(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchScreens = async (moduleId: string) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/screens/?module=${moduleId}`
      );

      setScreens(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const createVersion = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/test-run-versions/",
        formData
      );

      fetchVersions();

      setOpenModal(false);

      setFormData({
        project_id: "",
        module_id: "",
        screen_id: "",
        version_number: "",
        version_status: "draft",
        notes: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const filteredVersions = versions.filter((version) =>
    version.version_number
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Test Run Versions
        </h1>

        <p className="text-gray-500 mt-2">
          Create and manage test run versions.
        </p>
      </div>

      {/* STATS CARDS */}

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
                (v) => v.version_status === "published"
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
                (v) => v.version_status === "draft"
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
            248
          </h2>

          <p className="text-gray-500 mt-2">
            Total Executions
          </p>
        </div>
      </div>

      {/* SEARCH + BUTTON */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <div className="bg-white rounded-2xl px-5 py-4 flex items-center gap-3 w-full md:w-[400px] border">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search by version number..."
            className="outline-none bg-transparent w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-medium"
        >
          + Create New Version
        </button>
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
              filteredVersions.map((version) => (
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
                        version.version_status === "published"
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

                  <td className="px-6 py-5 flex gap-3">

                    <Eye
                      size={18}
                      className="cursor-pointer"
                    />

                    <MoreVertical
                      size={18}
                      className="cursor-pointer"
                    />

                  </td>
                </tr>
              ))
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

          <div className="bg-white rounded-3xl w-[700px] p-8">

            <div className="flex justify-between items-center mb-8">

              <h2 className="text-2xl font-bold">
                Create New Test Run Version
              </h2>

              <button
                onClick={() => setOpenModal(false)}
                className="text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5">

              {/* PROJECT */}

              <select
                className="border rounded-xl p-4"
                value={formData.project_id}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    project_id: e.target.value,
                  });

                  fetchModules(e.target.value);
                }}
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.uuid}
                    value={project.uuid}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              {/* MODULE */}

              <select
                className="border rounded-xl p-4"
                value={formData.module_id}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    module_id: e.target.value,
                  });

                  fetchScreens(e.target.value);
                }}
              >
                <option value="">
                  Select Module
                </option>

                {modules.map((module) => (
                  <option
                    key={module.uuid}
                    value={module.uuid}
                  >
                    {module.name}
                  </option>
                ))}
              </select>

              {/* SCREEN */}

              <select
                className="border rounded-xl p-4"
                value={formData.screen_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    screen_id: e.target.value,
                  })
                }
              >
                <option value="">
                  Select Screen
                </option>

                {screens.map((screen) => (
                  <option
                    key={screen.uuid}
                    value={screen.uuid}
                  >
                    {screen.name}
                  </option>
                ))}
              </select>

              {/* VERSION NUMBER */}

              <input
                type="text"
                placeholder="Version Number"
                className="border rounded-xl p-4"
                value={formData.version_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    version_number: e.target.value,
                  })
                }
              />

              {/* STATUS */}

              <select
                className="border rounded-xl p-4"
                value={formData.version_status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    version_status: e.target.value,
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

            {/* NOTES */}

            <textarea
              placeholder="Notes"
              className="border rounded-xl p-4 w-full mt-5 h-32"
              value={formData.notes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notes: e.target.value,
                })
              }
            />

            {/* INFO */}

            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mt-5">

              <p className="text-sm text-blue-700">
                This will copy all test cases
                from selected screen and create
                execution runs.
              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setOpenModal(false)}
                className="px-6 py-3 border rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={createVersion}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
              >
                Create Version
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunVersions;