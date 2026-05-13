import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getTestRunsByVersion,
  updateTestRun,
} from "@/utils/api/testrun.api";

// GET RUNS
export const useTestRuns = (
  versionId: string
) => {

  return useQuery({

    queryKey: [
      "testruns",
      versionId,
    ],

    queryFn: () =>
      getTestRunsByVersion(versionId),

    enabled: !!versionId,

  });

};

// UPDATE RUN
export const useUpdateTestRun =
() => {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: updateTestRun,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["testruns"],
      });

    },

  });

};