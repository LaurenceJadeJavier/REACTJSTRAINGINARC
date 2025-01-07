import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/payroll-periods");
  return set({
    payrollPeriods: data,
  });
};

const payrollPeriod = {
  payrollPeriods: [],
};

const createPayrollPeriodStore = (set) => ({
  ...payrollPeriod,
  fetchAllPayrollPeriod: () => fetchAll(set),
  storeAllPayrollPeriod: (data) => {
    set({
      payrollPeriods: data,
    });
  },
});

export const payrollPeriodStore = createWithEqualityFn(
  createPayrollPeriodStore,
);
