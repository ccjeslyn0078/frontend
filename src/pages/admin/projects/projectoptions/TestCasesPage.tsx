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
  updateTestCase,
  deleteTestCase,
} from "../../../../utils/api/testcase.api";

import { getRole, can } from "@/utils/api/permissions";
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
  const role = getRole();

  const [searchQuery, setSearchQuery] = useState("");
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

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        ID: "",
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
      } catch (err) {
        alert("Bulk import failed");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Test Cases</h1>

        {can(role, "testcases", "create") && (
          <div className="flex gap-2">
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
            >
              Download Template
            </button>

            <label className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm cursor-pointer">
              Import
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* SEARCH */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs text-gray-500">ID</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Title</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Description</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Expected</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Priority</th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">Status</th>

              {showActions && (
                <th className="px-4 py-3 text-right text-xs text-gray-500">Actions</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y">
            {filtered.map((tc: any) => (
              <tr key={tc.uuid} className="hover:bg-gray-50">

                <td className="px-4 py-3 font-mono text-gray-600">
                  {tc.uuid.slice(0, 6)}
                </td>

                <td className="px-4 py-3 font-medium">{tc.title}</td>
                <td className="px-4 py-3 text-gray-600">{tc.description}</td>
                <td className="px-4 py-3 text-gray-600">{tc.expected_results}</td>

                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${priorityStyles[tc.priority]}`}>
                    {tc.priority}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusStyles[tc.status]}`}>
                    {tc.status}
                  </span>
                </td>

                {showActions && (
                  <td className="px-4 py-3 flex justify-end gap-2">

                    {canEdit && (
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

                    {canDelete && (
                      <button
                        onClick={() => {
                          if (confirm("Are you sure?")) {
                            deleteMutation.mutate(tc.uuid);
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    )}

                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Test Case"
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

            <button
              onClick={() => {
                updateMutation.mutate({
                  id: editingTestCase.uuid,
                  data: editingTestCase,
                });
                setIsEditModalOpen(false);
              }}
              className="bg-blue-600 text-white px-4 py-2 mt-3 rounded"
            >
              Update
            </button>
          </>
        )}
      </Modal>

    </div>
  );
}