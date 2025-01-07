import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/applications?type=leave");
  return set({
    leaveData: data,
  });
};

const leaveState = {
  leaveData: [],
  selectedleaveData: {},
};

const createLeaveStore = (set) => ({
  ...leaveState,
  fetchAllLeave: () => fetchAll(set),
  storeAllLeave: (data) => {
    return set({
      leaveData: data,
    });
  },
});

export const leaveStore = createWithEqualityFn(createLeaveStore);
