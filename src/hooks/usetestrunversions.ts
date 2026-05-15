import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTestRunVersion,
  getTestRunVersions,
} from "@/utils/api/testrunversion.api";

// GET
export const useTestRunVersions =
() => {

  return useQuery({

    queryKey: ["testrunversions"],

    queryFn: getTestRunVersions,

  });

};

// CREATE
export const useCreateTestRunVersion =
() => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn:
      createTestRunVersion,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: [
          "testrunversions",
        ],
      });

    },

  });

};