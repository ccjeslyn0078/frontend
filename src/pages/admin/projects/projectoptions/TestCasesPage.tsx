import { useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil, Trash2, Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
 
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
 
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: "",
    description: "",
    expected_results: "",
    priority: "medium",
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

const removeStep = (index: number) => {
  const updated = steps.filter((_, i) => i !== index);

  setSteps(updated.length ? updated : [""]);
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

  onMutate: async (deletedUuid: string) => {
    await queryClient.cancelQueries({
      queryKey: ["testcases", screenId],
    });

    const previousTestcases =
      queryClient.getQueryData([
        "testcases",
        screenId,
      ]);

    queryClient.setQueryData(
      ["testcases", screenId],
      (old: any) => {
        if (!old) return [];

        // ✅ your API returns direct array
        return old.filter(
          (tc: any) => tc.uuid !== deletedUuid
        );
      }
    );

    return { previousTestcases };
  },

  onError: (_err, _deletedUuid, context) => {
    queryClient.setQueryData(
      ["testcases", screenId],
      context?.previousTestcases
    );
  },

  onSettled: () => {
    queryClient.invalidateQueries({
      queryKey: ["testcases", screenId],
    });
  },
});
 
  const filtered = [...testcases]
  .sort(
    (a: any, b: any) =>
      new Date(a.created_at || 0).getTime() -
      new Date(b.created_at || 0).getTime()
  )
  .filter((tc: any) =>
    tc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  // ✅ DOWNLOAD TEMPLATE
  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        Title: "",
        Description: "",
        Steps: "",
        Expected: "",
        Priority: "",
        Type: "",
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
    steps: row["Steps"]
  ? String(row["Steps"])
      .split(/\n|\r|\d+\./)   // 🔥 handles 1., 2., new lines
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  : [],
          expected_results: row["Expected"],
          priority: row["Priority"] || "medium",
          type_of_testcase:
  row["Type"] ||
  row["type"] ||
  row["TYPE"] ||
  "functional",
          screen: screenId,
        }));
 
        const res = await fetch("http://127.0.0.1:8000/api/testcases/bulk-import/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
  body: JSON.stringify(formattedData),
});
 
if (!res.ok) {
  throw new Error("Bulk import failed");
}
 
alert("Bulk import started successfully");
 
// ✅ close modal
setIsBulkModalOpen(false);
 
// ✅ refresh table
queryClient.invalidateQueries({ queryKey: ["testcases", screenId] });
 
       
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
      <Breadcrumb className="mb-6">
  <BreadcrumbList>

    {/* PROJECTS */}
    <BreadcrumbItem>
      <BreadcrumbLink href="/projects">
        Projects
      </BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbSeparator />

    {/* MODULES */}
    <BreadcrumbItem>
      <BreadcrumbLink
        href={-1 as any}
        onClick={(e) => {
          e.preventDefault();
          navigate(-2);
        }}
      >
        Modules
      </BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbSeparator />

    {/* SCREENS */}
    <BreadcrumbItem>
      <BreadcrumbLink
        href={-1 as any}
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Screens
      </BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbSeparator />

    {/* CURRENT PAGE */}
    <BreadcrumbItem>
      <BreadcrumbPage>Test Cases</BreadcrumbPage>
    </BreadcrumbItem>

  </BreadcrumbList>
</Breadcrumb>
      <div className="flex justify-between items-center mb-6">
 
  <h1 className="text-xl font-semibold">Test Cases</h1>
 
<div className="flex gap-2 items-center">

  {canCreate && (
    <button
      onClick={() => setIsBulkModalOpen(true)}
      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm cursor-pointer"
    >
      Bulk Import
    </button>
  )}

  {canCreate && (
    <button
      onClick={() => {
  setNewTestCase({
    title: "",
    description: "",
    expected_results: "",
    priority: "medium",
    type_of_testcase: "functional",
    assigned_to: "",
  });

  setSteps([""]);

  setIsCreateModalOpen(true);
}}
      className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 cursor-pointer"
    >
      + Create
    </button>
  )}

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
    <th className="px-4 py-3 text-left">Type</th>
    {(canEdit || canDelete) && (
  <th className="px-4 py-3 text-right">Actions</th>
)}
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
      {Object.entries(tc.steps).map(([key, value]: any, index) => (
  <div key={key} className="text-xs">
    <span className="font-medium">
      Step {index + 1}:
    </span>{" "}
    {value}
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
  {tc.type_of_testcase}
</td>
 
<td className="px-4 py-3 flex justify-end gap-3">

  {canEdit && (
    <button
      onClick={() => {
        setEditingTestCase(tc);

        if (tc.steps && typeof tc.steps === "object") {
          setSteps(Object.values(tc.steps));
        } else {
          setSteps([""]);
        }

        setIsEditModalOpen(true);
      }}
    >
      <Pencil className="w-4 h-4 text-gray-700 cursor-pointer" />
    </button>
  )}

  {canDelete && (
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to delete this test case?")) {
          deleteMutation.mutate(tc.uuid);
        }
      }}
    >
      <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
    </button>
  )}

</td>
              </tr>
            ))}
 
 
         
          </tbody>
        </table>
      </div>
      
    
<Modal
  isOpen={isCreateModalOpen}
  onClose={() => {
    const hasData =
      newTestCase.title ||
      newTestCase.description ||
      newTestCase.expected_results ||
      steps.some((s) => s.trim() !== "");

    if (hasData) {
      const confirmClose = window.confirm(
        "Are you sure you want to close? Unsaved data will be lost."
      );

      if (!confirmClose) return;
    }

    setIsCreateModalOpen(false);

    // RESET FORM
    setNewTestCase({
      title: "",
      description: "",
      expected_results: "",
      priority: "medium",
      type_of_testcase: "functional",
      assigned_to: "",
    });

    setSteps([""]);
  }}
  title="Create Test Case"
>

  {/* TITLE */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">
      Title
    </label>

    <input
      placeholder="Enter title"
      className="border p-2 w-full rounded"
      value={newTestCase.title}
      onChange={(e) =>
        setNewTestCase({
          ...newTestCase,
          title: e.target.value,
        })
      }
    />
  </div>

  {/* DESCRIPTION */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">
      Description
    </label>

    <textarea
      placeholder="Enter description"
      className="border p-2 w-full rounded"
      value={newTestCase.description}
      onChange={(e) =>
        setNewTestCase({
          ...newTestCase,
          description: e.target.value,
        })
      }
    />
  </div>

  {/* STEPS */}
  <div className="mb-4">
    <label className="block mb-2 font-medium">
      Steps
    </label>

    {steps.map((step, index) => (
      <div
        key={index}
        className="flex items-center gap-2 mb-2"
      >
        <span className="w-16">
          Step {index + 1}:
        </span>

        <input
          value={step}
          onChange={(e) =>
            handleStepChange(index, e.target.value)
          }
          className="border p-2 w-full rounded"
        />

        <button
          type="button"
          onClick={() => removeStep(index)}
          className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          x
        </button>

        {index === steps.length - 1 && (
          <button
            type="button"
            onClick={addStep}
            className="px-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            +
          </button>
        )}
      </div>
    ))}
  </div>

  {/* EXPECTED RESULTS */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">
      Expected Results
    </label>

    <textarea
      placeholder="Enter expected results"
      className="border p-2 w-full rounded"
      value={newTestCase.expected_results}
      onChange={(e) =>
        setNewTestCase({
          ...newTestCase,
          expected_results: e.target.value,
        })
      }
    />
  </div>

  {/* PRIORITY */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">
      Priority
    </label>

    <select
      className="border p-2 w-full rounded"
      value={newTestCase.priority}
      onChange={(e) =>
        setNewTestCase({
          ...newTestCase,
          priority: e.target.value,
        })
      }
    >
      <option value="high">High</option>
      <option value="medium">Medium</option>
      <option value="low">Low</option>
    </select>
  </div>

  {/* TYPE */}
  <div className="mb-4">
    <label className="block mb-1 font-medium">
      Type
    </label>

    <select
      className="border p-2 w-full rounded"
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
  </div>

  {/* CREATE BUTTON */}
  <button
    onClick={() =>
      createMutation.mutate({
        ...newTestCase,
        steps: steps,
        screen: screenId,
      })
    }
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Title
        </label>

        <input
          placeholder="Enter title"
          className="border p-2 w-full rounded"
          value={editingTestCase.title || ""}
          onChange={(e) =>
            setEditingTestCase({
              ...editingTestCase,
              title: e.target.value,
            })
          }
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Description
        </label>

        <textarea
          placeholder="Enter description"
          className="border p-2 w-full rounded"
          value={editingTestCase.description || ""}
          onChange={(e) =>
            setEditingTestCase({
              ...editingTestCase,
              description: e.target.value,
            })
          }
        />
      </div>

      {/* STEPS */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">
          Steps
        </label>

        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center gap-2 mb-2"
          >
            <span className="w-16">
              Step {index + 1}:
            </span>

            <input
              value={step || ""}
              onChange={(e) =>
                handleStepChange(index, e.target.value)
              }
              className="border p-2 w-full rounded"
            />

            {/* REMOVE BUTTON */}
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              x
            </button>

            {/* ADD BUTTON */}
            {index === steps.length - 1 && (
              <button
                type="button"
                onClick={addStep}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                +
              </button>
            )}
          </div>
        ))}
      </div>

      {/* EXPECTED RESULTS */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Expected Results
        </label>

        <textarea
          placeholder="Enter expected results"
          className="border p-2 w-full rounded"
          value={editingTestCase.expected_results || ""}
          onChange={(e) =>
            setEditingTestCase({
              ...editingTestCase,
              expected_results: e.target.value,
            })
          }
        />
      </div>

      {/* PRIORITY */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Priority
        </label>

        <select
          className="border p-2 w-full rounded"
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
      </div>

      {/* TYPE */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">
          Type
        </label>

        <select
          className="border p-2 w-full rounded"
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
      </div>

      {/* UPDATE BUTTON */}
      <button
        disabled={updateMutation.isPending}
        onClick={() => {
          if (!editingTestCase) return;

          updateMutation.mutate({
            uuid: editingTestCase.uuid,
            data: {
              title: editingTestCase.title,
              description: editingTestCase.description,
              expected_results: editingTestCase.expected_results,
              priority: editingTestCase.priority,
              type_of_testcase:
                editingTestCase.type_of_testcase,

              steps: (steps || [])
                .map((s) => (s || "").trim())
                .filter((s) => s.length > 0)
                .reduce((acc: any, step, index) => {
                  acc[`step ${index + 1}`] = step;
                  return acc;
                }, {}),

              screen: screenId,
            },
          });
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {updateMutation.isPending
          ? "Updating..."
          : "Update"}
      </button>
    </>
  )}
</Modal>
 
 
 
<Modal
  isOpen={isBulkModalOpen}
  onClose={() => setIsBulkModalOpen(false)}
  title="Bulk Import Test Cases"
>
  <div
    className={`border-2 border-dashed rounded-lg p-6 text-center ${
      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
    }`}
    onDragOver={(e) => {
      e.preventDefault();
      setDragActive(true);
    }}
    onDragLeave={() => setDragActive(false)}
    onDrop={(e) => {
      e.preventDefault();
      setDragActive(false);
 
      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload({ target: { files: [file] } });
      }
    }}
  >
    <p className="text-gray-600 mb-2">Drag & Drop file here</p>

<p className="text-sm text-gray-400 mb-4">or</p>

{/* BUTTONS */}
<div className="flex justify-center gap-4">

  {/* UPLOAD BUTTON */}
  <label className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700">
    Upload File
    <input
      type="file"
      hidden
      onChange={handleFileUpload}
    />
  </label>

  {/* DOWNLOAD TEMPLATE */}
  <button
    onClick={downloadTemplate}
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    Download Template
  </button>

</div>

</div>
</Modal>


</div>
);
}
 
 
 