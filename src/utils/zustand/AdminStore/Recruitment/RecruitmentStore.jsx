import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const recruitmentObject = {
  recruitmentData: [],
};

const fetchRecruitmentDataAction = async (set) => {
  try {
    const { data, status } = await GET("/recruitments");
    return status === 200 && set({ recruitmentData: data });
  } catch (err) {
    console.log(`err:`, err);
  }
};

const createRecruitmentStore = (set) => ({
  ...recruitmentObject,
  fetchAllRecruitment: () => fetchRecruitmentDataAction(set),
  //   fetchUserGoal: (id) => fetchUserGoalDataAction(set, id),
  storeAllRecruitment: (data) => set({ recruitmentData: data }),
});

export const recruitmentStore = createWithEqualityFn(createRecruitmentStore);
