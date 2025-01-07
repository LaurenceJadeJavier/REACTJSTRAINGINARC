import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/applications?type=overtime");
  return set({
    overtimeData: data,
  });
};

const overtimeState = {
  overtimeData: [],
};

const createOvertimeStore = (set) => ({
  ...overtimeState,
  fetchAllOvertime: () => fetchAll(set),
  storeAllOvertime: (data) => {
    return set({
      overtimeData: data,
    });
  },
});

export const overtimeStore = createWithEqualityFn(createOvertimeStore);
