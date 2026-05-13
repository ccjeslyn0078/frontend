import API from "@/utils/api/fetchclient";

// GET RUNS BY VERSION
export const getTestRunsByVersion =
async (versionId: string) => {

  return API(
    `/testruns/by-version/${versionId}/`,
    {
      method: "GET",
    }
  );

};

// UPDATE TEST RUN
export const updateTestRun =
async ({
  uuid,
  data,
}: any) => {

  return API(`/testruns/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

};

// REVIEWER COMMENT
export const addTestRunComment =
async ({
  uuid,
  data,
}: any) => {

  return API(
    `/testruns/${uuid}/comment/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

};