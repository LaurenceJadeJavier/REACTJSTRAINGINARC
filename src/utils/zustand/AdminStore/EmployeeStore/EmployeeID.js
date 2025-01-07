import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/users/info");
  return set({
    employeeidData: data,
  });
};

const employeeIDState = {
  employeeidData: [],
};

const createEmployeeIDStore = (set) => ({
  ...employeeIDState,
  fetchAllEmployeeID: () => fetchAll(set),
  storeAllEmployeeID: (data) => {
    return set({
      employeeidData: data,
    });
  },
});

export const employeeIDStore = createWithEqualityFn(createEmployeeIDStore);
