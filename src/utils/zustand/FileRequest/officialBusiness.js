import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/applications?type=official_bussiness");
  return set({
    officialBusinesses: data,
  });
};

const officialBussinessState = {
  officialBusinesses: [],
};

const createOfficialBussinessStore = (set) => ({
  ...officialBussinessState,
  fetchAllOfficialBusinesses: () => fetchAll(set),
  storeAllOfficialBusinesses: (data) => {
    return set({
      officialBusinesses: data,
    });
  },
});

export const officialBusinessStore = createWithEqualityFn(
  createOfficialBussinessStore,
);
