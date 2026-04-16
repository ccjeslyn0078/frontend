import { useState } from "react";
import { FolderKanban, Layers, FileCheck, Play, Bug, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";

interface Project {
  id: string;
  name: string;
  description: string;
  modules: number;
  testCases: number;
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const projects: Project[] = [
    {
      id: "ecommerce-platform",
      name: "E-Commerce Platform",
      description: "Testing suite for the main e-commerce web application",
      modules: 12,
      testCases: 245,
    },
    {
      id: "mobile-banking",
      name: "Mobile Banking App",
      description: "Comprehensive testing for iOS and Android banking applications",
      modules: 8,
      testCases: 189,
    },
    {
      id: "crm-system",
      name: "CRM System",
      description: "Customer relationship management platform test suite",
      modules: 15,
      testCases: 312,
    },
    {
      id: "analytics-dashboard",
      name: "Analytics Dashboard",
      description: "Data visualization and reporting dashboard tests",
      modules: 6,
      testCases: 98,
    },
    {
      id: "payment-gateway",
      name: "Payment Gateway",
      description: "Payment processing and security testing",
      modules: 10,
      testCases: 156,
    },
    {
      id: "inventory-management",
      name: "Inventory Management",
      description: "Stock and warehouse management system tests",
      modules: 9,
      testCases: 134,
    },
  ];

  const options = [
    {
      id: "test-cases",
      title: "Test Cases",
      description: "Create, view, edit, and manage test cases",
      icon: FileCheck,
      color: "blue",
    },
    {
      id: "test-run",
      title: "Test Run",
      description: "Execute test cases and update pass/fail status",
      icon: Play,
      color: "green",
    },
    {
      id: "bugs",
      title: "Bugs",
      description: "View and manage bug tickets",
      icon: Bug,
      color: "red",
    },
  ];

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleOptionClick = (optionId: string) => {
    if (selectedProject) {
      setIsModalOpen(false);
      navigate(`/projects/${selectedProject.id}/${optionId}`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Projects</h1>
          <p className="text-gray-600 mt-1">Select a project to manage test cases, runs, and bugs</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all group text-left"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderKanban className="w-6 h-6 text-blue-600" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {project.name}
            </h3>
            <p className="text-gray-600 mt-2 text-sm">{project.description}</p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{project.modules} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{project.testCases} test cases</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Project Options Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject?.name || "Project Options"}
        size="lg"
      >
        <div>
          <p className="text-gray-600 mb-6">Select an option to continue</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all group text-left"
              >
                <div
                  className={`inline-flex p-4 rounded-lg ${
                    option.color === "blue"
                      ? "bg-blue-100"
                      : option.color === "green"
                      ? "bg-green-100"
                      : "bg-red-100"
                  } mb-4`}
                >
                  <option.icon
                    className={`w-8 h-8 ${
                      option.color === "blue"
                        ? "text-blue-600"
                        : option.color === "green"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                  {option.title}
                  <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-gray-600 mt-2 text-sm">{option.description}</p>
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
