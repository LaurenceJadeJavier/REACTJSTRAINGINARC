import { createWithEqualityFn } from "zustand/traditional";

const createLoadingHoc = (set) => ({
  isOpen: false,
  loadingHoc: (data) => set({ isOpen: data }),
});

export const loadingStore = createWithEqualityFn(createLoadingHoc);
