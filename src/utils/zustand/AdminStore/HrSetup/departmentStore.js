import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/departments");
  return set({
    department: data,
  });
};

const department = {
  department: [],
};

const createDepartmentStore = (set) => ({
  ...department,
  fetchAllDepartment: () => fetchAll(set),
  storeAllDepartment: (data) =>
    set({
      department: data,
    }),
});

export const departmentStore = createWithEqualityFn(createDepartmentStore);
