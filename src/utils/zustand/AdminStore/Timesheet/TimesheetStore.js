import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/attendances");
  return set({
    timesheetData: data,
  });
};

const timesheetState = {
  timesheetData: [],
};

const createTimesheetStore = (set) => ({
  ...timesheetState,
  fetchAllTimesheet: () => fetchAll(set),
  storeAllTimesheet: (data) => {
    return set({
      timesheetData: data,
    });
  },
});

export const timesheetStore = createWithEqualityFn(createTimesheetStore);
