import { useState } from "react";
import {
  FolderKanban,
  Pencil,
  Trash2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/utils/api/project.api";

import { getRole, can } from "@/utils/api/permissions"; // ✅ added

export function ProjectsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const role = getRole(); // ✅ ONLY ONCE

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });

  const [editingProject, setEditingProject] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [projectToDelete, setProjectToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = Array.isArray(data)
    ? data
    : data?.results || [];

  // CREATE
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => {
      refetch();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, variables) => {
      const deletedId = variables;

      queryClient.setQueryData(["projects"], (old: any) => {
        if (!old) return old;

        const filtered = (Array.isArray(old) ? old : old.results).filter(
          (proj: any) => proj.id !== deletedId
        );

        return Array.isArray(old)
          ? filtered
          : { ...old, results: filtered };
      });
    },
  });

  const handleProjectClick = (project: any) => {
    navigate(`/projects/${project.id}/modules`);
  };

  if (isLoading) {
    return <div className="p-6">Loading projects...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load projects
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>

        {/* 🔥 CREATE */}
        {can(role, "projects", "create") && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => (
          <div
            key={project.id}
            onClick={() => handleProjectClick(project)}
            className="border p-5 rounded cursor-pointer hover:shadow"
          >
            <div className="flex justify-between mb-2">
              <FolderKanban className="text-blue-600" />

              <div className="flex gap-2">

                {/* 🔥 UPDATE */}
                {can(role, "projects", "update") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(project);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                )}

                {/* 🔥 DELETE */}
                {can(role, "projects", "delete") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProjectToDelete(project);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}

              </div>
            </div>

            <h3 className="font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-600">
              {project.description}
            </p>
          </div>
        ))}
      </div>

      {/* CREATE */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Project"
      >
        <input
          placeholder="Title"
          className="border p-2 w-full mb-2"
          value={newProject.title}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              title: e.target.value,
            })
          }
        />

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={newProject.description}
          onChange={(e) =>
            setNewProject({
              ...newProject,
              description: e.target.value,
            })
          }
        />

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              createMutation.mutate(newProject);
              setIsCreateModalOpen(false);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
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
              className="border p-2 w-full mb-2"
              value={editingProject.title}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject,
                  title: e.target.value,
                })
              }
            />

            <textarea
              className="border p-2 w-full"
              value={editingProject.description}
              onChange={(e) =>
                setEditingProject({
                  ...editingProject,
                  description: e.target.value,
                })
              }
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  updateMutation.mutate({
                    id: editingProject.id,
                    data: {
                      title: editingProject.title,
                      description: editingProject.description,
                    },
                  });
                  setIsEditModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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
        title="Delete Project"
      >
        <p>Are you sure you want to delete this project?</p>

        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              deleteMutation.mutate(projectToDelete.id);
              setIsDeleteModalOpen(false);
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}