import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/designations");
  return set({
    designationType: data,
  });
};

const designationType = {
  designationType: [],
};

const createDesignationTypeStore = (set) => ({
  ...designationType,
  fetchAllDesignationType: () => fetchAll(set),
  storeAllDesignationType: (data) =>
    set({
      designationType: data,
    }),
});

export const designationTypeStore = createWithEqualityFn(
  createDesignationTypeStore,
);
