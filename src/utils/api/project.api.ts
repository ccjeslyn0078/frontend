import API from "@/utils/api/fetchclient";

// GET all
export const getProjects = async () => {
  return API("/projects/", {
    method: "GET",
  });
};

// CREATE
export const createProject = async (data: any) => {
  return API("/projects/", {
    method: "POST",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
    }),
  });
};

// UPDATE
export const updateProject = async ({ id, data }: any) => {
  return API(`/projects/${id}/`, {
    method: "PUT",
    body: JSON.stringify({
      title: data.title,
      description: data.description,
    }),
  });
};

// DELETE
export const deleteProject = async (id: string) => {
  return API(`/projects/${id}/`, {
    method: "DELETE",
  });
};