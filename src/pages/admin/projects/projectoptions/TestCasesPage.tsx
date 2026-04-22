import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, Edit, Trash2, Search, Filter, ChevronDown } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

interface TestCase {
  id: string;
  title: string;
  description: string;
  expectedResult: string;
  priority: "High" | "Medium" | "Low";
  status: "Pass" | "Fail" | "Pending";
}

const initialTestCases: TestCase[] = [
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
];

const priorityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-gray-100 text-gray-600",
};

const statusStyles = {
  Pass: "bg-green-100 text-green-700",
  Fail: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

export default function TestCasesPage() {
  const { projectId, moduleId } = useParams();
  const [testCases] = useState(initialTestCases);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = testCases.filter((tc) =>
    tc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 MAIN CONTENT CONTAINER (FIXED ALIGNMENT) */}
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList className="text-sm text-gray-500 flex items-center gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/projects/${projectId}/modules`}>
                  Project
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/projects/${projectId}/modules/${moduleId}/screens`}>
                  Module
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-900 font-medium">
                Test Cases
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Test Cases
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all test cases
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
            <Plus className="w-4 h-4" />
            Add Test Case
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search test cases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Expected
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((tc) => (
                <tr key={tc.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{tc.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {tc.title}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {tc.description}
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {tc.expectedResult}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${priorityStyles[tc.priority]}`}>
                      {tc.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${statusStyles[tc.status]}`}>
                      {tc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-2 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button className="p-2 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
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