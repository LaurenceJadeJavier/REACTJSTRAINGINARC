import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/payroll-lists");
  return set({
    payrollListData: data,
  });
};

const payrollList = {
  payrollListData: [],
};

const createPayrollListStore = (set) => ({
  ...payrollList,
  fetchAllPayrollList: () => fetchAll(set),
  storeAllPayrollList: (data) => {
    console.log("zustand", data);
    return set({
      payrollListData: data,
    });
  },
});

export const payrollListStore = createWithEqualityFn(createPayrollListStore);
