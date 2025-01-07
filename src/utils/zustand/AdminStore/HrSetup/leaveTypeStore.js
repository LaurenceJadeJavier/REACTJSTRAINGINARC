import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/leave-types");
  return set({
    leaveType: data,
  });
};

const leaveType = {
  leaveType: [],
};

const createLeaveTypeStore = (set) => ({
  ...leaveType,
  fetchAllLeaveType: () => fetchAll(set),
  storeAllLeaveType: (data) =>
    set({
      leaveType: data,
    }),
});

export const leaveTypeStore = createWithEqualityFn(createLeaveTypeStore);
