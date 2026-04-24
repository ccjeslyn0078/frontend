import API from "@/utils/api/fetchclient";

// GET screens by module
export const getScreens = async (moduleId: string) => {
  return API(`/screens/?module=${moduleId}`, {
    method: "GET",
  });
};

// CREATE screen
export const createScreen = async (data: any) => {
  return API("/screens/", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      module: data.moduleId,
    }),
  });
};

// UPDATE screen
export const updateScreen = async ({ id, data }: any) => {
  return API(`/screens/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      module: data.moduleId,
    }),
  });
};

// DELETE screen
export const deleteScreen = async (id: string) => {
  return API(`/screens/${id}/`, {
    method: "DELETE",
  });
};