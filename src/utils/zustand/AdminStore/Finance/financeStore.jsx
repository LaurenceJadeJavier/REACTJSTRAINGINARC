import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const financeObject = {
  financeData: [],
  financeManageData: []
};

const fetchFinanceDataAction = async (set) => {
  try {
    const { data, status } = await GET("/bank-accs/");
    return status === 200 && set({ financeData: data ?? [] });
  } catch (err) {
    console.log("err", err);
  }
};

const getFinanceManageDataAction = async (id, set) => {
  try {
    const { data, status } = await GET("/bank-accs/" + id);
    return status === 200 && set({ financeManageData: data ?? [] });
  } catch (err) {
    console.log("err", err);
  }
};

const createFinanceStore = (set) => ({
  ...financeObject,
  fetchAllFinance: () => fetchFinanceDataAction(set),
  fetchManageFinance: (id) => getFinanceManageDataAction(id, set),
  storeAllFinance: (data) => set({ assetData: data }),
});

export const financeStore = createWithEqualityFn(createFinanceStore);
