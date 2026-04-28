import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Edit, Trash2, Search } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
} from "@/utils/api/bug.api";

import { Modal } from "@/components/ui/Modal";
import { can } from "@/utils/api/permissions";

// ✅ NEW: import auth context
import { useAuth } from "@/context/AuthContext";

export default function BugsPage() {
  const { projectId, moduleId, screenId } = useParams();
  const queryClient = useQueryClient();

  // ✅ GET ROLE FROM CONTEXT (ONLY CHANGE)
  const { user } = useAuth();
  const role = user?.role || "";

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newBug, setNewBug] = useState({
    description: "",
    steps_to_reproduce: "",
    severity: "medium",
    expected_results: "",
    actual_results: "",
  });

  const [editingBug, setEditingBug] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["bugs", screenId],
    queryFn: () => getBugs(screenId as string),
    enabled: !!screenId,
  });

  const bugs = Array.isArray(data) ? data : data?.results || [];

  // CREATE
  const createMutation = useMutation({
    mutationFn: createBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs", screenId] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs", screenId] });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteBug,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs", screenId] });
    },
  });

  const filtered = bugs.filter((b: any) =>
    b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* 🔹 BREADCRUMB */}
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
              <BreadcrumbPage>Bugs</BreadcrumbPage>
            </BreadcrumbItem>

          </BreadcrumbList>
        </Breadcrumb>

        {/* 🔹 HEADER */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-semibold">Bug Tracker</h1>

          {can(role, "bugs", "create") && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              + Report Bug
            </button>
          )}
        </div>

        {/* 🔹 SEARCH */}
        <div className="mb-4 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* 🔹 TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-xl overflow-hidden">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-2 text-left text-xs">Bug ID</th>
                <th className="px-4 py-2 text-left text-xs">TC ID</th>
                <th className="px-4 py-2 text-left text-xs">Title</th>
                <th className="px-4 py-2 text-left text-xs">Steps</th>
                <th className="px-4 py-2 text-left text-xs">Actual</th>
                <th className="px-4 py-2 text-left text-xs">Severity</th>
                <th className="px-4 py-2 text-left text-xs">Status</th>
                <th className="px-4 py-2 text-left text-xs">Assigned</th>
                <th className="px-4 py-2 text-left text-xs">Created</th>
                <th className="px-4 py-2 text-left text-xs">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((bug: any) => (
                <tr key={bug.uuid} className="border-b hover:bg-gray-50">

                  <td className="px-4 py-3">{bug.uuid.slice(0, 6)}</td>

                  <td className="px-4 py-3">
                    {bug.test_case ? bug.test_case.slice(0, 6) : "-"}
                  </td>

                  <td className="px-4 py-3 font-medium">
                    {bug.description}
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {bug.steps_to_reproduce || "N/A"}
                    </p>
                  </td>

                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {bug.actual_results || "N/A"}
                    </p>
                  </td>

                  <td className="px-4 py-3">{bug.severity}</td>

                  <td className="px-4 py-3">{bug.status}</td>

                  <td className="px-4 py-3">
                    {bug.created_by || "N/A"}
                  </td>

                  <td className="px-4 py-3">
                    {bug.created_at
                      ? new Date(bug.created_at).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* 🔥 PERMISSION BASED ACTIONS */}
                  <td className="px-4 py-3 flex gap-2">

                    {can(role, "bugs", "update") && (
                      <button
                        onClick={() => {
                          setEditingBug(bug);
                          setIsEditOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                    )}

                    {can(role, "bugs", "delete") && (
                      <button
                        onClick={() => deleteMutation.mutate(bug.uuid)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* 🔹 CREATE MODAL */}
        {/* 🔹 CREATE MODAL */}
<Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Bug">

  <textarea
    placeholder="Description"
    className="border p-2 w-full mb-2"
    onChange={(e) =>
      setNewBug({ ...newBug, description: e.target.value })
    }
  />

  <textarea
    placeholder="Steps to Reproduce"
    className="border p-2 w-full mb-2"
    onChange={(e) =>
      setNewBug({
        ...newBug,
        steps_to_reproduce: e.target.value,
      })
    }
  />

  {/* ✅ ADD THIS (VERY IMPORTANT) */}
  <div className="mb-2">
    <label className="block text-sm text-gray-600 mb-1">
      Severity
    </label>

    <select
      value={newBug.severity}
      className="w-full border p-2 rounded"
      onChange={(e) =>
        setNewBug({ ...newBug, severity: e.target.value })
      }
    >
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
  </div>

  <input
    placeholder="Expected Results"
    className="border p-2 w-full mb-2"
    onChange={(e) =>
      setNewBug({
        ...newBug,
        expected_results: e.target.value,
      })
    }
  />

  <input
    placeholder="Actual Results"
    className="border p-2 w-full"
    onChange={(e) =>
      setNewBug({
        ...newBug,
        actual_results: e.target.value,
      })
    }
  />

  <button
    onClick={() => {
      console.log("Creating Bug:", newBug); // 🔥 debug

      createMutation.mutate({
        ...newBug,
        project: projectId,
        module: moduleId,
        screen: screenId,
      });

      setIsCreateOpen(false);
    }}
    className="bg-red-600 text-white px-4 py-2 mt-3 rounded"
  >
    Create
  </button>

</Modal>

      </div>
    </div>
  );
}