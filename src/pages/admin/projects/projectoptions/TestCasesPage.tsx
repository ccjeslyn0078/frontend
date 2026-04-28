import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTestCases,
  createTestCase,
  updateTestCase,
  deleteTestCase,
} from "../../../../utils/api/testcase.api";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

import { Link } from "react-router-dom";
import { getRole, can } from "@/utils/api/permissions";

export default function TestCasesPage() {
  const { projectId, moduleId, screenId } = useParams();
  const queryClient = useQueryClient();

  const role = getRole(); // ✅ ONLY ONCE

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: "",
    description: "",
    expected_results: "",
    priority: "medium",
    status: "open",
    type_of_testcase: "functional",
  });

  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [testcaseToDelete, setTestcaseToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // FETCH
  const { data, isLoading } = useQuery({
    queryKey: ["testcases", screenId],
    queryFn: () => getTestCases(screenId as string),
    enabled: !!screenId,
  });

  const testcases = Array.isArray(data)
    ? data
    : (data as any)?.results || [];

  // CREATE
  const createMutation = useMutation({
    mutationFn: createTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  const filtered = testcases.filter((tc: any) =>
    tc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (p: string) => {
    if (p === "high") return "bg-red-100 text-red-700";
    if (p === "medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getStatusColor = (s: string) => {
    if (s === "completed") return "bg-green-100 text-green-700";
    if (s === "in_progress") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">

      {/* 🔹 BREADCRUMB */}
      <Breadcrumb className="mb-4">
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
            <BreadcrumbPage>Test Cases</BreadcrumbPage>
          </BreadcrumbItem>

        </BreadcrumbList>
      </Breadcrumb>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Test Cases
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and organize your test cases
          </p>
        </div>

        {/* 🔥 CREATE BUTTON CONTROL */}
        {can(role, "testcases", "create") && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4" />
            Create Test Case
          </button>
        )}
      </div>

      {/* SEARCH */}
      <input
        placeholder="Search test cases..."
        className="border rounded-lg px-3 py-2 mb-4 w-full max-w-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm">ID</th>
              <th className="px-6 py-3 text-left text-sm">Title</th>
              <th className="px-6 py-3 text-left text-sm">Description</th>
              <th className="px-6 py-3 text-left text-sm">Expected</th>
              <th className="px-6 py-3 text-left text-sm">Priority</th>
              <th className="px-6 py-3 text-left text-sm">Status</th>
              <th className="px-6 py-3 text-right text-sm">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((tc: any) => (
              <tr key={tc.uuid} className="hover:bg-gray-50">

                <td className="px-6 py-4 font-medium">
                  {tc.uuid.slice(0, 6)}
                </td>

                <td className="px-6 py-4">{tc.title}</td>

                <td className="px-6 py-4 text-gray-600">
                  {tc.description}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {tc.expected_results}
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(tc.priority)}`}>
                    {tc.priority}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(tc.status)}`}>
                    {tc.status}
                  </span>
                </td>

                {/* 🔥 ACTIONS WITH PERMISSIONS */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">

                    {can(role, "testcases", "update") && (
                      <button
                        onClick={() => {
                          setEditingTestCase(tc);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 hover:bg-blue-50 rounded"
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>
                    )}

                    {can(role, "testcases", "delete") && (
                      <button
                        onClick={() => {
                          setTestcaseToDelete(tc);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create TestCase"
      >
        <input
          placeholder="Title"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setNewTestCase({ ...newTestCase, title: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setNewTestCase({ ...newTestCase, description: e.target.value })
          }
        />

        <textarea
          placeholder="Expected Results"
          className="border p-2 w-full mb-2"
          onChange={(e) =>
            setNewTestCase({
              ...newTestCase,
              expected_results: e.target.value,
            })
          }
        />

        <select
          className="border p-2 w-full mb-2"
          value={newTestCase.priority}
          onChange={(e) =>
            setNewTestCase({
              ...newTestCase,
              priority: e.target.value,
            })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              createMutation.mutate({
                ...newTestCase,
                screen: screenId,
              });
              setIsCreateModalOpen(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* EDIT */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit TestCase"
      >
        {editingTestCase && (
          <>
            <input
              className="border p-2 w-full mb-2"
              value={editingTestCase.title}
              onChange={(e) =>
                setEditingTestCase({
                  ...editingTestCase,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full mb-2"
              value={editingTestCase.description}
              onChange={(e) =>
                setEditingTestCase({
                  ...editingTestCase,
                  description: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full"
              value={editingTestCase.expected_results}
              onChange={(e) =>
                setEditingTestCase({
                  ...editingTestCase,
                  expected_results: e.target.value,
                })
              }
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateMutation.mutate({
                    id: editingTestCase.uuid,
                    data: {
                      title: editingTestCase.title,
                      description: editingTestCase.description,
                      expected_results: editingTestCase.expected_results,
                    },
                  });

                  setIsEditModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* DELETE */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete TestCase"
      >
        <p>Are you sure?</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              deleteMutation.mutate(testcaseToDelete.uuid);
              setIsDeleteModalOpen(false);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </Modal>


    </div>
  );
}