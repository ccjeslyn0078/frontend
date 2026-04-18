import { useState } from "react";
import {
  FolderKanban,
  Layers,
  FileCheck,
  Play,
  Bug,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
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

  // Create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  // Edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // 🔥 IMPORTANT: now editable
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "E-Commerce App",
      description: "Testing platform for online shopping system",
      modules: 5,
      testCases: 120,
    },
    {
      id: "2",
      name: "Banking System",
      description: "Core banking test suite",
      modules: 8,
      testCases: 200,
    },
    {
      id: "3",
      name: "Healthcare Portal",
      description: "Patient management system testing",
      modules: 4,
      testCases: 90,
    },
  ]);

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
          <h1 className="text-2xl font-semibold text-gray-900">
            All Projects
          </h1>
          <p className="text-gray-600 mt-1">
            Select a project to manage test cases, runs, and bugs
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="bg-white rounded-lg border p-6 hover:shadow-md text-left"
          >
            <div className="flex justify-between mb-4">
              <FolderKanban className="w-6 h-6 text-blue-600" />

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingProject(project);
                    setIsEditModalOpen(true);
                  }}
                  className="text-blue-500"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setProjectToDelete(project);
                    setIsDeleteModalOpen(true);
                  }}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-gray-600">{project.description}</p>

            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>{project.modules} modules</span>
              <span>{project.testCases} test cases</span>
            </div>
          </button>
        ))}
      </div>

      {/* OPTIONS MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedProject?.name || ""}
        size="lg"
      >
        <div className="grid grid-cols-3 gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="border p-4 rounded-lg"
            >
              <option.icon className="w-6 h-6 mb-2" />
              {option.title}
            </button>
          ))}
        </div>
      </Modal>

      {/* CREATE */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Project"
      >
        <input
          placeholder="Title"
          className="w-full border p-2 mb-3"
          value={newProject.name}
          onChange={(e) =>
            setNewProject({ ...newProject, name: e.target.value })
          }
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-3"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({ ...newProject, description: e.target.value })
          }
        />

        <div className="flex justify-end gap-2">
          <button onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
          <button
            onClick={() => {
              setProjects((prev) => [
                ...prev,
                {
                  id: Date.now().toString(),
                  ...newProject,
                  modules: 0,
                  testCases: 0,
                },
              ]);
              setIsCreateModalOpen(false);
            }}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Create
          </button>
        </div>
      </Modal>

      {/* EDIT */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project"
      >
        {editingProject && (
          <>
            <input
              className="w-full border p-2 mb-3"
              value={editingProject.name}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject,
                  name: e.target.value,
                })
              }
            />

            <textarea
              className="w-full border p-2 mb-3"
              value={editingProject.description}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject,
                  description: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  setProjects((prev) =>
                    prev.map((p) =>
                      p.id === editingProject.id ? editingProject : p
                    )
                  );
                  setIsEditModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                Update
              </button>
            </div>
          </>
        )}
      </Modal>

      {/* DELETE */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete?</p>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setIsDeleteModalOpen(false)}>No</button>

          <button
            onClick={() => {
              setProjects((prev) =>
                prev.filter((p) => p.id !== projectToDelete?.id)
              );
              setIsDeleteModalOpen(false);
            }}
            className="bg-red-600 text-white px-4 py-1 rounded"
          >
            Yes
          </button>
        </div>
      </Modal>
    </div>
  );
}