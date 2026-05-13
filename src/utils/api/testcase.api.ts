import API from "@/utils/api/fetchclient";

// GET
export const getTestCases =
async (screenId: string) => {

  return API(
    `/testcases/?screen=${screenId}`,
    {
      method: "GET",
    }
  );

};

// CREATE
export const createTestCase =
async (data: any) => {

  return API(`/testcases/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

};

// UPDATE
export const updateTestCase =
async ({
  uuid,
  data,
}: any) => {

  return API(`/testcases/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

};

// DELETE
export const deleteTestCase =
async (uuid: string) => {

  return API(`/testcases/${uuid}/`, {
    method: "DELETE",
  });

};