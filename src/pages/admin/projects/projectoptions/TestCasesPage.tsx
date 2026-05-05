import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTestCases,
  updateTestCase,
  deleteTestCase,
  createTestCase,
} from "../../../../utils/api/testcase.api";

import { getRole, can } from "@/utils/api/permissions";
import * as XLSX from "xlsx";

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs",
  medium: "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs",
  low: "bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs",
};

const statusStyles: Record<string, string> = {
  open: "bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs",
  pass: "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs",
  fail: "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs",
};

export default function TestCasesPage() {

  const navigate = useNavigate();
  const { screenId } = useParams();
  const queryClient = useQueryClient();
  const role = getRole();

  const canCreate = can(role, "testcases", "create");
  const canEdit = can(role, "testcases", "update");
  const canDelete = can(role, "testcases", "delete");

  const [searchQuery, setSearchQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: "",
    description: "",
    expected_results: "",
    priority: "medium",
    status: "open",
    type_of_testcase: "functional",
    assigned_to: "",
  });

  const [steps, setSteps] = useState<string[]>([""]);

  const handleStepChange = (index: number, value: string) => {
  const updated: string[] = [...steps];
  updated[index] = value;
  setSteps(updated);
};

const addStep = () => {
  setSteps([...steps, ""]);
};

  const [editingTestCase, setEditingTestCase] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["testcases", screenId],
    queryFn: () => getTestCases(screenId as string),
  });

  const testcases = Array.isArray(data)
    ? data
    : (data as any)?.results || [];

  const createMutation = useMutation({
  mutationFn: createTestCase,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["testcases", screenId] });
    setIsCreateModalOpen(false);

    setSteps([""]);

    // optional (good UX)
    setNewTestCase({
      title: "",
      description: "",
      expected_results: "",
      priority: "medium",
      status: "open",
      type_of_testcase: "functional",
      assigned_to: "",
    });
  },
});

  const updateMutation = useMutation({
  mutationFn: updateTestCase,
  onSuccess: () => {
    // ✅ refresh table data
    queryClient.invalidateQueries({ queryKey: ["testcases", screenId] });

    // ✅ close edit modal
    setIsEditModalOpen(false);

    // ✅ reset editing state (important)
    setEditingTestCase(null);
  },
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
        Priority: "medium",
        Status: "open",
      },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
    XLSX.writeFile(workbook, "testcase_template.xlsx");
  };

  // ✅ IMPORT HANDLER (FIXED)
  const handleFileUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();

    reader.onload = async (evt: any) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

        const formattedData = jsonData.map((row) => ({
          title: row["Title"],
          description: row["Description"],
          expected_results: row["Expected"],
          priority: row["Priority"] || "medium",
          status: row["Status"] || "open",
          screen: screenId,
        }));

        await fetch("http://127.0.0.1:8000/api/testcases/bulk-import/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
          body: JSON.stringify(formattedData),
        });

        alert("Bulk import started (Django Q)");
      } catch {
        alert("Import failed");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Test Cases</h1>

        <div className="flex gap-2">

          {/* ✅ FIXED DOWNLOAD */}
          <button
            onClick={downloadTemplate}
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
          >
            Download Template
          </button>

          {/* ✅ FIXED IMPORT */}
          <label
            className={`px-4 py-2 text-white rounded-lg text-sm ${
              canCreate ? "bg-green-600 cursor-pointer" : "bg-gray-300"
            }`}
          >
            {isUploading ? "Importing..." : "Import"}
            <input
              type="file"
              hidden
              onChange={handleFileUpload}
              disabled={!canCreate}
            />
          </label>

          <button
            disabled={!canCreate}
            onClick={() => setIsCreateModalOpen(true)}
            className={`px-4 py-2 rounded-lg text-sm text-white ${
              canCreate ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            + Create
          </button>
        </div>
      </div>


      {/* SEARCH */}
      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        <input
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
     <thead className="bg-gray-50 border-b">
  <tr>
    <th className="px-4 py-3 text-left">Title</th>
    <th className="px-4 py-3 text-left">Description</th>
    <th className="px-4 py-3 text-left">Steps</th>
    <th className="px-4 py-3 text-left">Expected</th>
    <th className="px-4 py-3 text-left">Priority</th>
    <th className="px-4 py-3 text-left">Status</th>
    <th className="px-4 py-3 text-left">Type</th>
    <th className="px-4 py-3 text-right">Actions</th>
  </tr>
</thead>

          <tbody className="divide-y">
            {filtered.map((tc: any) => (
              <tr key={tc.uuid} className="hover:bg-gray-50">
               <td className="px-4 py-3">{tc.title}</td>

<td className="px-4 py-3">{tc.description}</td>

<td className="px-4 py-3">
  {tc.steps && typeof tc.steps === "object" && Object.keys(tc.steps).length > 0 ? (
    <div className="space-y-1">
      {Object.entries(tc.steps).map(([key, value]: any) => (
        <div key={key} className="text-xs">
          <span className="font-medium">{key}:</span> {value}
        </div>
      ))}
    </div>
  ) : (
    <span className="text-gray-400 text-xs">No steps</span>
  )}
</td>

<td className="px-4 py-3">{tc.expected_results}</td>

<td className="px-4 py-3">
  <span className={priorityStyles[tc.priority]}>
    {tc.priority}
  </span>
</td>

<td className="px-4 py-3">
  <span className={statusStyles[tc.status]}>
    {tc.status}
  </span>
</td>

<td className="px-4 py-3">
  {tc.type_of_testcase}
</td>

                <td className="px-4 py-3 flex justify-end gap-3">
                  <button
                    disabled={!canEdit}
                  onClick={() => {
  if (!canEdit) return;

  setEditingTestCase(tc);

  // ✅ convert object → array for UI
  if (tc.steps && typeof tc.steps === "object") {
    setSteps(Object.values(tc.steps));
  } else {
    setSteps([""]);
  }

  setIsEditModalOpen(true);
}}
                    className={!canEdit ? "opacity-40 cursor-not-allowed" : ""}
                  >
                    <Pencil className="w-4 h-4 text-gray-700" />
                  </button>

                  <button
  disabled={!canDelete}
  onClick={() => {
    if (!canDelete) return;

    if (window.confirm("Are you sure you want to delete this test case?")) {
      deleteMutation.mutate(tc.uuid);
    }
  }}
  className={!canDelete ? "opacity-40 cursor-not-allowed" : ""}
>
  <Trash2 className="w-4 h-4 text-red-500" />
</button>
                </td>
              </tr>
            ))}


          
          </tbody>
        </table>
      </div>

      {/* 🔥 CREATE MODAL (FULL BACKEND FIELDS) */}
      <Modal
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  title="Create Test Case"
>
  {/* TITLE */}
  <input
    placeholder="Title"
    className="border p-2 w-full mb-2"
    value={newTestCase.title}
    onChange={(e) =>
      setNewTestCase({ ...newTestCase, title: e.target.value })
    }
  />

  {/* DESCRIPTION */}
  <textarea
    placeholder="Description"
    className="border p-2 w-full mb-2"
    value={newTestCase.description}
    onChange={(e) =>
      setNewTestCase({ ...newTestCase, description: e.target.value })
    }
  />

  {/* 🔥 STEPS SECTION */}
  <div className="mb-4">
    <label className="font-medium">Steps:</label>

    {steps.map((step, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <span className="w-16">Step {index + 1}:</span>

        <input
          value={step}
          onChange={(e) => handleStepChange(index, e.target.value)}
          className="border p-2 w-full"
        />

        {/* ➕ ADD BUTTON */}
        {index === steps.length - 1 && (
          <button
            onClick={addStep}
            type="button"
            className="px-2 py-1 border rounded hover:bg-gray-100"
          >
            +
          </button>
        )}
      </div>
    ))}
  </div>

  {/* EXPECTED RESULTS */}
  <textarea
    placeholder="Expected Results"
    className="border p-2 w-full mb-2"
    value={newTestCase.expected_results}
    onChange={(e) =>
      setNewTestCase({
        ...newTestCase,
        expected_results: e.target.value,
      })
    }
  />

  {/* PRIORITY */}
  <select
    className="border p-2 w-full mb-2"
    value={newTestCase.priority}
    onChange={(e) =>
      setNewTestCase({ ...newTestCase, priority: e.target.value })
    }
  >
    <option value="high">High</option>
    <option value="medium">Medium</option>
    <option value="low">Low</option>
  </select>

  {/* STATUS */}
  <select
    className="border p-2 w-full mb-2"
    value={newTestCase.status}
    onChange={(e) =>
      setNewTestCase({ ...newTestCase, status: e.target.value })
    }
  >
    <option value="open">Open</option>
    <option value="pass">Pass</option>
    <option value="fail">Fail</option>
  </select>

  {/* TYPE */}
  <select
    className="border p-2 w-full mb-2"
    value={newTestCase.type_of_testcase}
    onChange={(e) =>
      setNewTestCase({
        ...newTestCase,
        type_of_testcase: e.target.value,
      })
    }
  >
    <option value="functional">Functional</option>
    <option value="regression">Regression</option>
    <option value="smoke">Smoke</option>
  </select>


  {/* CREATE BUTTON */}
  <button
    onClick={() =>
      createMutation.mutate({
        ...newTestCase,
        steps: steps, // 🔥 IMPORTANT
        screen: screenId,
      })
    }
    className="bg-green-600 text-white px-4 py-2 rounded"
  >
    Create
  </button>
</Modal>

       {/* 🔥 EDIT MODAL (FULL BACKEND FIELDS) */    }


     <Modal
  isOpen={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  title="Edit Test Case"
>
  {editingTestCase && (
    <>
      {/* TITLE */}
      <input
        placeholder="Title"
        className="border p-2 w-full mb-2"
        value={editingTestCase.title || ""}
        onChange={(e) =>
          setEditingTestCase({ ...editingTestCase, title: e.target.value })
        }
      />

      {/* DESCRIPTION */}
      <textarea
        placeholder="Description"
        className="border p-2 w-full mb-2"
        value={editingTestCase.description || ""}
        onChange={(e) =>
          setEditingTestCase({
            ...editingTestCase,
            description: e.target.value,
          })
        }
      />

      {/* 🔥 STEPS (WORKING SAME AS CREATE) */}
      <div className="mb-4">
        <label className="font-medium">Steps:</label>

        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span className="w-16">Step {index + 1}:</span>

            <input
              value={step || ""}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="border p-2 w-full"
            />

            {index === steps.length - 1 && (
              <button
                onClick={addStep}
                type="button"
                className="px-2 py-1 border rounded hover:bg-gray-100"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {/* EXPECTED RESULTS */}
      <textarea
        placeholder="Expected Results"
        className="border p-2 w-full mb-2"
        value={editingTestCase.expected_results || ""}
        onChange={(e) =>
          setEditingTestCase({
            ...editingTestCase,
            expected_results: e.target.value,
          })
        }
      />

      {/* PRIORITY */}
      <select
        className="border p-2 w-full mb-2"
        value={editingTestCase.priority}
        onChange={(e) =>
          setEditingTestCase({
            ...editingTestCase,
            priority: e.target.value,
          })
        }
      >
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* STATUS */}
      <select
        className="border p-2 w-full mb-2"
        value={editingTestCase.status}
        onChange={(e) =>
          setEditingTestCase({
            ...editingTestCase,
            status: e.target.value,
          })
        }
      >
        <option value="open">Open</option>
        <option value="pass">Pass</option>
        <option value="fail">Fail</option>
      </select>

      {/* TYPE */}
      <select
        className="border p-2 w-full mb-2"
        value={editingTestCase.type_of_testcase}
        onChange={(e) =>
          setEditingTestCase({
            ...editingTestCase,
            type_of_testcase: e.target.value,
          })
        }
      >
        <option value="functional">Functional</option>
        <option value="regression">Regression</option>
        <option value="smoke">Smoke</option>
      </select>

      {/* UPDATE BUTTON */}
      <button
        disabled={updateMutation.isPending}
        onClick={() => {
          if (!editingTestCase) return;

          updateMutation.mutate({
            id: editingTestCase.uuid,
            data: {
              title: editingTestCase.title,
              description: editingTestCase.description,
              steps: steps.filter((s) => s && s.trim() !== ""), // ✅ FIX
              expected_results: editingTestCase.expected_results,
              priority: editingTestCase.priority,
              status: editingTestCase.status,
              type_of_testcase: editingTestCase.type_of_testcase,
              screen: screenId,
            },
          });
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {updateMutation.isPending ? "Updating..." : "Update"}
      </button>
    </>
  )}
</Modal>


</div>
  );
}


