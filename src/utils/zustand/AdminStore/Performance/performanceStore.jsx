import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const performanceObject = {
  performanceData: [],
  userGoalData: [],
};

const fetchPerformanceDataAction = async (set) => {
  try {
    const { data, status } = await GET("/performances");
    return status === 200 && set({ performanceData: data });
  } catch (err) {
    console.log(`err:`, err);
  }
};

const fetchUserGoalDataAction = async (set, id) => {
  try {
    const { data, status } = await GET("/goal-lists/employees/" + id);
    return status === 200 && set({ userGoalData: data ?? [] });
  } catch (err) {
    console.log(`err:`, err);
  }
};

const createPerformanceStore = (set) => ({
  ...performanceObject,
  fetchAllPerformance: () => fetchPerformanceDataAction(set),
  fetchUserGoal: (id) => fetchUserGoalDataAction(set, id),
  storeAllPerformance: (data) => set({ performanceData: data }),
});

export const performanceStore = createWithEqualityFn(createPerformanceStore);
