import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/holidays");
  return set({
    holiday: data,
  });
};

const holiday = {
  holiday: [],
};

const createHolidayStore = (set) => ({
  ...holiday,
  fetchAllHoliday: () => fetchAll(set),
  storeAllHoliday: (data) =>
    set({
      holiday: data,
    }),
});

export const holidayStore = createWithEqualityFn(createHolidayStore);
