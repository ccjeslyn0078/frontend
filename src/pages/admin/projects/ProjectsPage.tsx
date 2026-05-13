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

import { useAuth } from "@/context/AuthContext";

import { can } from "@/utils/api/permissions";

export function ProjectsPage() {

  const navigate = useNavigate();

  const queryClient =
    useQueryClient();

  const { user } = useAuth();

  const role = user?.role || "";

  const [
    isCreateModalOpen,
    setIsCreateModalOpen,
  ] = useState(false);

  const [newProject, setNewProject] =
    useState({

      title: "",

      description: "",

    });

  const [
    editingProject,
    setEditingProject,
  ] = useState<any>(null);

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [
    projectToDelete,
    setProjectToDelete,
  ] = useState<any>(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  // =========================================
  // GET PROJECTS
  // =========================================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: ["projects"],

    queryFn: getProjects,

  });

  const projects = (
    Array.isArray(data)
      ? data
      : data?.results || []
  ).sort(

    (a: any, b: any) =>

      new Date(
        a.created_at || 0
      ).getTime() -

      new Date(
        b.created_at || 0
      ).getTime()

  );

  // =========================================
  // CREATE
  // =========================================

  const createMutation =
    useMutation({

      mutationFn: createProject,

      onSuccess: async () => {

        await queryClient.invalidateQueries({

          queryKey: ["projects"],

        });

        setIsCreateModalOpen(false);

        setNewProject({

          title: "",

          description: "",

        });

      },

    });

  // =========================================
  // UPDATE
  // =========================================

  const updateMutation =
    useMutation({

      mutationFn: updateProject,

      onSuccess: async () => {

        await queryClient.invalidateQueries({

          queryKey: ["projects"],

        });

        setIsEditModalOpen(false);

        setEditingProject(null);

      },

    });

  // =========================================
  // DELETE
  // =========================================

  const deleteMutation =
    useMutation({

      mutationFn: deleteProject,

      onSuccess: async (
        _,
        deletedUuid
      ) => {

        await queryClient.setQueryData(

          ["projects"],

          (old: any) => {

            if (!old) return old;

            const filtered = (
              Array.isArray(old)
                ? old
                : old.results
            ).filter(

              (proj: any) =>
                proj.uuid !== deletedUuid

            );

            return Array.isArray(old)

              ? filtered

              : {
                  ...old,
                  results: filtered,
                };

          }
        );

        setIsDeleteModalOpen(false);

        setProjectToDelete(null);

      },

    });

  // =========================================
  // CLICK PROJECT
  // =========================================

  const handleProjectClick = (
    project: any
  ) => {

    console.log(
      "PROJECT:",
      project
    );

    console.log(
      "UUID:",
      project.uuid
    );

    navigate(
      `/projects/${project.uuid}/modules`
    );

  };

  // =========================================
  // LOADING
  // =========================================

  if (isLoading) {

    return (
      <div className="p-6">
        Loading projects...
      </div>
    );

  }

  // =========================================
  // ERROR
  // =========================================

  if (isError) {

    return (

      <div className="p-6 text-red-500">

        Failed to load projects

      </div>

    );

  }

  return (

    <div className="p-8">

      {/* GLOBAL LOADER */}

      {(

        createMutation.isPending ||

        updateMutation.isPending ||

        deleteMutation.isPending

      ) && (

        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center">

          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        </div>

      )}

      {/* HEADER */}

      <div className="flex justify-between mb-6">

        <h1 className="text-2xl font-semibold">

          Projects

        </h1>

        {/* CREATE */}

        {can(
          role,
          "projects",
          "create"
        ) && (

          <button

            onClick={() =>
              setIsCreateModalOpen(true)
            }

            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded
              cursor-pointer
            "
          >

            + New Project

          </button>

        )}

      </div>

      {/* GRID */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {projects.map((project: any) => (

          <div

            key={project.uuid}

            onClick={() =>
              handleProjectClick(project)
            }

            className="
              border
              p-5
              rounded
              cursor-pointer
              hover:shadow
            "
          >

            <div className="flex justify-between mb-2">

              <FolderKanban className="text-blue-600" />

              <div className="flex gap-2">

                {/* EDIT */}

                {can(
                  role,
                  "projects",
                  "update"
                ) && (

                  <button

                    className="cursor-pointer"

                    onClick={(e) => {

                      e.stopPropagation();

                      setEditingProject(project);

                      setIsEditModalOpen(true);

                    }}
                  >

                    <Pencil className="w-4 h-4 text-blue-500" />

                  </button>

                )}

                {/* DELETE */}

                {can(
                  role,
                  "projects",
                  "delete"
                ) && (

                  <button

                    className="cursor-pointer"

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

            <h3 className="font-semibold">

              {project.title}

            </h3>

            <p className="text-sm text-gray-600">

              {project.description}

            </p>

          </div>

        ))}

      </div>

      {/* CREATE MODAL */}

      <Modal

        isOpen={isCreateModalOpen}

        onClose={() =>
          setIsCreateModalOpen(false)
        }

        title="Create Project"
      >

        {/* TITLE */}

        <div className="mb-4">

          <label className="block mb-1 font-medium">

            Title

          </label>

          <input

            placeholder="Enter title"

            className="border p-2 w-full rounded"

            value={newProject.title}

            onChange={(e) =>

              setNewProject({

                ...newProject,

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

            value={newProject.description}

            onChange={(e) =>

              setNewProject({

                ...newProject,

                description: e.target.value,

              })

            }
          />

        </div>

        <div className="flex gap-2 mt-3">

          <button

            onClick={() =>
              setIsCreateModalOpen(false)
            }

            className="
              bg-gray-300
              px-4
              py-2
              rounded
            "
          >

            Cancel

          </button>

          <button

            disabled={
              createMutation.isPending
            }

            onClick={() => {

              createMutation.mutate(
                newProject
              );

            }}

            className="
              bg-blue-600
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >

            {createMutation.isPending

              ? "Creating..."

              : "Create"}

          </button>

        </div>

      </Modal>

      {/* EDIT MODAL */}

      <Modal

        isOpen={isEditModalOpen}

        onClose={() =>
          setIsEditModalOpen(false)
        }

        title="Edit Project"
      >

        {editingProject && (

          <>

            <input

              className="
                border
                p-2
                w-full
                mb-2
              "

              value={editingProject.title}

              onChange={(e) =>

                setEditingProject({

                  ...editingProject,

                  title: e.target.value,

                })

              }
            />

            <textarea

              className="
                border
                p-2
                w-full
              "

              value={
                editingProject.description
              }

              onChange={(e) =>

                setEditingProject({

                  ...editingProject,

                  description:
                    e.target.value,

                })

              }
            />

            <div className="flex gap-2 mt-3">

              <button

                onClick={() =>
                  setIsEditModalOpen(false)
                }

                className="
                  bg-gray-300
                  px-4
                  py-2
                  rounded
                "
              >

                Cancel

              </button>

              <button

                disabled={
                  updateMutation.isPending
                }

                onClick={() => {

                  updateMutation.mutate({

                    // ✅ FIXED
                    uuid:
                      editingProject.uuid,

                    data: {

                      title:
                        editingProject.title,

                      description:
                        editingProject.description,

                    },

                  });

                }}

                className="
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded
                  disabled:opacity-50
                "
              >

                {updateMutation.isPending

                  ? "Updating..."

                  : "Update"}

              </button>

            </div>

          </>

        )}

      </Modal>

      {/* DELETE MODAL */}

      <Modal

        isOpen={isDeleteModalOpen}

        onClose={() =>
          setIsDeleteModalOpen(false)
        }

        title="Delete Project"
      >

        <p>

          Are you sure you want to delete this project?

        </p>

        <div className="flex gap-2 mt-3">

          <button

            onClick={() =>
              setIsDeleteModalOpen(false)
            }

            className="
              bg-gray-300
              px-4
              py-2
              rounded
            "
          >

            Cancel

          </button>

          <button

            disabled={
              deleteMutation.isPending
            }

            onClick={() => {

              if (
                !projectToDelete?.uuid
              ) return;

              deleteMutation.mutate(
                projectToDelete.uuid
              );

            }}

            className="
              bg-red-600
              text-white
              px-4
              py-2
              rounded
              disabled:opacity-50
            "
          >

            {deleteMutation.isPending

              ? "Deleting..."

              : "Delete"}

          </button>

        </div>

      </Modal>

    </div>

  );

}