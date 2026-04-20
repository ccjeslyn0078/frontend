import { Link, useParams } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

export function TestCaseList() {
  const { projectId, option, moduleId } = useParams();

  const projectName = projectId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Project";
  const moduleName = moduleId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Module";

  const testCases = [
    {
      id: "TC-001",
      title: "Verify login with valid credentials",
      description: "User should be able to login with correct email and password",
      expectedResult: "User is redirected to dashboard",
      priority: "High",
      status: "Pass",
    },
    {
      id: "TC-002",
      title: "Verify login with invalid credentials",
      description: "User should see error message with incorrect credentials",
      expectedResult: "Error message is displayed",
      priority: "High",
      status: "Pass",
    },
    {
      id: "TC-003",
      title: "Verify password reset functionality",
      description: "User should receive reset email when requesting password reset",
      expectedResult: "Reset email sent successfully",
      priority: "Medium",
      status: "Fail",
    },
    {
      id: "TC-004",
      title: "Verify session timeout",
      description: "User session should expire after 30 minutes of inactivity",
      expectedResult: "User is logged out automatically",
      priority: "Medium",
      status: "Pending",
    },
    {
      id: "TC-005",
      title: "Verify multi-factor authentication",
      description: "User should be prompted for 2FA code after login",
      expectedResult: "2FA prompt is displayed",
      priority: "High",
      status: "Pass",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700";
      case "Medium":
        return "bg-yellow-100 text-yellow-700";
      case "Low":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pass":
        return "bg-green-100 text-green-700";
      case "Fail":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

return (
  <div className="p-8">

    {/* Breadcrumb */}
    <Breadcrumb className="mb-4">
      <BreadcrumbList>

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/projects">Projects</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to={`/projects/${projectId}/modules`}>
              {projectName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>Test Cases</BreadcrumbPage>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        <BreadcrumbItem>
          <BreadcrumbPage>{moduleName}</BreadcrumbPage>
        </BreadcrumbItem>

      </BreadcrumbList>
    </Breadcrumb>

    {/* Header */}
    <div className="mt-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Test Cases - {moduleName}
        </h1>
        <p className="text-gray-600 mt-1">
          {testCases.length} test cases found
        </p>
      </div>

      <Link
        to={`/projects/${projectId}/${option}/${moduleId}/test-cases/create`}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Test Case
      </Link>
    </div>

    {/* Table */}
    <div className="bg-white rounded-lg border border-gray-200 mt-6 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">

          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Case ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expected Result</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {testCases.map((testCase) => (
              <tr key={testCase.id} className="hover:bg-gray-50">

                <td className="px-6 py-4">{testCase.id}</td>
                <td className="px-6 py-4">{testCase.title}</td>
                <td className="px-6 py-4">{testCase.description}</td>
                <td className="px-6 py-4">{testCase.expectedResult}</td>

                <td className="px-6 py-4">
                  <span className={getPriorityColor(testCase.priority)}>
                    {testCase.priority}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span className={getStatusColor(testCase.status)}>
                    {testCase.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>

  </div>
);
}