import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const trainingObject = {
  trainingData: [],
};

const fetchTrainingData = async (set) => {
  const { data, status } = await GET("/trainings");
  return status === 200 && set({ trainingData: data });
};

const createTrainingStore = (set) => ({
  ...trainingObject,
  fetchAllTrainingAction: () => fetchTrainingData(set),
  storeAllTraining: (data) =>
    set({
      trainingData: data,
    }),
});

export const trainingStore = createWithEqualityFn(createTrainingStore);
