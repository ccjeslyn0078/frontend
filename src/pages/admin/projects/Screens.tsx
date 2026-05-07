import { useState } from "react";
import { useParams } from "react-router";
import { Pencil, Trash2, Plus } from "lucide-react";
import { ScreenModal } from "../../../components/ScreenModal";
import { SelectionPopup } from "../../../components/SelectionPopup";

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
  getScreens,
  createScreen,
  updateScreen,
  deleteScreen,
} from "@/utils/api/screens.api";

// ✅ UPDATED IMPORT
import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/api/permissions";

export function Screens() {
  const { projectId, moduleId } = useParams();
  const queryClient = useQueryClient();

  // ✅ GET ROLE FROM AUTH CONTEXT
  const { user } = useAuth();
  const role = user?.role || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null);

  const [screenToDelete, setScreenToDelete] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["screens", moduleId],
    queryFn: () => getScreens(moduleId!),
  });

  const screens = (
  Array.isArray(data)
    ? data
    : data?.results || []
).sort(
  (a: any, b: any) =>
    new Date(a.created_at || 0).getTime() -
    new Date(b.created_at || 0).getTime()
);

  const handleEdit = (screen: any) => {
    setEditingScreen(screen);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingScreen(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScreen(null);
  };

  const handleScreenClick = (screenId: string) => {
    setSelectedScreen(screenId);
  };

  const handleCloseSelection = () => {
    setSelectedScreen(null);
  };

  const selectedScreenData = screens.find(
    (s: any) => s.uuid === selectedScreen
  );

  const createMutation = useMutation({
  mutationFn: createScreen,

  onSuccess: async () => {

    await queryClient.invalidateQueries({
      queryKey: ["screens", moduleId],
    });

    handleCloseModal();
  },
});

  const updateMutation = useMutation({
  mutationFn: updateScreen,

  onSuccess: async () => {

    await queryClient.invalidateQueries({
      queryKey: ["screens", moduleId],
    });

    handleCloseModal();
  },
});
  const deleteMutation = useMutation({
  mutationFn: deleteScreen,

  onSuccess: async (_, deletedId) => {

    await queryClient.setQueryData(
      ["screens", moduleId],
      (old: any) => {

        if (!old) return old;

        const filtered = (
          Array.isArray(old)
            ? old
            : old.results
        ).filter(
          (scr: any) => scr.uuid !== deletedId
        );

        return Array.isArray(old)
          ? filtered
          : { ...old, results: filtered };
      }
    );

    setIsDeleteModalOpen(false);
    setScreenToDelete(null);
  },
});

  if (isLoading) {
    return <div className="p-6">Loading screens...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load screens
      </div>
    );
  }

  return (
  <div className="p-6">

    {/* GLOBAL LOADER */}
    {(createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending) && (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] flex items-center justify-center">

        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

      </div>
    )}
      {/* BREADCRUMB */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">
              Projects
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbLink
              href={`/projects/${projectId}/modules`}
            >
              Modules
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Screens</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Screens
        </h2>

        {/* 🔥 CREATE */}
        {can(role, "screens", "create") && (
          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Create Screen
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                Screen Name
              </th>
              <th className="px-6 py-3 text-left">
                Description
              </th>
              <th className="px-6 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {screens.map((screen: any) => (
              <tr key={screen.uuid}>

                <td className="px-6 py-4">
                  <button
                    onClick={() =>
                      handleScreenClick(screen.uuid)
                    }
                    className="text-blue-600 cursor-pointer"
                  >
                    {screen.name}
                  </button>
                </td>

                <td className="px-6 py-4">
                  {screen.description || "-"}
                </td>

                <td className="px-6 py-4 text-right">

{can(role, "screens", "update") && (
  <button
    onClick={() => handleEdit(screen)}
    className="mr-2 cursor-pointer"
  >
    <Pencil />
  </button>
)}

{can(role, "screens", "delete") && (
  <button
    className="cursor-pointer"
    onClick={() => {
      setScreenToDelete(screen);
      setIsDeleteModalOpen(true);
    }}
  >
    <Trash2 />
  </button>
)}

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      <ScreenModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        screen={editingScreen}
        moduleId={moduleId!}
        onSubmit={(data: any) => {
          if (editingScreen) {
            updateMutation.mutate({
              id: editingScreen.uuid,
              data: { ...data, moduleId },
            });
          } else {
            createMutation.mutate({
              ...data,
              moduleId,
            });
          }
        }}
      />

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/20 z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <h2 className="text-lg font-semibold mb-3">
              Delete Screen
            </h2>

            <p className="text-gray-600 mb-5">
              Are you sure you want to delete this screen?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>

              <button
  disabled={deleteMutation.isPending}
  onClick={() => {

    if (!screenToDelete?.uuid) return;

    deleteMutation.mutate(
      screenToDelete.uuid
    );

  }}
  className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
>
  {deleteMutation.isPending ? "Deleting..." : "Delete"}
</button>
            </div>
          </div>
        </div>
      )}

      <SelectionPopup
        isOpen={!!selectedScreen}
        onClose={handleCloseSelection}
        projectId={projectId!}
        moduleId={moduleId!}
        screenId={selectedScreen || ""}
        screenName={selectedScreenData?.name || ""}
      />
    </div>
  );
}