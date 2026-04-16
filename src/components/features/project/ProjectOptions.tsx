import { useState } from "react";
import { Play, Bug, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProjectOptions({ project }: any) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <div
        className="p-6 border rounded-xl cursor-pointer hover:shadow"
        onClick={() => setOpen(true)}
      >
        <h2 className="text-lg font-semibold">{project.name}</h2>
        <p className="text-sm text-gray-500">
          {project.modules} modules · {project.testCases} test cases
        </p>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[600px]">
            <h2 className="text-lg font-semibold mb-4">
              {project.name}
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div
                onClick={() => navigate("/testcases")}
                className="p-4 border rounded-lg cursor-pointer text-center"
              >
                <FileText className="mx-auto mb-2" />
                Test Cases
              </div>

              <div
                onClick={() => navigate("/testrun")}
                className="p-4 border rounded-lg cursor-pointer text-center"
              >
                <Play className="mx-auto mb-2" />
                Test Run
              </div>

              <div
                onClick={() => navigate("/bugs")}
                className="p-4 border rounded-lg cursor-pointer text-center"
              >
                <Bug className="mx-auto mb-2" />
                Bugs
              </div>
            </div>

            <button
              className="mt-4 text-sm text-gray-500"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}