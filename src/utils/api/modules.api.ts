import API from "@/utils/api/fetchclient";

// GET all modules (by project)
export const getModules = async (projectId: string) => {
  return API(`/modules/?project=${projectId}`, {
    method: "GET",
  });
};

// CREATE module
export const createModule = async (data: any) => {
  return API("/modules/", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      project: data.projectId,
    }),
  });
};

// UPDATE module
export const updateModule = async ({ id, data }: any) => {
  return API(`/modules/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      project: data.projectId,
    }),
  });
};

// DELETE module
export const deleteModule = async (id: string) => {
  return API(`/modules/${id}/`, {
    method: "DELETE",
  });
};