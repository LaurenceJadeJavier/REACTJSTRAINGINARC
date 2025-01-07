import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/applications?type=failure_to_log");
  return set({
    failureToLogs: data,
  });
};

const failureToLogState = {
  failureToLogs: [],
  selectedFailureToLog: {},
};

const createFailuteToLogStore = (set) => ({
  ...failureToLogState,
  fetchAllFailureToLog: () => fetchAll(set),
  storeAllFailureToLog: (data) => {
    return set({
      failureToLogs: data,
    });
  },
});

export const failureToLogStore = createWithEqualityFn(createFailuteToLogStore);
