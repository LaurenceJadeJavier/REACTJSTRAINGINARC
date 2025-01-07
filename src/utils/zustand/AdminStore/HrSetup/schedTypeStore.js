import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/schedule-types");
  return set({
    scheduleType: data,
  });
};

const scheduleType = {
  scheduleType: [],
};

const createScheduleTypeStore = (set) => ({
  ...scheduleType,
  fetchAllScheduleType: () => fetchAll(set),
  storeAllScheduleType: (data) =>
    set({
      scheduleType: data,
    }),
});

export const schedTypeStore = createWithEqualityFn(createScheduleTypeStore);
