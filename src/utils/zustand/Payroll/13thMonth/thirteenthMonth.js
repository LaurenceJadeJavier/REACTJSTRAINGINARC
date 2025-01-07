import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const rows = [
  {
    _id: 1,
    dateRange: "Dec 2022 - Nov 2023",
    department: "Department",
    status: "IN REVIEW",
  },
  {
    _id: 2,
    dateRange: "Dec 2022 - Nov 2023",
    department: "Department",
    status: "FOR APPROVAL",
  },
  {
    _id: 3,
    dateRange: "Dec 2022 - Nov 2023",
    department: "Department",
    status: "APPROVED",
  },
  {
    _id: 4,
    dateRange: "Dec 2022 - Nov 2023",
    department: "Department",
    status: "DECLINED",
  },
  {
    _id: 5,
    dateRange: "Dec 2022 - Nov 2023",
    department: "Department",
    status: "VOID",
  },
];

const fetchAll = async (set) => {
  const { data } = await GET("/applications?type=failure_to_log"); // change this to its specified type fetching;
  return set({
    thirteenthMonths: data,
  });
};

const failureToLogState = {
  thirteenthMonths: [...rows],
  selectedThirteenthMonth: {},
};

const createFailuteToLogStore = (set) => ({
  ...failureToLogState,
  fetchAllThirteenthMonth: () => fetchAll(set),
  storeAllThirteenthMonth: (data) => {
    return set({
      thirteenthMonths: data,
    });
  },
});

export const thirteenthStore = createWithEqualityFn(createFailuteToLogStore);
