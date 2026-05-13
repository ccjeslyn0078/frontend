import API from "@/utils/api/fetchclient";

// GET BUGS
export const getBugs =
async (screenId: string) => {

  return API(`/bugs/?screen=${screenId}`, {
    method: "GET",
  });

};

// CREATE BUG
export const createBug =
async (data: any) => {

  return API(`/bugs/`, {
    method: "POST",
    body: JSON.stringify(data),
  });

};

// UPDATE BUG
export const updateBug =
async ({
  uuid,
  data,
}: any) => {

  return API(`/bugs/${uuid}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

};

// DELETE BUG
export const deleteBug =
async (uuid: string) => {

  return API(`/bugs/${uuid}/`, {
    method: "DELETE",
  });

};

// REVIEWER COMMENT
export const addBugComment =
async ({
  uuid,
  data,
}: any) => {

  return API(
    `/bugs/${uuid}/comment/`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  );

};