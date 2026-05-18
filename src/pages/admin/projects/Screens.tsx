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

import { useAuth } from "@/context/AuthContext";
import { can } from "@/utils/api/permissions";

export function Screens() {

  const { projectId, moduleId } = useParams();

  const queryClient = useQueryClient();

  const { user } = useAuth();

  const role = user?.role || "";

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const [
    editingScreen,
    setEditingScreen,
  ] = useState<any>(null);

  const [
    selectedScreen,
    setSelectedScreen,
  ] = useState<string | null>(null);

  const [
    screenToDelete,
    setScreenToDelete,
  ] = useState<any>(null);

  const [
    isDeleteModalOpen,
    setIsDeleteModalOpen,
  ] = useState(false);

  // =====================================================
  // FETCH SCREENS
  // =====================================================

  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "screens",
      moduleId,
    ],

    queryFn: () =>
      getScreens(moduleId!),

  });

  const screens = (
    Array.isArray(data)
      ? data
      : data?.results || []
  ).sort(
    (a: any, b: any) =>
      new Date(
        a.created_at || 0
      ).getTime()
      -
      new Date(
        b.created_at || 0
      ).getTime()
  );

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleEdit = (
    screen: any
  ) => {

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

  const handleScreenClick = (
    screenId: string
  ) => {

    setSelectedScreen(screenId);

  };

  const handleCloseSelection = () => {

    setSelectedScreen(null);

  };

  const selectedScreenData =
    screens.find(
      (s: any) =>
        s.uuid === selectedScreen
    );

  // =====================================================
  // CREATE
  // =====================================================

  const createMutation = useMutation({

    mutationFn: createScreen,

    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: [
          "screens",
          moduleId,
        ],
      });

      handleCloseModal();

    },

  });

  // =====================================================
  // UPDATE
  // =====================================================

  const updateMutation = useMutation({

    mutationFn: updateScreen,

    onSuccess: async () => {

      await queryClient.invalidateQueries({
        queryKey: [
          "screens",
          moduleId,
        ],
      });

      handleCloseModal();

    },

  });

  // =====================================================
  // DELETE
  // =====================================================

  const deleteMutation = useMutation({

    mutationFn: deleteScreen,

    onSuccess: async (
      _,
      deletedId
    ) => {

      await queryClient.setQueryData(
        ["screens", moduleId],
        (old: any) => {

          if (!old) return old;

          const filtered = (
            Array.isArray(old)
              ? old
              : old.results
          ).filter(
            (scr: any) =>
              scr.uuid !== deletedId
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

      setScreenToDelete(null);

    },

  });

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {

    return (
      <div className="p-6">
        Loading screens...
      </div>
    );

  }

  // =====================================================
  // ERROR
  // =====================================================

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

        <div
          className="
            fixed
            inset-0
            bg-black/20
            backdrop-blur-sm
            z-[999]
            flex
            items-center
            justify-center
          "
        >

          <div
            className="
              w-16
              h-16
              border-4
              border-gray-300
              border-t-black
              rounded-full
              animate-spin
            "
          />

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

            <BreadcrumbPage>
              Screens
            </BreadcrumbPage>

          </BreadcrumbItem>

        </BreadcrumbList>

      </Breadcrumb>

      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <h2
          className="
            text-2xl
            font-semibold
            text-gray-800
          "
        >
          Screens
        </h2>

        {can(role, "screens", "create") && (

          <button
            onClick={handleAdd}
            className="
              bg-blue-500
              hover:bg-blue-600
              transition
              text-white
              px-4
              py-2
              rounded-lg
              flex
              items-center
              gap-2
              cursor-pointer
            "
          >

            <Plus className="w-5 h-5" />

            Create Screen

          </button>

        )}

      </div>

      {/* TABLE */}

      <div
        className="
          bg-white
          rounded-xl
          shadow-md
          overflow-hidden
        "
      >

        <table className="w-full">

          {/* TABLE HEAD */}

          <thead
            className="
              bg-gray-50
              border-b
              border-gray-200
            "
          >

            <tr>

              <th
                className="
                  px-8
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  w-[25%]
                "
              >
                Screen
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  w-[15%]
                "
              >
                Code
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-sm
                  font-semibold
                  text-gray-700
                  w-[45%]
                "
              >
                Description
              </th>

              <th
                className="
                  px-10
                  py-4
                  text-center
                  text-sm
                  font-semibold
                  text-gray-700
                  w-[15%]
                "
              >
                Actions
              </th>

            </tr>

          </thead>

          {/* TABLE BODY */}

          <tbody>

            {screens.map(
              (screen: any) => (

                <tr
                  key={screen.uuid}
                  className="
                    border-b
                    border-gray-100
                    hover:bg-gray-50
                    transition
                  "
                >

                  {/* SCREEN */}

                  <td className="px-8 py-5">

                    <button
                      onClick={() =>
                        handleScreenClick(
                          screen.uuid
                        )
                      }
                      className="
                        text-blue-600
                        hover:text-blue-700
                        hover:underline
                        font-medium
                        cursor-pointer
                        transition
                      "
                    >

                      {screen.name}

                    </button>

                  </td>

                  {/* CODE */}

                  <td className="px-6 py-5">

                    <div
                      className="
                        inline-flex
                        items-center
                        px-3
                        py-1
                        rounded-md
                        bg-gray-100
                        text-gray-700
                        text-xs
                        font-semibold
                        tracking-wide
                      "
                    >

                      {screen.code}

                    </div>

                  </td>

                  {/* DESCRIPTION */}

                  <td
                    className="
                      px-6
                      py-5
                      text-gray-700
                    "
                  >

                    {screen.description || "-"}

                  </td>

                  {/* ACTIONS */}

                  <td className="px-10 py-5">

                    <div
                      className="
                        flex
                        items-center
                        justify-center
                        gap-4
                      "
                    >

                      {can(
                        role,
                        "screens",
                        "update"
                      ) && (

                        <button
                          onClick={() =>
                            handleEdit(screen)
                          }
                          className="
                            text-gray-700
                            hover:text-black
                            transition
                            cursor-pointer
                          "
                        >

                          <Pencil className="w-5 h-5" />

                        </button>

                      )}

                      {can(
                        role,
                        "screens",
                        "delete"
                      ) && (

                        <button
                          className="
                            text-gray-700
                            hover:text-red-600
                            transition
                            cursor-pointer
                          "
                          onClick={() => {

                            setScreenToDelete(screen);

                            setIsDeleteModalOpen(true);

                          }}
                        >

                          <Trash2 className="w-5 h-5" />

                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              )
            )}

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

              data: {
                ...data,
                moduleId,
              },

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

        <div
          className="
            fixed
            inset-0
            flex
            items-center
            justify-center
            backdrop-blur-sm
            bg-black/20
            z-50
          "
        >

          <div
            className="
              bg-white
              rounded-xl
              p-6
              w-[400px]
              shadow-lg
            "
          >

            <h2
              className="
                text-lg
                font-semibold
                mb-3
              "
            >
              Delete Screen
            </h2>

            <p
              className="
                text-gray-600
                mb-5
              "
            >
              Are you sure you want to
              delete this screen?
            </p>

            <div
              className="
                flex
                justify-end
                gap-3
              "
            >

              <button
                onClick={() =>
                  setIsDeleteModalOpen(false)
                }
                className="
                  px-4
                  py-2
                  bg-gray-200
                  rounded-lg
                  hover:bg-gray-300
                  transition
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
                    !screenToDelete?.uuid
                  ) return;

                  deleteMutation.mutate(
                    screenToDelete.uuid
                  );

                }}

                className="
                  px-4
                  py-2
                  bg-red-600
                  hover:bg-red-700
                  transition
                  text-white
                  rounded-lg
                  disabled:opacity-50
                "
              >

                {deleteMutation.isPending
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </div>

      )}

      {/* POPUP */}

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