import { createWithEqualityFn } from "zustand/traditional";

const filterObject = {
  filteredData: "",
};

const selectFilterInputAction = (e, title, set) => {
  const value = e.target.value;
  const filterData = [...filterStore.getState().filteredData];

  const filterParams = {
    id: title,
    value: value,
  };

  filterData.push(filterParams)

  return set({
    filteredData: filterData,
  });
};

const createfilterStore = (set) => ({
  ...filterObject,
  clearFilterSearch: () => set({ filteredData: "" }),
  handleFilterSearch: (e, title) => selectFilterInputAction(e, title, set),
});

export const filterStore = createWithEqualityFn(createfilterStore);
