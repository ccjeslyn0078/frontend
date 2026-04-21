import API from "@/utils/api/fetchclient";

// GET all modules (by project)
export const getModules = async (projectId: string) => {
  return API(`/projects/modules/?project=${projectId}`, {
    method: "GET",
  });
};

// CREATE module
export const createModule = async (data: any) => {
  return API("/projects/modules/", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      project: data.projectId, // ✅ required
    }),
  });
};

// UPDATE module
export const updateModule = async ({ id, data }: any) => {
  return API(`/projects/modules/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      project: data.projectId, // ✅ required
    }),
  });
};

// DELETE module
export const deleteModule = async (id: string) => {
  return API(`/projects/modules/${id}/`, {
    method: "DELETE",
  });
};