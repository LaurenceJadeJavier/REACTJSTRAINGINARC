import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/restrictions");
  return set({
    restrictionData: data,
  });
};

const restriction = {
  restrictionData: [],
};

const createRestrictionStore = (set) => ({
  ...restriction,
  fetchAllRestriction: () => fetchAll(set),
  storeAllRestriction: (data) =>
    set({
      restrictionData: data,
    }),
});

export const restrictionStore = createWithEqualityFn(createRestrictionStore);
