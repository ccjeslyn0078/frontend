import API from "@/utils/api/fetchclient";

export const getScreens = async (moduleId: string) => {
  return API(`/projects/screens/?module=${moduleId}`, {
    method: "GET",
  });
};

export const createScreen = async (data: any) => {
  return API("/projects/screens/", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      module: data.moduleId,
    }),
  });
};

export const updateScreen = async ({ id, data }: any) => {
  return API(`/projects/screens/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      module: data.moduleId,
    }),
  });
};

export const deleteScreen = async (id: string) => {
  return API(`/projects/screens/${id}/`, {
    method: "DELETE",
  });
};