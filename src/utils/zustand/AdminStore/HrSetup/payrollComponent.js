import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/payroll-comps");
  return set({
    payrollCompData: data,
  });
};

const payrollComponent = {
  payrollCompData: [],
};

const createPayrollCompStore = (set) => ({
  ...payrollComponent,
  fetchAllPayrollComponent: () => fetchAll(set),
  storeAllPayrollComponent: (data) =>
    set({
      payrollCompData: data,
    }),
});

export const payrollComponentStore = createWithEqualityFn(
  createPayrollCompStore,
);
