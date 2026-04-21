
import { Link, useParams } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { CommonTable } from "../../../../components/ui/Table";
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

  const projectName =
    projectId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Project";
  const moduleName =
    moduleId?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ||
    "Module";

  const testCases = [
    {
      id: "TC-001",
      title: "Verify login with valid credentials",
      description:
        "User should be able to login with correct email and password",
      expectedResult: "User is redirected to dashboard",
      priority: "High",
      status: "Pass",
    },
    {
      id: "TC-002",
      title: "Verify login with invalid credentials",
      description:
        "User should see error message with incorrect credentials",
      expectedResult: "Error message is displayed",
      priority: "High",
      status: "Pass",
    },
    {
      id: "TC-003",
      title: "Verify password reset functionality",
      description:
        "User should receive reset email when requesting password reset",
      expectedResult: "Reset email sent successfully",
      priority: "Medium",
      status: "Fail",
    },
    {
      id: "TC-004",
      title: "Verify session timeout",
      description:
        "User session should expire after 30 minutes of inactivity",
      expectedResult: "User is logged out automatically",
      priority: "Medium",
      status: "Pending",
    },
    {
      id: "TC-005",
      title: "Verify multi-factor authentication",
      description:
        "User should be prompted for 2FA code after login",
      expectedResult: "2FA prompt is displayed",
      priority: "High",
      status: "Pass",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 px-2 py-1 rounded";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded";
      case "Low":
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pass":
        return "bg-green-100 text-green-700 px-2 py-1 rounded";
      case "Fail":
        return "bg-red-100 text-red-700 px-2 py-1 rounded";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 px-2 py-1 rounded";
      default:
        return "bg-gray-100 text-gray-700 px-2 py-1 rounded";
    }
  };

  /* 🔥 COMMON TABLE COLUMNS */
  const columns = [
    { accessorKey: "id", header: "Test Case ID" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "expectedResult", header: "Expected Result" },

    {
      accessorKey: "priority",
      header: "Priority",
      cell: (row: any) => (
        <span className={getPriorityColor(row.priority)}>
          {row.priority}
        </span>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: (row: any) => (
        <span className={getStatusColor(row.status)}>
          {row.status}
        </span>
      ),
    },

    {
      accessorKey: "actions",
      header: "Actions",
      cell: (row: any) => (
        <div className="flex gap-2">
          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 text-red-600 hover:bg-red-50 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Test Case
        </Link>
      </div>

      {/* ✅ COMMON TABLE */}
      <div className="mt-6">
        <CommonTable data={testCases} columns={columns} />
      </div>
    </div>
  );
}

