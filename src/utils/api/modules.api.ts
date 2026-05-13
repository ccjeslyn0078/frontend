import API from "@/utils/api/fetchclient";

// =========================================
// GET MODULES
// =========================================

export const getModules = async (
  projectId: string
) => {

  return API(
    `/modules/?project=${projectId}`,
    {
      method: "GET",
    }
  );

};

// =========================================
// CREATE MODULE
// =========================================

export const createModule = async (
  data: any
) => {

  return API("/modules/", {

    method: "POST",

    body: JSON.stringify({

      name: data.name,

      // ✅ FIXED
      project: data.project,

    }),

  });

};

// =========================================
// UPDATE MODULE
// =========================================

export const updateModule = async ({
  uuid,
  data,
}: any) => {

  return API(`/modules/${uuid}/`, {

    method: "PATCH",

    body: JSON.stringify({

      name: data.name,

      // ✅ FIXED
      project: data.project,

    }),

  });

};

// =========================================
// DELETE MODULE
// =========================================

export const deleteModule = async (
  uuid: string
) => {

  return API(`/modules/${uuid}/`, {

    method: "DELETE",

  });

};