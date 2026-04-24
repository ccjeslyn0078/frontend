import API from "@/utils/api/fetchclient";

export const createTestRun = async (data: any) => {
  return API(`/testruns/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};