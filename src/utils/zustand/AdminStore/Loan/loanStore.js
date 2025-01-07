import { createWithEqualityFn } from "zustand/traditional";
import { GET } from "../../../../services/api";

const fetchAll = async (set) => {
  const { data } = await GET("/loans");
  return set({
    loanData: data,
  });
};

const loan = {
  loanData: [],
};

const createLoanStore = (set) => ({
  ...loan,
  fetchAllLoan: () => fetchAll(set),
  storeAllLoan: (data) =>
    set({
      loanData: data,
    }),
});

export const loanStore = createWithEqualityFn(createLoanStore);
