import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Bug,
  Search,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/layout/BreadCrumb";

interface BugItem {
  id: string;
  title: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  assignedTo: string;
  relatedTC: string;
  createdDate: string;
}

const initialBugs: BugItem[] = [
  {
    id: "BUG-001",
    title: "Login button not responding on mobile",
    description: "Issue in mobile login",
    severity: "Critical",
    status: "Open",
    assignedTo: "John",
    relatedTC: "TC-001",
    createdDate: "2026-04-15",
  },
];

const severityStyles = {
  Critical: "bg-purple-100 text-purple-700",
  High: "bg-red-100 text-red-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-blue-100 text-blue-700",
};

const statusStyles = {
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
};

export default function BugsPage() {
  const { projectId, moduleId } = useParams();
  const [bugs] = useState(initialBugs);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = bugs.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 MAIN CONTAINER FIX */}
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
                Bugs
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Bug Tracker
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage bugs
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm">
            <Plus className="w-4 h-4" />
            Report Bug
          </button>
        </div>

        {/* Search */}
        <div className="mb-4 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Bug ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Assigned
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((bug) => (
                <tr key={bug.id} className="border-b hover:bg-gray-50">

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bug.id}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">
                      {bug.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {bug.description}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${severityStyles[bug.severity]}`}>
                      {bug.severity}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded ${statusStyles[bug.status]}`}>
                      {bug.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {bug.assignedTo}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {bug.createdDate}
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