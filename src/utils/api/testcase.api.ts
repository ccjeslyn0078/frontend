import API from "@/utils/api/fetchclient";

// ✅ GET
export const getTestCases = async (screenId: string) => {
  return API(`/testcases/?screen=${screenId}`, {
    method: "GET",
  });
};

// ➕ CREATE
export const createTestCase = async (data: any) => {
  return API(`/testcases/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// ✏️ UPDATE
export const updateTestCase = async ({ id, data }: any) => {
  return API(`/testcases/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

// ❌ DELETE
export const deleteTestCase = async (id: string) => {
  return API(`/testcases/${id}/`, {
    method: "DELETE",
  });
};