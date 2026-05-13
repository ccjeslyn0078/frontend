import API from "@/utils/api/fetchclient";

// CREATE
export const createTestRunVersion =
async (data: any) => {

  return API(
    `/testrun-versions/`,
    {
      method: "POST",

      body: JSON.stringify(data),
    }
  );

};

// GET ALL
export const getTestRunVersions =
async () => {

  return API(
    `/testrun-versions/`,
    {
      method: "GET",
    }
  );

};

// UPDATE
export const updateTestRunVersion =
async ({
  uuid,
  data,
}: any) => {

  return API(
    `/testrun-versions/${uuid}/`,
    {
      method: "PATCH",

      body: JSON.stringify(data),
    }
  );

};

// DELETE
export const deleteTestRunVersion =
async (uuid: string) => {

  return API(
    `/testrun-versions/${uuid}/`,
    {
      method: "DELETE",
    }
  );

};