import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/schedules");
  return set({
    schedule: data,
  });
};

const schedule = {
  schedule: [],
};

const createScheduleStore = (set) => ({
  ...schedule,
  fetchAllSchedule: () => fetchAll(set),
  storeAllSchedule: (data) =>
    set({
      schedule: data,
    }),
});

export const scheduleStore = createWithEqualityFn(createScheduleStore);
