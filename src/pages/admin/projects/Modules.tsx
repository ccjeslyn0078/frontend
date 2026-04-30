import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Plus, FolderKanban } from "lucide-react";
import { ModuleModal } from "../../../components/ModuleModal";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/layout/BreadCrumb";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getModules,
  createModule,
  updateModule,
  deleteModule,
} from "@/utils/api/modules.api";

// ✅ UPDATED IMPORT
import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/api/permissions";

export function Modules() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ GET ROLE FROM AUTH CONTEXT
  const { user } = useAuth();
  const role = user?.role || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any>(null);

  const [moduleToDelete, setModuleToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["modules", projectId],
    queryFn: () => getModules(projectId!),
  });

  const modules = Array.isArray(data)
    ? data
    : data?.results || [];

  const handleEdit = (module: any) => {
    setEditingModule(module);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingModule(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleModuleClick = (module: any) => {
    navigate(`/projects/${projectId}/modules/${module.uuid}/screens`);
  };

  // CREATE
  const createMutation = useMutation({
    mutationFn: createModule,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["modules", projectId],
      });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: updateModule,
    onSuccess: () => {
      refetch();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: deleteModule,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(
        ["modules", projectId],
        (old: any) => {
          if (!old) return old;

          const filtered = (Array.isArray(old)
            ? old
            : old.results
          ).filter((mod: any) => mod.uuid !== deletedId);

          return Array.isArray(old)
            ? filtered
            : { ...old, results: filtered };
        }
      );
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading modules...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load modules
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Modules</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Modules</h1>

        {/* 🔥 CREATE BUTTON */}
        {can(role, "modules", "create") && (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Module
          </button>
        )}
      </div>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module: any) => (
          <div
            key={module.uuid}
            onClick={() => handleModuleClick(module)}
            className="border p-5 rounded cursor-pointer hover:shadow"
          >
            <div className="flex justify-between mb-2">
              <FolderKanban className="text-blue-600" />

              <div className="flex gap-2">

                {/* 🔥 EDIT */}
                {can(role, "modules", "update") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(module);
                    }}
                  >
                    <Pencil className="w-4 h-4 text-blue-500" />
                  </button>
                )}

                {/* 🔥 DELETE */}
                {can(role, "modules", "delete") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModuleToDelete(module);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}

              </div>
            </div>

            <h3 className="font-semibold">{module.name}</h3>

            <p className="text-xs text-gray-500 mt-2">
              Project: {module.project}
            </p>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      <ModuleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        module={editingModule}
        projectId={projectId!}
        onSubmit={(data: any) => {
          if (editingModule) {
            updateMutation.mutate({
              id: editingModule.uuid,
              data: { ...data, projectId },
            });
          } else {
            createMutation.mutate({
              ...data,
              projectId,
            });
          }
        }}
      />

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Delete Module
            </h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this module?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteMutation.mutate(moduleToDelete.uuid);
                  setIsDeleteModalOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}