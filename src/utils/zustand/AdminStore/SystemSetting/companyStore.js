import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/companies");
  return set({
    company: data[0],
  });
};

const company = {
  company: [],
};

const createCompanyStore = (set) => ({
  ...company,
  fetchAllCompany: () => fetchAll(set),
  storeAllCompany: (data) =>
    set({
      company: data?.length > 0 ? data[0] : [],
    }),
});

export const companyStore = createWithEqualityFn(createCompanyStore);
