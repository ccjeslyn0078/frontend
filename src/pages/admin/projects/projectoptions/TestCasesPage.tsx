import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Search } from "lucide-react";
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

import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/api/permissions";

import * as XLSX from "xlsx";

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 border border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  low: "bg-gray-100 text-gray-600 border border-gray-200",
};

const statusStyles: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 border border-blue-200",
  pass: "bg-green-100 text-green-700 border border-green-200",
  fail: "bg-red-100 text-red-700 border border-red-200",
};

export default function TestCasesPage() {
  const { screenId } = useParams();
  const queryClient = useQueryClient();

  // ✅ AUTH CONTEXT
  const { user } = useAuth();
  const role = user?.role || "";

  const [searchQuery, setSearchQuery] = useState("");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: "",
    description: "",
    expected_results: "",
    priority: "medium",
    status: "open",
  });

  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const canEdit = can(role, "testcases", "update");
  const canDelete = can(role, "testcases", "delete");
  const showActions = canEdit || canDelete;

  const { data, isLoading } = useQuery({
    queryKey: ["testcases", screenId],
    queryFn: () => getTestCases(screenId as string),
    enabled: !!screenId,
  });

  const testcases = Array.isArray(data)
    ? data
    : (data as any)?.results || [];

  const createMutation = useMutation({
    mutationFn: createTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTestCase,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["testcases", screenId] }),
  });

  const filtered = testcases.filter((tc: any) =>
    tc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ DOWNLOAD TEMPLATE
  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        Title: "",
        Description: "",
        Expected: "",
        Priority: "",
        Status: "",
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
    XLSX.writeFile(workbook, "testcase_template.xlsx");
  };

  // ✅ BULK IMPORT
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (evt: any) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

      const formattedData = jsonData.map((row) => ({
        title: row["Title"],
        description: row["Description"],
        expected_results: row["Expected"],
        priority: (row["Priority"] || "medium").toLowerCase(),
        status: (row["Status"] || "open").toLowerCase(),
        screen: screenId,
      }));

      try {
        await fetch("http://127.0.0.1:8000/api/testcases/bulk-import/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(formattedData),
        });

        queryClient.invalidateQueries({ queryKey: ["testcases", screenId] });
        alert("Bulk import successful");
      } catch {
        alert("Bulk import failed");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Test Cases</h1>

        {can(role, "testcases", "create") && (
          <div className="flex gap-2">

            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Download Template
            </button>

            <label className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer">
              Import
              <input type="file" hidden onChange={handleFileUpload} />
            </label>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              + Create
            </button>

          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded border shadow-sm">
        <table className="w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              {showActions && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {filtered.map((tc: any) => (
              <tr key={tc.uuid}>
                <td>{tc.uuid.slice(0, 6)}</td>
                <td>{tc.title}</td>

                <td>
                  <span className={priorityStyles[tc.priority]}>
                    {tc.priority}
                  </span>
                </td>

                <td>
                  <span className={statusStyles[tc.status]}>
                    {tc.status}
                  </span>
                </td>

                {showActions && (
                  <td>

                    {canEdit && (
                      <button
                        onClick={() => {
                          setEditingTestCase(tc);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil />
                      </button>
                    )}

                    {canDelete && (
                      <button onClick={() => deleteMutation.mutate(tc.uuid)}>
                        <Trash2 />
                      </button>
                    )}

                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Test Case"
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
      </Modal>

    </div>
  );
}