import { useState, useEffect } from "react";
import { createBug } from "@/utils/api/bug.api";

export function BugModal({
  isOpen,
  onClose,
  testCase,
  projectId,
  moduleId,
  screenId,
  actualResult,
}: any) {
  const [form, setForm] = useState({
    description: "",
    steps_to_reproduce: "",
    expected_results: "",
    severity: "high",
  });

  useEffect(() => {
    if (testCase) {
      setForm((prev) => ({
        ...prev,
        expected_results: testCase.expected_results || "",
      }));
    }
  }, [testCase]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-lg shadow-lg w-[450px] p-6 space-y-4">

        <h2 className="text-xl font-semibold">
          Report Bug
        </h2>

        {/* 🔹 SHOW ACTUAL (READ ONLY) */}
        <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
          <strong>Actual Result:</strong> {actualResult || "Not provided"}
        </div>

        <textarea
          placeholder="Description"
          className="w-full border rounded-md p-2"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <textarea
          placeholder="Steps to reproduce"
          className="w-full border rounded-md p-2"
          onChange={(e) =>
            setForm({ ...form, steps_to_reproduce: e.target.value })
          }
        />

        <select
          className="w-full border rounded-md p-2"
          onChange={(e) =>
            setForm({ ...form, severity: e.target.value })
          }
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {/* 🔥 BUTTONS */}
        <div className="flex justify-between">

          {/* 🔙 BACK BUTTON */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Back
          </button>

          {/* CREATE */}
          <button
            onClick={async () => {
              await createBug({
                ...form,
                actual_results: actualResult,
                project: projectId,
                module: moduleId,
                screen: screenId,
                test_case: testCase?.uuid,
              });

              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
          >
            Create Bug
          </button>

        </div>

      </div>
    </div>
  );
}