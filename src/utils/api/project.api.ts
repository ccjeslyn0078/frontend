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
export const updateProject = async ({
  uuid,
  data,
}: any) => {

  return API(`/projects/${uuid}/`, {

    method: "PATCH",

    body: JSON.stringify({

      title: data.title,

      description: data.description,

    }),

  });

};

// DELETE
export const deleteProject = async ({
  uuid,
}: {
  uuid: string;
}) => {

  return API(`/projects/${uuid}/`, {

    method: "DELETE",

  });

};