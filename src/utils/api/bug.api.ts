
import API from "@/utils/api/fetchclient";
// GET
export const getBugs = async (screenId: string) => {
  return API(`/bugs/?screen=${screenId}`, {
    method: "GET",
  });
};

// CREATE
export const createBug = async (data: any) => {
  return API(`/bugs/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// UPDATE
export const updateBug = async ({ id, data }: any) => {
  return API(`/bugs/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// DELETE
export const deleteBug = async (id: string) => {
  return API(`/bugs/${id}/`, {
    method: "DELETE",
  });
};